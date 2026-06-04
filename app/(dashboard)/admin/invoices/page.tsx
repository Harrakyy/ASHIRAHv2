import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getInvoices } from "@/lib/supabase/queries-server"
import { ArrowLeft, Eye, Plus, FileText } from "lucide-react"

const statusConfig: Record<string, { label: string; color: string }> = {
  paid:    { label: "Lunas",        color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  unpaid:  { label: "Belum Bayar",  color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  partial: { label: "Sebagian",     color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  overdue: { label: "Jatuh Tempo", color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" },
}

export default async function AdminInvoicesPage() {
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
    redirect("/dashboard")
  }

  const invoices = await getInvoices()

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1c2143' }}>Invoice</h1>
            <p className="text-muted-foreground">Kelola semua invoice</p>
          </div>
        </div>
        <Link href="/admin/invoices/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invoice Baru
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {invoices.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Belum ada invoice</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">No. Invoice</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Pelanggan</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Total</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Jatuh Tempo</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900">
                    <td className="p-4 font-mono text-sm text-gray-900 dark:text-gray-100">{invoice.invoice_number}</td>
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100">{invoice.customer?.full_name || invoice.customer?.email || "–"}</td>
                    <td className="p-4 text-sm font-medium text-gray-900 dark:text-gray-100">Rp {(invoice.total || 0).toLocaleString("id-ID")}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString("id-ID") : "–"}</td>
                    <td className="p-4">
                      <Badge className={statusConfig[invoice.status]?.color}>
                        {statusConfig[invoice.status]?.label || invoice.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/invoices/${invoice.id}`}>
                        <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}