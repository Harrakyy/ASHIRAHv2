import { NextResponse } from 'next/server'

export const maxDuration = 30

const rateLimit = new Map<string, { count: number; timestamp: number }>()
const MAX_REQUESTS = 15
const WINDOW_MS = 60 * 1000 // 1 minute

const SYSTEM_PROMPT = `
Kamu adalah AI Assistant Ashira.co.
Tugas utamamu HANYA menjawab pertanyaan seputar Ashira.co (produk, harga, bahan, jam operasional).
Jika customer ingin order atau nego harga, arahkan mereka untuk klik tombol "Desain di Kanvas" atau mengunjungi kanvas kami.
JANGAN pernah meminta data diri, jangan membuat form, dan jangan memberikan diskon langsung.
Jawablah dengan singkat, ramah, dan santai menggunakan bahasa Indonesia sehari-hari ("kak").
`

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const record = rateLimit.get(ip) || { count: 0, timestamp: now }
    if (now - record.timestamp > WINDOW_MS) {
      record.count = 1
      record.timestamp = now
    } else {
      record.count++
    }
    rateLimit.set(ip, record)
    if (record.count > MAX_REQUESTS) {
      return NextResponse.json({ message: 'Terlalu banyak pesan. Tunggu sebentar ya kak.' }, { status: 429 })
    }

    const { messages } = await request.json()
    if (!messages?.length) {
      return NextResponse.json({ message: 'Tidak ada pesan.' }, { status: 400 })
    }

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ]

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 500,
        messages: groqMessages,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) {
      return NextResponse.json({ message: 'Maaf, sistem sedang sibuk. Coba lagi.' }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json({
      message: data.choices[0].message.content,
      showDetailForm: false,
      isDealConfirmed: false,
      isDealRejected: false,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
