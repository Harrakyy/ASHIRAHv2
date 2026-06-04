import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Verifikasi webhook secret
    const authHeader = request.headers.get('authorization')
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET
    
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { action, data } = body
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        }
      }
    )
    
    switch (action) {
      case 'create_order':
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            ...data,
            ai_generated: true,
            status: 'pending'
          })
          .select()
          .single()
        if (orderError) throw orderError
        return NextResponse.json({ success: true, order })
      
      case 'create_invoice':
        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .insert({
            ...data,
            status: 'draft'
          })
          .select()
          .single()
        if (invoiceError) throw invoiceError
        return NextResponse.json({ success: true, invoice })
      
      case 'send_notification':
        const { error: notifError } = await supabase
          .from('notifications')
          .insert(data)
        if (notifError) throw notifError
        return NextResponse.json({ success: true })
      
      case 'update_order_status':
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: data.status })
          .eq('id', data.order_id)
        if (updateError) throw updateError
        return NextResponse.json({ success: true })
      
      case 'create_order_from_chat':
        const { data: chatOrder, error: chatOrderError } = await supabase
          .from('orders')
          .insert({
            ...data,
            ai_generated: true,
          })
          .select()
          .single()
        if (chatOrderError) throw chatOrderError
        return NextResponse.json({ success: true, order: chatOrder })
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` }, 
          { status: 400 }
        )
    }
    
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Ashira webhook endpoint active' 
  })
}
