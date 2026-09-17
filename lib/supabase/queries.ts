// This file is for CLIENT-SIDE usage only
// For server-side usage, use queries-server.ts
import { createClient } from "./client"

// Types matching the actual database schema
export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  whatsapp: string | null
  role: "admin" | "customer"
  status: string | null
  avatar_url: string | null
  created_at: string
}

export interface Service {
  id: string
  nama: string
  deskripsi: string | null
  harga: number
  estimasi: string
  max_slots: number
  current_slots: number
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string
  service_id: string
  status: "pending" | "in_progress" | "review" | "revision" | "completed" | "cancelled"
  progress: number
  price: number
  deadline: string | null
  internal_notes: string | null
  approval_status: "pending_approval" | "approved" | "rejected"
  approved_at: string | null
  approved_by: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
  // Joined data
  customer?: Profile
  service?: Service
}

const ALLOWED_ORDER_TRANSITIONS: Record<Order["status"], Order["status"][]> = {
  pending: ["in_progress", "cancelled"],
  in_progress: ["review", "revision", "cancelled"],
  review: ["revision", "completed", "cancelled"],
  revision: ["in_progress", "review", "cancelled"],
  completed: [],
  cancelled: [],
}

export interface OrderUpdate {
  id: string
  order_id: string
  message: string
  is_customer_visible: boolean
  created_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  order_id: string | null
  customer_id: string
  subtotal: number
  tax_percent: number
  total: number
  status: "draft" | "sent" | "submitted" | "paid" | "rejected_payment" | "cancelled"
  due_date: string | null
  notes: string | null
  paid_at: string | null
  payment_proof_url: string | null
  payment_submitted_at: string | null
  created_at: string
  updated_at: string
  // Joined data
  customer?: Profile
  order?: Order
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  nama_layanan: string
  qty: number
  harga_satuan: number
  subtotal: number
}

export interface Payment {
  id: string
  invoice_id: string
  customer_id: string
  amount: number
  proof_url: string | null
  proof_filename: string | null
  proof_uploaded_at: string | null
  status: "pending" | "submitted" | "approved" | "rejected"
  rejection_reason: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  created_at: string
  updated_at: string
  // Joined data
  invoices?: {
    invoice_number: string
    total: number
  }
  profiles?: {
    full_name: string | null
    email: string | null
    whatsapp: string | null
  }
}

export interface Message {
  id: string
  sender_id: string | null
  receiver_id: string | null
  content: string
  is_internal: boolean
  is_read: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  link: string | null
  is_read: boolean
  created_at: string
}

// Helper function to format currency
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper function to format date
export function formatDate(dateString: string): string {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

// Helper function to get relative time
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Baru saja"
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays < 7) return `${diffDays} hari lalu`
  return formatDate(dateString)
}

// ============ SERVICES ============

export async function getServices() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true })
  if (error) throw error
  return data as Service[]
}

export async function getActiveServices() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
  if (error) throw error
  return data as Service[]
}

export async function getServiceById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw error
  return data as Service
}

export async function createService(service: Omit<Service, "id" | "created_at">) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("services")
    .insert(service)
    .select()
    .single()
  if (error) throw error
  return data as Service
}

export async function updateService(id: string, updates: Partial<Service>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as Service
}

export async function deleteService(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id)
  if (error) throw error
}

// ============ ORDERS ============

export async function getOrders() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customer:profiles!orders_customer_id_fkey(*),
      service:services(*)
    `)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as Order[]
}

export async function getOrderById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customer:profiles!orders_customer_id_fkey(*),
      service:services(*)
    `)
    .eq("id", id)
    .single()
  if (error) throw error
  return data as Order
}

export async function getOrderByOrderNumber(orderNumber: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customer:profiles!orders_customer_id_fkey(*),
      service:services(*)
    `)
    .eq("order_number", orderNumber)
    .single()
  if (error) throw error
  return data as Order
}

export async function updateOrder(id: string, updates: Partial<Order>) {
  const supabase = createClient()

  if (updates.status) {
    const { data: existing, error: existingError } = await supabase
      .from("orders")
      .select("status, approval_status")
      .eq("id", id)
      .single()

    if (existingError) throw existingError

    const currentStatus = existing.status as Order["status"]
    const nextStatus = updates.status as Order["status"]
    const allowedNext = ALLOWED_ORDER_TRANSITIONS[currentStatus] || []

    if (currentStatus !== nextStatus && !allowedNext.includes(nextStatus)) {
      throw new Error(`Invalid order status transition: ${currentStatus} -> ${nextStatus}`)
    }

    if (nextStatus === "in_progress" && existing.approval_status !== "approved") {
      throw new Error("Order harus di-approve sebelum bisa mulai dikerjakan.")
    }
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as Order
}

export async function deleteOrder(id: string) {
  const supabase = createClient()

  // Delete related order updates first
  const { error: updatesError } = await supabase
    .from("order_updates")
    .delete()
    .eq("order_id", id)

  if (updatesError) throw updatesError

  // Delete related invoices and invoice items
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id")
    .eq("order_id", id)

  if (invoices && invoices.length > 0) {
    for (const inv of invoices) {
      await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", inv.id)
    }
    const { error: invError } = await supabase
      .from("invoices")
      .delete()
      .eq("order_id", id)
    if (invError) throw invError
  }

  // Delete the order
  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id)

  if (error) throw error
}

// ============ ORDER UPDATES ============

export async function getOrderUpdates(orderId: string, opts?: { visibleOnly?: boolean }) {
  const supabase = createClient()
  let query = supabase
    .from("order_updates")
    .select("*")
    .eq("order_id", orderId)

  if (opts?.visibleOnly) {
    query = query.eq("is_customer_visible", true)
  }

  const { data, error } = await query.order("created_at", { ascending: false })
  if (error) throw error
  return data as OrderUpdate[]
}

export async function createOrderUpdate(update: {
  order_id: string
  message: string
  is_customer_visible: boolean
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("order_updates")
    .insert(update)
    .select()
    .single()
  if (error) throw error
  return data as OrderUpdate
}

// ============ ORDER APPROVAL ============

export async function approveOrder(orderId: string, adminId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .update({
      approval_status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: adminId,
      rejection_reason: null,
    })
    .eq("id", orderId)
    .select()
    .single()
  if (error) throw error
  return data as Order
}

export async function rejectOrder(orderId: string, adminId: string, reason: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .update({
      approval_status: "rejected",
      approved_at: null,
      approved_by: adminId,
      rejection_reason: reason,
    })
    .eq("id", orderId)
    .select()
    .single()
  if (error) throw error
  return data as Order
}

// ============ INVOICES ============

export async function getInvoices() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customer:profiles!invoices_customer_id_fkey(*),
      order:orders(*),
      items:invoice_items(*)
    `)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as Invoice[]
}

export async function getInvoiceById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customer:profiles!invoices_customer_id_fkey(*),
      order:orders(*),
      items:invoice_items(*)
    `)
    .eq("id", id)
    .single()
  if (error) throw error
  return data as Invoice
}

export async function createInvoice(invoice: {
  order_id?: string | null
  customer_id: string
  subtotal: number
  tax_percent: number
  total: number
  due_date: string
  notes?: string
  items: { nama_layanan: string; qty: number; harga_satuan: number; subtotal: number }[]
}) {
  const supabase = createClient()
  const currentYear = new Date().getFullYear()
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })

  const invoiceNumber = `INV-${currentYear}-${String((count || 0) + 1).padStart(3, "0")}`
  const insertData: any = {
    invoice_number: invoiceNumber,
    customer_id: invoice.customer_id,
    subtotal: invoice.subtotal,
    tax_percent: invoice.tax_percent,
    total: invoice.total,
    due_date: invoice.due_date,
    notes: invoice.notes,
    status: "draft",
  }
  if (invoice.order_id) {
    insertData.order_id = invoice.order_id
  }
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .insert(insertData)
    .select()
    .single()
  if (invoiceError) {
    console.error("createInvoice error:", JSON.stringify(invoiceError))
    throw invoiceError
  }

  const items = invoice.items.map(item => ({
    ...item,
    invoice_id: invoiceData.id,
  }))
  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(items)
  if (itemsError) {
    console.error("createInvoice items error:", JSON.stringify(itemsError))
    throw itemsError
  }

  await createNotification({
    user_id: invoice.customer_id,
    type: "invoice",
    title: "Invoice Baru",
    message: `Invoice #${invoiceNumber} telah dikirim. Total: ${formatRupiah(invoice.total)}. Jatuh tempo: ${invoice.due_date}`,
    link: `/dashboard/invoice/${invoiceData.id}`,
  })

  return invoiceData as Invoice
}

export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as Invoice
}

export async function deleteInvoice(id: string) {
  const supabase = createClient()
  // Delete invoice items first
  const { error: itemsError } = await supabase
    .from("invoice_items")
    .delete()
    .eq("invoice_id", id)

  if (itemsError) throw itemsError

  // Delete the invoice
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)

  if (error) throw error
}

// ============ PAYMENTS ============

// Approve pembayaran (admin)
export async function approvePayment(
  paymentId: string,
  invoiceId: string,
  customerId: string,
  adminId: string
) {
  const supabase = createClient()

  await supabase
    .from('payments')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminId,
    })
    .eq('id', paymentId)

  await supabase
    .from('invoices')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString()
    })
    .eq('id', invoiceId)

  // Notifikasi ke customer
  await supabase
    .from('notifications')
    .insert({
      user_id: customerId,
      title: 'Pembayaran Dikonfirmasi!',
      message: 'Pembayaran kamu telah dikonfirmasi. Pesanan akan segera diproses.',
      type: 'payment_approved',
      is_read: false,
    })

  try {
    const { data: customer } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', customerId)
      .single()

    const { data: inv } = await supabase
      .from('invoices')
      .select('invoice_number, total')
      .eq('id', invoiceId)
      .single()

    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhook: 'ashira-payment-confirmed',
        payload: {
          status: 'approved',
          customer_name: customer?.full_name || customer?.email,
          customer_email: customer?.email,
          invoice_id: invoiceId,
          invoice_number: inv?.invoice_number,
          amount: inv?.total,
        }
      })
    })
    if (!res.ok) {
      const errBody = await res.json()
      console.error('notify response error:', errBody)
    }
  } catch (err) {
    console.error('notify error:', err)
  }
}

// Reject pembayaran (admin)
export async function rejectPayment(
  paymentId: string,
  invoiceId: string,
  customerId: string,
  adminId: string,
  reason: string
) {
  const supabase = createClient()

  await supabase
    .from('payments')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminId,
    })
    .eq('id', paymentId)

  await supabase
    .from('invoices')
    .update({ status: 'rejected_payment' })
    .eq('id', invoiceId)

  // Notifikasi ke customer
  await supabase
    .from('notifications')
    .insert({
      user_id: customerId,
      title: 'Bukti Pembayaran Ditolak',
      message: `Bukti bayar ditolak: ${reason}. Silakan upload ulang.`,
      type: 'payment_rejected',
      is_read: false,
    })

  try {
    const { data: customer } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', customerId)
      .single()

    const { data: inv } = await supabase
      .from('invoices')
      .select('invoice_number, total')
      .eq('id', invoiceId)
      .single()

    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhook: 'ashira-payment-confirmed',
        payload: {
          status: 'rejected',
          customer_name: customer?.full_name || customer?.email,
          customer_email: customer?.email,
          invoice_id: invoiceId,
          invoice_number: inv?.invoice_number,
          amount: inv?.total,
          rejection_reason: reason,
        }
      })
    })
    if (!res.ok) {
      const errBody = await res.json()
      console.error('notify response error:', errBody)
    }
  } catch (err) {
    console.error('notify error:', err)
  }
}

// Get payment by invoice (customer)
export async function getPaymentByInvoice(invoiceId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Update status order + kirim notifikasi
export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  customerId: string,
  notes?: string
) {
  const supabase = createClient()

  await supabase
    .from('orders')
    .update({
      status: newStatus,
      ...(notes && { internal_notes: notes })
    })
    .eq('id', orderId)

  // Map status ke pesan notifikasi
  const statusMessages: Record<string, {title: string, message: string}> = {
    pending: {
      title: '📋 Pesanan Diterima',
      message: 'Pesanan kamu sedang menunggu konfirmasi tim Ashira.'
    },
    in_progress: {
      title: '🏭 Pesanan Sedang Dikerjakan',
      message: 'Pesanan kamu sedang dalam proses produksi. Estimasi 7-14 hari kerja.'
    },
    review: {
      title: '🔍 Pesanan Dalam Review',
      message: 'Pesanan kamu sedang direview oleh tim quality control kami.'
    },
    revision: {
      title: '✏️ Pesanan Perlu Revisi',
      message: 'Ada hal yang perlu direvisi pada pesanan kamu. Cek detail di dashboard.'
    },
    completed: {
      title: '🎉 Pesanan Selesai!',
      message: 'Pesanan kamu telah selesai. Terima kasih sudah mempercayakan project ke Ashira.co!'
    },
    cancelled: {
      title: '❌ Pesanan Dibatalkan',
      message: 'Pesanan kamu telah dibatalkan. Hubungi tim kami jika ada pertanyaan.'
    },
  }

  const notifContent = statusMessages[newStatus]
  if (notifContent) {
    await supabase
      .from('notifications')
      .insert({
        user_id: customerId,
        title: notifContent.title,
        message: notifContent.message,
        type: `order_${newStatus}`,
        is_read: false,
      })
  }

  try {
    const { data: customer } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', customerId)
      .single()

    const { data: order } = await supabase
      .from('orders')
      .select('order_number')
      .eq('id', orderId)
      .single()

    const statusMap: Record<string, {
      label: string
      subject: string
      title: string
      message: string
    }> = {
      pending: {
        label: 'Menunggu Konfirmasi',
        subject: 'Pesanan Diterima - Ashira.co',
        title: 'Pesanan Diterima!',
        message: 'Pesanan kamu sedang menunggu konfirmasi dari tim Ashira.'
      },
      in_progress: {
        label: 'Sedang Diproduksi',
        subject: 'Pesanan Dalam Produksi - Ashira.co',
        title: 'Pesanan Sedang Diproduksi!',
        message: 'Pesanan kamu sedang dalam proses produksi. Estimasi 7-14 hari kerja.'
      },
      review: {
        label: 'Quality Check',
        subject: 'Quality Check - Ashira.co',
        title: 'Pesanan Dalam Quality Check!',
        message: 'Pesanan kamu sedang direview oleh tim quality control kami.'
      },
      completed: {
        label: 'Selesai',
        subject: 'Pesanan Selesai - Ashira.co',
        title: 'Pesanan Kamu Selesai!',
        message: 'Pesanan kamu telah selesai. Terima kasih sudah mempercayakan project ke Ashira.co!'
      },
      cancelled: {
        label: 'Dibatalkan',
        subject: 'Pesanan Dibatalkan - Ashira.co',
        title: 'Pesanan Dibatalkan',
        message: 'Pesanan kamu telah dibatalkan. Hubungi tim kami jika ada pertanyaan.'
      },
    }

    const statusInfo = statusMap[newStatus]
    if (statusInfo && customer?.email) {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhook: 'ashira-order-status',
          payload: {
            order_id: orderId,
            order_number: order?.order_number,
            customer_name: customer?.full_name || customer?.email,
            customer_email: customer?.email,
            status_label: statusInfo.label,
            email_subject: statusInfo.subject,
            email_title: statusInfo.title,
            email_message: statusInfo.message,
            updated_at: new Date().toLocaleString('id-ID'),
          }
        })
      })
      if (!res.ok) {
        const errBody = await res.json()
        console.error('notify response error:', errBody)
      }
    }
  } catch (err) {
    console.error('notify error:', err)
  }
}

// ============ NOTIFICATIONS ============

export async function getNotifications(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)
  if (error) throw error
  return data as Notification[]
}

export async function getUnreadNotificationsCount(userId: string) {
  const supabase = createClient()
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false)
  if (error) throw error
  return count || 0
}

export async function markNotificationAsRead(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
  if (error) throw error
}

export async function markAllNotificationsAsRead(userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false)
  if (error) throw error
}

// link optional — null kalau tidak ada tujuan navigasi
export async function createNotification(notification: {
  user_id: string
  type: string
  title: string
  message: string
  link?: string | null
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      ...notification,
      link: notification.link ?? null,
    })
    .select()
    .single()
  if (error) {
    console.error("createNotification error:", JSON.stringify(error))
    throw error
  }
  return data as Notification
}

// ============ PROFILES / CUSTOMERS ============

export async function getCustomers(includeInactive: boolean = false) {
  const supabase = createClient()
  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")

  if (!includeInactive) {
    query = query.eq("is_active", true)
  }

  const { data, error } = await query.order("created_at", { ascending: false })
  if (error) throw error
  return data as Profile[]
}

export async function getOrdersForInvoice() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customer:profiles!orders_customer_id_fkey(id, full_name, email),
      service:services(*)
    `)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as Order[]
}

// ============ DASHBOARD STATS ============

export async function getAdminDashboardStats() {
  const supabase = createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("status")

  const { data: invoices } = await supabase
    .from("invoices")
    .select("total, tax_percent, status, paid_at")

  const { data: payments } = await supabase
    .from("payments")
    .select("jumlah")

  const { count: unreadMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
    .is("sender_id", null)

  const totalRevenue = payments?.reduce((sum, p) => sum + (p.jumlah || 0), 0) || 0

  return {
    totalOrders: orders?.length || 0,
    activeOrders: orders?.filter(o => ["pending", "in_progress", "review", "revision"].includes(o.status)).length || 0,
    completedOrders: orders?.filter(o => o.status === "completed").length || 0,
    totalRevenue,
    overdueInvoices: invoices?.filter(i => i.status === "overdue").length || 0,
    unpaidInvoices: invoices?.filter(i => i.status === "unpaid" || i.status === "partial").length || 0,
    unreadMessages: unreadMessages || 0,
  }
}

// ============ REVENUE DATA ============

export async function getMonthlyRevenue(year: number = new Date().getFullYear()) {
  const supabase = createClient()

  const { data: payments } = await supabase
    .from("payments")
    .select("jumlah, created_at")
    .gte("created_at", `${year}-01-01`)
    .lt("created_at", `${year + 1}-01-01`)

  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

  return months.map((month, i) => ({
    month,
    revenue: payments
      ?.filter(p => new Date(p.created_at).getMonth() === i)
      .reduce((sum, p) => sum + (p.jumlah || 0), 0) || 0,
  }))
}