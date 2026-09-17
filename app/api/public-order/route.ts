import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const whatsapp = formData.get('whatsapp') as string
    const address = formData.get('address') as string
    const orderType = formData.get('orderType') as string
    const sizesRaw = formData.get('sizes') as string
    const sizes = sizesRaw ? JSON.parse(sizesRaw) : {}
    const price = formData.get('price') as string
    const notes = formData.get('notes') as string
    const negotiated_price = formData.get('negotiated_price') as string
    const original_price = formData.get('original_price') as string
    const negotiation_summary = formData.get('negotiation_summary') as string
    const ai_session_id = formData.get('ai_session_id') as string
    const designFile = formData.get('designFile') as File | null

    console.log('=== PUBLIC ORDER RECEIVED ===')
    console.log('name:', name)
    console.log('email:', email)
    console.log('orderType:', orderType)
    console.log('negotiated_price:', negotiated_price)

    if (!name || !email || !whatsapp || !orderType) {
      return NextResponse.json(
        { success: false, error: 'Field wajib tidak lengkap' },
        { status: 400 }
      )
    }

    let designFilePath: string | null = null

    if (designFile && designFile.size > 0) {
      const supabaseService = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const sanitizedName = designFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const filePath = `designs/${Date.now()}-${sanitizedName}`
      const buffer = await designFile.arrayBuffer()

      const { error: uploadError } = await supabaseService.storage
        .from('design-files')
        .upload(filePath, buffer, { contentType: designFile.type })

      if (uploadError) {
        console.error('Upload error:', uploadError)
      } else {
        designFilePath = filePath
      }
    }

    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const rand = Math.floor(1000 + Math.random() * 9000)
    const order_number = `ASH-${dateStr}-${rand}`

    const supabase = await createClient()
    const { data: insertData, error: insertError } = await supabase.from('orders').insert({
      order_number,
      customer_id: null,
      service_id: null,
      price: negotiated_price ? Number(negotiated_price) : 0,
      customer_name: name,
      customer_email: email,
      customer_whatsapp: whatsapp,
      customer_address: address,
      order_specs: { orderType, sizes, price, notes },
      negotiated_price: negotiated_price ? Number(negotiated_price) : null,
      original_price: original_price ? Number(original_price) : null,
      negotiation_summary: negotiation_summary || null,
      ai_session_id: ai_session_id || null,
      design_file_url: designFilePath,
      status: 'pending',
      internal_notes: null,
    })

    console.log('Insert result — error:', insertError)
    console.log('Insert result — data:', insertData)

    if (insertError) {
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      )
    }

    try {
      const nodemailer = await import('nodemailer')

      const transporter = nodemailer.default.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      console.log('=== SENDING EMAIL ===')
      console.log('to:', process.env.ADMIN_EMAIL)
      console.log('GMAIL_USER exists:', !!process.env.GMAIL_USER)
      console.log('GMAIL_APP_PASSWORD exists:', !!process.env.GMAIL_APP_PASSWORD)

      await transporter.sendMail({
        from: `"Ashira Order System" <${process.env.GMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `[Order Baru] ${order_number} — ${orderType}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0F1F3D; padding: 24px; text-align: center;">
          <h1 style="color: #C9A84C; margin: 0;">ASHIRA</h1>
          <p style="color: #ffffff; margin: 8px 0 0;">Order Baru Masuk</p>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0F1F3D;">Order #${order_number}</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 40%;">Nama Customer</td>
              <td style="padding: 8px 0; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Email</td>
              <td style="padding: 8px 0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">WhatsApp</td>
              <td style="padding: 8px 0;">${whatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Jenis Order</td>
              <td style="padding: 8px 0;">${orderType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Harga Awal</td>
              <td style="padding: 8px 0;">Rp ${Number(original_price).toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Harga Final (Nego)</td>
              <td style="padding: 8px 0; color: #C9A84C; font-weight: bold; font-size: 18px;">
                Rp ${Number(negotiated_price).toLocaleString('id-ID')}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">File Desain</td>
              <td style="padding: 8px 0;">${designFilePath ? '✅ Ada' : '❌ Tidak ada'}</td>
            </tr>
          </table>
          ${negotiation_summary ? `
          <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px;">
            <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px;">Ringkasan Negosiasi:</p>
            <p style="margin: 0;">${negotiation_summary}</p>
          </div>` : ''}
          <div style="margin-top: 24px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders"
               style="background: #0F1F3D; color: #C9A84C; padding: 12px 24px;
                      text-decoration: none; border-radius: 8px; font-weight: bold;">
              Lihat di Dashboard Admin
            </a>
          </div>
        </div>
        <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          Ashira.co — PT Ashira Niaga Indonesia
        </div>
      </div>
    `,
      })
      console.log('Email sent successfully')
    } catch (emailError) {
      console.error('Email notification failed (non-blocking):', emailError)
      console.error('Email error detail:', emailError)
    }

    return NextResponse.json({
      success: true,
      order_number,
      message: 'Order berhasil dibuat',
    })

  } catch (error) {
    console.error('public-order error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
