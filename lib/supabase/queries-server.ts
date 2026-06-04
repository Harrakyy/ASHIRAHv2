// This file is for SERVER-SIDE usage only
// All functions here use the server client
import { createClient } from "./server"

// Re-export types
export type {
  Profile,
  Service,
  Order,
  OrderUpdate,
  Invoice,
  InvoiceItem,
  Payment,
  Message,
  Notification,
} from "./queries"

// ============ SERVICES ============

export async function getServices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: true })
  if (error) throw error
  return data as any[]
}

// ============ ORDERS ============

export async function getOrders() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customer:profiles!orders_customer_id_fkey(*),
      service:services(*)
    `)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as any[]
}

// ============ INVOICES ============

export async function getInvoices() {
  const supabase = await createClient()
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
  return data as any[]
}

// ============ CUSTOMERS ============

export async function getCustomers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data as any[]
}

// ============ DASHBOARD STATS ============

export async function getAdminDashboardStats() {
  const supabase = await createClient()

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
  const supabase = await createClient()

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
