import { NextResponse } from 'next/server'

export const maxDuration = 30

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface OrderContext {
  name: string
  email: string
  whatsapp: string
  address: string
  orderType: string
  sizes: Record<string, number>
  notes: string
  totalQty: number
  basePrice: number
  totalPrice: number
}

const PRICE_LIST: Record<string, number> = {
  'jersey printing': 150000,
  'jersey': 150000,
  't-shirt custom': 75000,
  't-shirt': 75000,
  'kaos': 75000,
  'varsity jacket': 350000,
  'varsity': 350000,
  'work jacket': 250000,
  'jaket kerja': 250000,
  'corporate uniform': 200000,
  'seragam': 200000,
  'uniform': 200000,
}

function getPricePerPcs(orderType: string): number {
  const lower = orderType.toLowerCase()
  for (const [key, price] of Object.entries(PRICE_LIST)) {
    if (lower.includes(key)) return price
  }
  return 150000
}

function getMaxDiscount(qty: number): number {
  if (qty >= 50) return 15
  if (qty >= 25) return 10
  return 5
}

function buildSystemPrompt(ctx: OrderContext): string {
  const sizeDetail = Object.entries(ctx.sizes)
    .filter(([, qty]) => qty > 0)
    .map(([size, qty]) => `${size}: ${qty} pcs`)
    .join(', ')

  const maxDiscount = getMaxDiscount(ctx.totalQty)
  const minTotal = Math.round(ctx.totalPrice * (1 - maxDiscount / 100))

  return `
Kamu adalah Tim Sales Ashira.co. Kamu sedang bernegosiasi harga dengan customer.
JANGAN pernah bilang kamu AI/chatbot. Kamu manusia, Tim Sales Ashira.co.
Bahasa Indonesia santai, pakai "kak". Panggil nama customer: ${ctx.name}.

DATA ORDER CUSTOMER (sudah diisi di form, JANGAN tanya lagi):
- Nama: ${ctx.name}
- Email: ${ctx.email}
- WhatsApp: ${ctx.whatsapp}
- Produk: ${ctx.orderType}
- Ukuran: ${sizeDetail}
- Total qty: ${ctx.totalQty} pcs
- Harga normal: Rp ${ctx.basePrice.toLocaleString('id-ID')}/pcs
- Total harga: Rp ${ctx.totalPrice.toLocaleString('id-ID')}
- Catatan: ${ctx.notes || 'tidak ada'}

TUGASMU:
- Pesan pertama: langsung sapa customer dengan ringkasan order + total harga.
  Format WAJIB pesan pertama:
  "Halo [nama]! ini ringkasan order kamu:

  produk: [orderType] [totalQty] pcs
  harga: Rp [basePrice]/pcs
  total: Rp [totalPrice]
  estimasi: [X-Y] hari

  apakah kamu deal dengan harga ini, kak? atau ada yang mau didiskusikan? 😊"

- Jika customer setuju langsung → [DEAL_CONFIRMED] + JSON
- Jika customer minta harga lebih murah:
  a. Hitung diskon yang diminta
  b. Batas diskon: ${maxDiscount}% (total minimum Rp ${minTotal.toLocaleString('id-ID')})
  c. Jika melebihi batas: tolak, tawarkan harga minimum kita
  d. Jika dalam batas: setujui
  e. Maksimal 1x counter offer. Jika customer tetap tolak → [DEAL_REJECTED] + JSON
- JANGAN pernah sebut berapa persen batas diskon kita
- JANGAN looping penawaran — 1x tawar, 1x counter, lalu deal atau reject

FORMAT [DEAL_CONFIRMED] — tulis tepat seperti ini, tidak ada teks setelahnya:
[DEAL_CONFIRMED]
{"customer_name":"${ctx.name}","customer_email":"${ctx.email}","customer_whatsapp":"${ctx.whatsapp}","customer_address":"${ctx.address}","order_type":"${ctx.orderType}","sizes":${JSON.stringify(ctx.sizes)},"total_qty":${ctx.totalQty},"base_price":${ctx.basePrice},"negotiated_price":0,"discount_percent":0,"total_price":0,"notes":"${ctx.notes}"}

(isi negotiated_price, discount_percent, total_price sesuai harga yang disepakati)

FORMAT [DEAL_REJECTED] — tulis tepat seperti ini:
[DEAL_REJECTED]
{"customer_name":"${ctx.name}","reason":"harga tidak mencapai kesepakatan"}
`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, orderContext }: { 
      messages: Message[]
      orderContext: OrderContext 
    } = body

    if (!orderContext) {
      return NextResponse.json(
        { message: 'Order context diperlukan' },
        { status: 400 }
      )
    }

    const basePrice = getPricePerPcs(orderContext.orderType)
    const totalQty = Object.values(orderContext.sizes).reduce((a, b) => a + b, 0)
    const totalPrice = basePrice * totalQty

    const ctx: OrderContext = {
      ...orderContext,
      basePrice,
      totalQty,
      totalPrice,
    }

    const systemPrompt = buildSystemPrompt(ctx)

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ]

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 512,
        messages: groqMessages,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error('Groq error:', groqRes.status, errText)
      return NextResponse.json(
        { message: 'Maaf, terjadi kesalahan. Coba lagi.' },
        { status: 502 }
      )
    }

    const groqData = await groqRes.json()
    const raw = groqData.choices[0].message.content as string

    const isDealConfirmed = raw.includes('[DEAL_CONFIRMED]')
    const isDealRejected = raw.includes('[DEAL_REJECTED]')

    let message: string
    let dealData: Record<string, unknown> | null = null

    if (isDealConfirmed || isDealRejected) {
      const marker = isDealConfirmed ? '[DEAL_CONFIRMED]' : '[DEAL_REJECTED]'
      const idx = raw.indexOf(marker)
      message = raw.slice(0, idx).trim()
      const jsonPart = raw.slice(idx + marker.length).trim()
      try {
        dealData = JSON.parse(jsonPart)
        console.log('=== DEAL CONFIRMED ===')
        console.log('dealData:', JSON.stringify(dealData, null, 2))
        console.log('message:', message)
      } catch {
        console.error('Failed to parse deal JSON:', jsonPart)
        dealData = null
      }
    } else {
      message = raw.trim()
    }

    return NextResponse.json({
      message,
      isDealConfirmed,
      isDealRejected,
      dealData,
    })

  } catch (error: any) {
    console.error('Negotiate API error:', error)
    return NextResponse.json(
      { message: 'Maaf, terjadi kesalahan. Coba lagi.' },
      { status: 500 }
    )
  }
}
