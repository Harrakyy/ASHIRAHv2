import { createClient } from "@/lib/supabase/server"
import { getAdminDashboardStats } from "@/lib/supabase/queries-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { 
  ShoppingBag, 
  FileText, 
  BarChart3,
  Settings,
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/login")
  }

  const stats = await getAdminDashboardStats()

  const { count: activeServicesCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1c2143' }}>Admin Dashboard</h1>
          <p className="text-muted-foreground">Kelola semua pesanan dan pelanggan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/orders">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pesanan</CardTitle>
              <ShoppingBag className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeOrders}</div>
              <p className="text-xs text-muted-foreground">Pesanan aktif</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/invoices">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Invoice</CardTitle>
              <FileText className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unpaidInvoices}</div>
              <p className="text-xs text-muted-foreground">Invoice pending</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/services">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Layanan</CardTitle>
              <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeServicesCount || 0}</div>
              <p className="text-xs text-muted-foreground">Layanan aktif</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/reports">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Laporan</CardTitle>
              <BarChart3 className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-900 dark:text-gray-100">Lihat laporan bisnis dan Analytics</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pengaturan</CardTitle>
              <Settings className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-900 dark:text-gray-100">Konfigurasi sistem dan layanan</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}