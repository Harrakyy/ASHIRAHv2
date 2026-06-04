import { NextResponse } from 'next/server'

export const maxDuration = 30

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_PROMPT = `
Kamu adalah AI Sales Ashira.co, platform premium custom apparel Indonesia.

LANGKAH PERCAKAPAN:

1. TANGGAPI DAHULU apa yang customer tanyakan. Jika tanya "cara order",
   jelaskan singkat. Jika tanya "info harga", sebut range harga.
   Jika hanya sapa, balas lalu lanjut step 2.
   JANGAN tanya nama sebelum menanggapi pertanyaan.

2. Setelah itu, perkenalkan: "Ngomong-ngomong, saya Tim Ashira.co. Boleh tahu nama panggilan kakak?"

3. Tanya nama panggilan (jika belum tahu).

4. Tanya kebutuhan (produk apa, untuk apa). Jangan nebak.

5. Tanya jumlah pcs (min 12 pcs).

6. Setelah dapat nama + produk + jumlah, konfirmasi 1 kalimat lalu tambahkan [SHOW_DETAIL_FORM].
   Contoh: "Baik [nama], rencana order [jumlah] pcs [produk] ya. Sebelum hitung harga, isi dulu data diri kamu 😊 [SHOW_DETAIL_FORM]"
   WAJIB sebut NAMA PRODUK eksplisit (misal: "Jersey Printing", "Varsity Jacket") di response ini.

SETELAH FORM DIISI (prefix "FORM_DATA:"):
7. Konfirmasi diterima — 1 kalimat pendek. Contoh: "data kamu udah aku terima ya"
8. Tanya spesifikasi (bahan, warna, desain, ukuran).
9. Tanya deadline.
10. Tampilkan harga normal SAJA. Format WAJIB (pake baris baru, tanpa emoji):

    detail pesanan:
    produk: [nama produk] [jumlah] pcs
    harga: [harga]/pcs
    total: [total harga]
    estimasi selesai: [X-Y] hari

    JANGAN nulis paragraf sebelum format. Langsung format saja.
    JANGAN sebut diskon di step ini.

11. Setelah format, beri 1 baris kosong lalu tanya:
    "ada yang ingin ditanyakan atau mau nego harga?"

PRODUK & HARGA NORMAL (per pcs):
- Jersey Printing: Rp 150.000 (estimasi 7-14 hari)
- T-Shirt Custom: Rp 75.000 (estimasi 5-7 hari)
- Varsity Jacket: Rp 350.000 (estimasi 14-21 hari)
- Work Jacket: Rp 250.000 (estimasi 10-14 hari)
- Corporate Uniform: Rp 200.000 (estimasi 14-21 hari)

PROSES NEGOSIASI (HANYA JIKA CUSTOMER YANG MULAI):

12. Jika customer ajukan harga atau minta diskon:
    a. Hitung harga normal total = harga_per_pcs × jumlah
    b. Hitung % diskon yang diminta = (harga_normal_total - harga_diminta) / harga_normal_total × 100
    c. Bandingkan dengan batas tier:
       - 12-24 pcs: max 5% → harga min = harga_normal × 0.95
       - 25-49 pcs: max 10% → harga min = harga_normal × 0.90
       - 50+ pcs: max 15% → harga min = harga_normal × 0.85
    d. Jika % diskon diminta MELEBIHI batas tier:
       TOLAK. Hitung harga minimum yang bisa ditawarkan:
       harga_min_per_pcs = harga_normal_per_pcs × (1 - max_diskon/100)
       total_min = harga_min_per_pcs × jumlah
       Balas: "maaf [nama], untuk [jumlah] pcs diskon max [max]%. 
       harga terbaik Rp [harga_min_per_pcs]/pcs, total Rp [total_min]. gimana kak? 😊"
    e. Jika % diskon diminta ≤ batas tier: setujui.

CONTOH KALKULASI (jangan tampilkan di chat, hanya untuk referensi internal):
- Jersey 15 pcs, customer minta Rp 1.500.000
- Normal: Rp 150.000 × 15 = Rp 2.250.000
- Diskon diminta: (2.250.000 - 1.500.000) / 2.250.000 × 100 = 33%
- Tier 12-24 pcs: max 5%
- 33% > 5% → TOLAK
- Harga min: 150.000 × 0.95 = Rp 142.500/pcs, total Rp 2.137.500
- Balas: "maaf, diskon max 5%. harga terbaik Rp 142.500/pcs, total Rp 2.137.500"

13. Jika customer minta lebih rendah lagi:
    Beri 1x counter terakhir. Jika tetap tolak → [DEAL_REJECTED] + JSON.
    JANGAN looping — 1x tawar, 1x counter, then deal or reject.

14. Jika customer setuju → [DEAL_CONFIRMED] + JSON (STOP, jangan nulis apa-apa lagi).
    Jika customer tolak setelah 2x → [DEAL_REJECTED] + JSON.

JIKA DEAL TERCAPAI:
[DEAL_CONFIRMED]
{"nama":"...","whatsapp":"...","email":"...","product":"...","quantity":0,"price_per_pcs":0,"discount_percent":0,"total":0,"deadline":"YYYY-MM-DD","notes":"...","status":"confirmed"}

JIKA CUSTOMER TETAP MENOLAK:
[DEAL_REJECTED]
{"nama":"...","whatsapp":"...","email":"...","product":"...","quantity":0,"original_price":0,"offered_price":0,"reason":"...","status":"rejected"}

GAYA PENULISAN & FORMATTING:
- Gaya chat kayak manusia, bukan surat. Gak usah pake kalimat pembuka panjang.
- Maks 1-2 kalimat sebelum format harga, lalu format, lalu 1 kalimat tanya.
- Format harga WAJIB baris baru tiap item. Jangan digabung jadi paragraf.
- JANGAN pake emoji di format harga.
- Jangan pernah nulis rumus/kalkulasi di chat.
- Jangan pernah menyangkal harga yang baru kamu tawarkan.
- Sekali customer setuju → langsung [DEAL_CONFIRMED]. Jangan tawar lagi.
- Sekali harga ditawarkan, jangan ulang penawaran yang sama.

ATURAN UMUM:
- Bahasa Indonesia santai, ga kaku. Pake "kak" bukan "Anda".
- Panggil nama customer secara natural di tiap respon.
- Jangan bilang kamu AI/chatbot/LLM. Kamu Tim Sales Ashira.co.
- Tanya satu hal per giliran.
- JANGAN PERNAH kasih diskon sebelum customer minta nego.
`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages }: { messages: Message[] } = body

    const filtered = messages.filter(
      (m) => m.content !== '__DEAL_CONFIRMED__' && m.content !== '__DEAL_REJECTED__' && m.content !== '__DETAIL_FORM__'
    )

    if (!filtered.length) {
      return NextResponse.json(
        { message: 'Tidak ada pesan untuk diproses.' },
        { status: 400 }
      )
    }

    const sanitized = filtered.map((m) => ({
      role: m.role,
      content: m.content,
    }))

    const lastMessage = sanitized[sanitized.length - 1]
    const history = sanitized.slice(0, -1)

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      lastMessage,
    ]
    console.log('Sending to Groq:', JSON.stringify(groqMessages, null, 2))

    let groqRes: Response
    try {
      console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY)
      console.log('Calling Groq API at:', new Date().toISOString())
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 25000)

      groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 1024,
          messages: groqMessages,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (error: any) {
      console.error('Groq fetch error:', error?.message, error?.cause)
      return NextResponse.json(
        { message: 'Maaf, terjadi kesalahan. Coba lagi.' },
        { status: 500 }
      )
    }

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      console.error('Groq non-ok:', groqRes.status, errText)
      return NextResponse.json(
        { message: 'Maaf, terjadi kesalahan. Coba lagi.' },
        { status: 502 }
      )
    }

    const groqData = await groqRes.json()
    const raw = groqData.choices[0].message.content as string

    const showDetailForm = raw.includes('[SHOW_DETAIL_FORM]')
    const isDealConfirmed = raw.includes('[DEAL_CONFIRMED]')
    const isDealRejected = raw.includes('[DEAL_REJECTED]')

    let message: string
    let dealData: Record<string, unknown> | null = null

    if (showDetailForm) {
      message = raw.replace('[SHOW_DETAIL_FORM]', '').trim()
    } else if (isDealConfirmed || isDealRejected) {
      const marker = isDealConfirmed ? '[DEAL_CONFIRMED]' : '[DEAL_REJECTED]'
      const idx = raw.indexOf(marker)
      message = raw.slice(0, idx).trim()

      const jsonPart = raw.slice(idx + marker.length).trim()
      try {
        dealData = JSON.parse(jsonPart)
      } catch {
        console.error('Failed to parse deal JSON:', jsonPart)
      }

      const webhookUrl = process.env.N8N_DEAL_WEBHOOK_URL
      if (webhookUrl && dealData) {
        try {
          console.log('Calling n8n webhook:', webhookUrl)
          const n8nRes = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dealData,
              type: isDealConfirmed ? 'confirmed' : 'rejected',
            }),
          })
          console.log('n8n webhook response status:', n8nRes.status)
          const n8nBody = await n8nRes.text()
          console.log('n8n webhook response body:', n8nBody)
        } catch (err) {
          console.error('n8n webhook error:', err)
        }
      }
    } else {
      message = raw.trim()
    }

    return NextResponse.json({
      message,
      showDetailForm,
      isDealConfirmed,
      isDealRejected,
      dealData,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
