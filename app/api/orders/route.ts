import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_id, service_id, deadline, internal_notes } = body

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        }
      }
    )

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Ambil harga service dulu
    const { data: service } = await supabase
      .from('services')
      .select('nama, harga')
      .eq('id', service_id)
      .single()

    // Insert order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id,
        service_id,
        order_number: orderNumber,
        deadline,
        internal_notes,
        status: 'pending',
        price: service?.harga || 0,
      })
      .select()
      .single()

    if (error) throw error

    // Ambil data customer
    const { data: customer } = await supabase
      .from('profiles')
      .select('full_name, email, whatsapp')
      .eq('id', customer_id)
      .single()

    // Notifikasi admin di dashboard
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')

    if (admins && admins.length > 0) {
      await supabase.from('notifications').insert(
        admins.map(admin => ({
          user_id: admin.id,
          type: 'new_order',
          title: 'Pesanan Baru!',
          message: `${customer?.full_name || customer?.email} memesan ${service?.nama}`,
          link: `/admin/orders/${order.id}`,
          is_read: false,
        }))
      )
    }

    // Hit n8n webhook (server-side — env var terbaca)
    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (n8nUrl) {
      try {
        await fetch(`${n8nUrl}/webhook/ashira-new-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: order.id,
            order_number: orderNumber,
            customer_name: customer?.full_name || customer?.email,
            customer_email: customer?.email,
            customer_whatsapp: customer?.whatsapp,
            service_name: service?.nama,
            total: service?.harga,
          })
        })
      } catch (err) {
        console.error('n8n webhook error:', err)
      }
    }

    return NextResponse.json({ success: true, order })

  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
