import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { webhook, payload, action, data } = body

    const useWebhook = webhook || `ashira-${action}`
    const usePayload = payload || data

    console.log('=== NOTIFY API CALLED ===')
    console.log('Action/Webhook:', useWebhook)
    console.log('N8N_WEBHOOK_URL:', process.env.N8N_WEBHOOK_URL)
    console.log('Payload:', JSON.stringify(usePayload))
    console.log('Payload customer_email:', usePayload?.customer_email)

    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nUrl) {
      console.error('N8N_WEBHOOK_URL is not set!')
      return NextResponse.json({ error: 'N8N_WEBHOOK_URL not configured' }, { status: 500 })
    }

    if (!usePayload?.customer_email) {
      console.warn('customer_email is empty. Sending webhook without email anyway.')
    }

    const n8nResponse = await fetch(`${n8nUrl}/webhook/${useWebhook}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usePayload || {}),
    })

    console.log('n8n response status:', n8nResponse.status)

    if (!n8nResponse.ok) {
      const n8nBody = await n8nResponse.text()
      console.error('n8n response body:', n8nBody)
      return NextResponse.json({
        success: false,
        n8nStatus: n8nResponse.status,
        n8nBody,
      })
    }

    return NextResponse.json({ success: true, n8nStatus: n8nResponse.status })
  } catch (error: any) {
    console.error('=== NOTIFY FETCH ERROR ===')
    console.error('Message:', error?.message)
    console.error('Code:', error?.code)
    console.error('Cause:', error?.cause)
    // Common: server can't reach n8n. If N8N_WEBHOOK_URL is a public IP
    // from the same machine, try localhost instead.
    const hint =
      error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND'
        ? 'Cannot reach n8n. If n8runs on same machine, set N8N_WEBHOOK_URL=http://localhost:5678 in .env.local'
        : ''
    return NextResponse.json({ error: error.message, hint }, { status: 500 })
  }
}
