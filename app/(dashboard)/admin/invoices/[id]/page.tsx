"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  CheckCircle,
  FileText,
  Send,
  XCircle,
  Loader2,
  FileImage,
  Clock,
} from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import {
  getInvoiceById,
  getPaymentByInvoice,
  approvePayment,
  rejectPayment,
  updateInvoice,
  deleteInvoice,
  createNotification,
  formatRupiah,
  formatDate,
  getRelativeTime,
  type Invoice,
  type InvoiceItem,
  type Payment,
} from "@/lib/supabase/queries"

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  sent: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected_payment: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  sent: "Terkirim",
  submitted: "Menunggu Konfirmasi",
  paid: "Lunas",
  rejected_payment: "Bukti Ditolak",
  cancelled: "Dibatalkan",
}

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card className="bg-card border rounded-xl">
          <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.id as string
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [payment, setPayment] = useState<Payment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const statusFlow = ['draft', 'sent', 'submitted', 'paid', 'cancelled'] as const
  type InvoiceStatus = typeof statusFlow[number]

  const statusStepLabels: Record<string, string> = {
    draft: 'Draft',
    sent: 'Terkirim',
    submitted: 'Menunggu Bayar',
    paid: 'Lunas',
    cancelled: 'Dibatalkan',
  }

  const getCurrentStepIndex = (status: string) => {
    return statusFlow.indexOf(status as InvoiceStatus)
  }

  const loadData = React.useCallback(async () => {
    try {
      const [invoiceData, paymentData] = await Promise.all([
        getInvoiceById(invoiceId),
        getPaymentByInvoice(invoiceId).catch(() => null),
      ])
      setInvoice(invoiceData)
      setPayment(paymentData as Payment | null)
    } catch (error: any) {
      console.error("Error loading invoice:", error)
      toast.error("Gagal memuat invoice")
    } finally {
      setIsLoading(false)
    }
  }, [invoiceId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCopyLink = () => {
    const invoiceUrl = `${window.location.origin}/dashboard/invoice/${invoiceId}`
    navigator.clipboard.writeText(invoiceUrl)
    setCopied(true)
    toast.info("Link disalin ke clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendToCustomer = async () => {
    if (!invoice) return
    setIsSending(true)

    try {
      console.log('=== STEP 1: Starting handleSendToCustomer ===')
      console.log('Invoice ID:', invoice.id)
      console.log('Invoice customer:', JSON.stringify(invoice.customer))
      console.log('Invoice customer_id:', invoice.customer_id)

      // Update invoice status
      console.log('=== STEP 2: Updating invoice status ===')
      await updateInvoice(invoice.id, { status: 'sent' })
      console.log('=== STEP 2: Update invoice SUCCESS ===')

      // Create notification di dashboard
      console.log('=== STEP 3: Creating dashboard notification ===')
      await createNotification({
        user_id: invoice.customer_id,
        type: 'invoice',
        title: 'Invoice Siap Dibayar',
        message: `Invoice ${invoice.invoice_number} telah dikirim.`,
        link: `/dashboard/invoice/${invoice.id}`,
      })
      console.log('=== STEP 3: Dashboard notification SUCCESS ===')

      // Fetch customer email jika belum ada
      console.log('=== STEP 4: Getting customer email ===')
      let customerEmail = invoice.customer?.email
      let customerName = invoice.customer?.full_name

      if (!customerEmail) {
        console.log('Customer email not in invoice, fetching from profiles...')
        const supabase = createClient()
        const { data: customerData, error: customerError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', invoice.customer_id)
          .single()

        console.log('Customer fetch result:', JSON.stringify(customerData))
        console.log('Customer fetch error:', JSON.stringify(customerError))

        customerEmail = customerData?.email
        customerName = customerData?.full_name
      }

      console.log('Final customer email:', customerEmail)
      console.log('Final customer name:', customerName)

      // Validasi email sebelum kirim ke n8n
      if (!customerEmail) {
        console.error('Customer has no email. Cannot send notification.')
        toast.error('Customer tidak memiliki email. Notifikasi tidak dapat dikirim.')
        setIsSending(false)
        return
      }

      console.log('STEP 1 - invoice:', invoice?.id)
      console.log('STEP 2 - customer:', invoice?.customer)
      console.log('STEP 3 - customerEmail before fetch:', customerEmail)
      console.log('STEP 4 - about to fetch /api/notify')

      // Kirim notifikasi email via n8n
      console.log('=== STEP 5: Sending n8n notification ===')
      const notifyRes = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invoice-sent',
          data: {
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number,
            customer_name: customerName || customerEmail,
            customer_email: customerEmail,
            total: grandTotal,
            due_date: invoice.due_date || 'Tidak ditentukan',
          }
        })
      })

      const notifyResult = await notifyRes.json()
      console.log('=== STEP 5: Notify response status:', notifyRes.status)
      console.log('=== STEP 5: Notify response body:', JSON.stringify(notifyResult))

      if (!notifyRes.ok) {
        console.error('Notify failed:', notifyResult)
        toast.warning('Invoice terkirim tapi notifikasi email gagal')
      } else {
        toast.success('Invoice berhasil dikirim ke customer!')
      }

      await loadData()

    } catch (error: any) {
      console.error('=== ERROR in handleSendToCustomer ===')
      console.error('Error message:', error?.message)
      console.error('Error code:', error?.code)
      console.error('Full error:', JSON.stringify(error))
      toast.error('Gagal mengirim invoice: ' + (error?.message || 'Unknown error'))
    } finally {
      setIsSending(false)
    }
  }

  const handlePrint = () => {
    const printContents = document.getElementById("invoice-card")?.innerHTML
    if (!printContents) return

    const printWindow = window.open("", "_blank", "width=800,height=600")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice?.invoice_number || ""}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #111; background: #fff; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
            th { text-align: left; padding: 10px 0; font-size: 13px; border-bottom: 2px solid #ddd; font-weight: 600; }
            td { padding: 10px 0; font-size: 13px; }
            svg { display: none; }
            h2 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }

            /* Flex & Grid */
            .flex { display: flex; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: 1fr 1fr; }
            .justify-between { justify-content: space-between; }
            .justify-end { justify-content: flex-end; }
            .items-start { align-items: flex-start; }
            .items-center { align-items: center; }

            /* Spacing */
            .gap-2 { gap: 0.5rem; }
            .gap-8 { gap: 2rem; }
            .mb-1 { margin-bottom: 0.25rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mt-1 { margin-top: 0.25rem; }
            .pt-2 { padding-top: 0.5rem; }
            .pt-4 { padding-top: 1rem; }
            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .space-y-2 > * + * { margin-top: 0.5rem; }

            /* Typography */
            .text-sm { font-size: 13px; }
            .text-lg { font-size: 1.125rem; }
            .text-2xl { font-size: 1.5rem; }
            .font-bold { font-weight: 700; }
            .font-medium { font-weight: 500; }
            .text-right { text-align: right; }
            .text-muted-foreground { color: #6b7280; }
            .whitespace-pre-line { white-space: pre-line; }

            /* Borders */
            .border-b { border-bottom: 1px solid #e5e7eb; }
            .border-t { border-top: 1px solid #e5e7eb; }

            /* Width - KUNCI FIX TOTALS */
            .w-32 { width: 10rem; text-align: right; flex-shrink: 0; }

            /* Strip card styling untuk print */
            .border { border: none !important; }
            .rounded-lg { border-radius: 0 !important; }
            .p-8 { padding: 0 !important; }
            .bg-white { background: #fff !important; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  const handleApprovePayment = async () => {
    if (!payment || !invoice) return
    setIsApproving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      await approvePayment(payment.id, invoice.id, invoice.customer_id, user.id)
      toast.success("Pembayaran berhasil dikonfirmasi!")
      await loadData()
    } catch (error: any) {
      console.error("Error approving payment:", error)
      toast.error(error.message || "Gagal konfirmasi pembayaran")
    } finally {
      setIsApproving(false)
    }
  }

  const handleRejectPayment = async () => {
    if (!payment || !invoice || !rejectReason.trim()) return
    setIsRejecting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      await rejectPayment(payment.id, invoice.id, invoice.customer_id, user.id, rejectReason.trim())
      toast.success("Bukti pembayaran ditolak")
      setShowRejectModal(false)
      setRejectReason("")
      await loadData()
    } catch (error: any) {
      console.error("Error rejecting payment:", error)
      toast.error(error.message || "Gagal menolak bukti pembayaran")
    } finally {
      setIsRejecting(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    if (!invoice) return
    setIsUpdatingStatus(true)
    try {
      await updateInvoice(invoice.id, { status: newStatus as any })
      const statusLabel = statusStepLabels[newStatus] || newStatus
      await createNotification({
        user_id: invoice.customer_id,
        type: 'invoice_status',
        title: `Status Invoice Diperbarui`,
        message: `Invoice ${invoice.invoice_number} berubah status menjadi: ${statusLabel}`
      })

      // Kirim email notifikasi jika status = 'sent'
      if (newStatus === 'sent') {
        console.log('=== Sending notify for status sent ===')
        let customerEmail = invoice.customer?.email
        let customerName = invoice.customer?.full_name
        if (!customerEmail) {
          const supabase = createClient()
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', invoice.customer_id)
            .single()
          customerEmail = profile?.email
          customerName = profile?.full_name
        }

        // Validasi email sebelum kirim ke n8n
        if (!customerEmail) {
          console.error('Customer has no email. Cannot send notification.')
          toast.warning('Status diubah, tapi customer tidak punya email untuk notifikasi.')
          return
        }

        try {
          const notifyRes = await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'invoice-sent',
              data: {
                invoice_id: invoice.id,
                invoice_number: invoice.invoice_number,
                customer_name: customerName || customerEmail,
                customer_email: customerEmail,
                total: grandTotal,
                due_date: invoice.due_date || 'Tidak ditentukan',
              }
            })
          })
          const notifyResult = await notifyRes.json()
          console.log('Notify response:', notifyRes.status, JSON.stringify(notifyResult))
          if (!notifyRes.ok) {
            console.error('Notify failed:', notifyResult)
          }
        } catch (err) {
          console.error('Notify error:', err)
        }
      }

      toast.success(`Status invoice diubah ke: ${statusLabel}`)
      await loadData()
    } catch (error: any) {
      console.error("Error updating status:", error)
      toast.error(error.message || "Gagal update status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDeleteInvoice = async () => {
    if (!invoice) return
    setIsDeleting(true)
    try {
      await deleteInvoice(invoice.id)
      toast.success("Invoice berhasil dihapus")
      window.location.href = '/admin/invoices'
    } catch (error: any) {
      console.error("Error deleting invoice:", error)
      toast.error(error.message || "Gagal menghapus invoice")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-7 w-40 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <DetailSkeleton />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Invoice Tidak Ditemukan</h1>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Invoice dengan ID ini tidak ada.</p>
        </div>
      </div>
    )
  }

  const invoiceItems = invoice.items || []
  const subtotal = invoice.subtotal || invoiceItems.reduce((sum, item) => sum + (item.subtotal || 0), 0)
  const taxAmount = (subtotal * (invoice.tax_percent ?? 0)) / 100
  const grandTotal = invoice.total || subtotal + taxAmount

  return (
    <div className="p-4 md:p-6 overflow-hidden bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Invoice</h1>
            <p className="text-gray-500 dark:text-gray-400">{invoice.invoice_number}</p>
          </div>
        </div>
        <Badge className={statusColors[invoice.status] || statusColors.unpaid} variant="secondary">
          {statusLabels[invoice.status] || invoice.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 overflow-hidden">
        {/* Invoice Preview */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <CardContent className="p-8">
            <div id="invoice-card" className="border border-gray-200 dark:border-gray-700 rounded-lg p-8 bg-white dark:bg-gray-900">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ashira.co.</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Jasa Pembuatan Website Professional
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    cuanpage.my.id | +62 857-1061-5365
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-lg text-gray-900 dark:text-white">INVOICE</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{invoice.invoice_number}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tanggal: {formatDate(invoice.created_at)}
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Kepada:</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.customer?.full_name || invoice.customer?.email || "-"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.customer?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Jatuh Tempo:</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.due_date ? formatDate(invoice.due_date) : "-"}</p>
                </div>
              </div>

              {/* Items */}
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Deskripsi</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Qty</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Harga</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceItems.length > 0 ? (
                    invoiceItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3 text-gray-900 dark:text-gray-100">{item.nama_layanan}</td>
                        <td className="py-3 text-right text-gray-900 dark:text-gray-100">{item.qty}</td>
                        <td className="py-3 text-right text-gray-900 dark:text-gray-100">{formatRupiah(item.harga_satuan)}</td>
                        <td className="py-3 text-right text-gray-900 dark:text-gray-100">{formatRupiah(item.subtotal)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 text-gray-900 dark:text-gray-100">-</td>
                      <td className="py-3 text-right text-gray-900 dark:text-gray-100">-</td>
                      <td className="py-3 text-right text-gray-900 dark:text-gray-100">-</td>
                      <td className="py-3 text-right text-gray-900 dark:text-gray-100">-</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals */}
              <div className="space-y-2 text-right mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-end gap-8">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="w-32 text-gray-900 dark:text-white">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-end gap-8">
                  <span className="text-gray-500 dark:text-gray-400">
                    Pajak ({invoice.tax_percent ?? 0}%)
                  </span>
                  <span className="w-32 text-gray-900 dark:text-white">{formatRupiah(taxAmount)}</span>
                </div>
                <div className="flex justify-end gap-8 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">Grand Total</span>
                  <span className="font-bold text-lg w-32 text-gray-900 dark:text-white">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Catatan:</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4 overflow-hidden">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                onClick={handleSendToCustomer}
                disabled={isSending}
              >
                <Send className="h-4 w-4 mr-2" />
                Kirim Ulang ke Pelanggan
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Link Disalin!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                onClick={handlePrint}
              >
                <Download className="h-4 w-4 mr-2" />
                Print / PDF
              </Button>
            </CardContent>
          </Card>

          {/* Status Update Card */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Visual Stepper */}
              <div className="flex items-center justify-between">
                {statusFlow.map((status, index) => {
                  const currentIndex = getCurrentStepIndex(invoice?.status || 'draft')
                  const isActive = index <= currentIndex && invoice?.status !== 'cancelled'
                  const isCurrent = index === currentIndex && invoice?.status !== 'cancelled'

                  if (status === 'cancelled') return null

                  return (
                    <div key={status} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCurrent
                            ? 'bg-indigo-600 text-white'
                            : isActive
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}
                      >
                        {isActive && !isCurrent ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <span className={`text-[10px] mt-1 text-center ${isCurrent ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                        {statusStepLabels[status]}
                      </span>
                      {index < statusFlow.length - 2 && (
                        <div className={`absolute h-0.5 w-full mt-4 ml-4 ${index < currentIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-2 pt-2">
                {invoice?.status === 'draft' && (
                  <Button
                    className="w-full"
                    onClick={() => handleUpdateStatus('sent')}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                    Kirim ke Customer (Sent)
                  </Button>
                )}
                {invoice?.status === 'submitted' && (
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-3 text-sm text-blue-700 dark:text-blue-400">
                    <p className="font-medium">Bukti bayar masuk</p>
                    <p className="text-xs mt-1">Gunakan panel Bukti Pembayaran di bawah untuk approve/tolak.</p>
                  </div>
                )}
                {invoice?.status !== 'cancelled' && invoice?.status !== 'paid' && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleUpdateStatus('cancelled')}
                    disabled={isUpdatingStatus}
                  >
                    {isUpdatingStatus ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                    Batalkan Invoice
                  </Button>
                )}
                {invoice?.status === 'cancelled' && (
                  <div className="text-center text-sm text-red-500 dark:text-red-400 py-2">
                    Invoice ini dibatalkan
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delete Invoice Card */}
          {invoice?.status === 'draft' && (
            <Card className="border-red-200 dark:border-red-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg text-red-600 dark:text-red-400">Zone Bahaya</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Hapus invoice ini. Aksi tidak bisa dibatalkan. Hanya invoice dengan status Draft yang bisa dihapus.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Hapus Invoice
                </Button>

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full mx-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Yakin hapus invoice ini?
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Invoice <strong>{invoice?.invoice_number}</strong> akan dihapus permanen. Aksi tidak bisa dibatalkan.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowDeleteDialog(false)}
                        >
                          Batal
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={handleDeleteInvoice}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Ya, Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white">Informasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Dibuat</span>
                <span className="text-gray-900 dark:text-gray-100">{formatDate(invoice.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Jatuh Tempo</span>
                <span className="text-gray-900 dark:text-gray-100">{invoice.due_date ? formatDate(invoice.due_date) : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <Badge className={statusColors[invoice.status] || statusColors.unpaid} variant="secondary">
                  {statusLabels[invoice.status] || invoice.status}
                </Badge>
              </div>
              {invoice.paid_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Dibayar Pada</span>
                  <span className="text-gray-900 dark:text-gray-100">{formatDate(invoice.paid_at)}</span>
                </div>
              )}
              {invoice.order && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Pesanan</span>
                  <span className="text-gray-900 dark:text-gray-100">{invoice.order.order_number}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Proof Section — reads from payments table */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <FileImage className="h-5 w-5 text-blue-600" />
                Bukti Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!payment || payment.status === 'pending' ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
                  ⏳ Menunggu bukti pembayaran dari customer
                </p>
              ) : payment.status === 'submitted' ? (
                <>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-500 dark:text-gray-400">
                      Dikirim: {payment.proof_uploaded_at ? getRelativeTime(payment.proof_uploaded_at) : '-'}
                    </p>
                    <p className="font-medium">Nominal: Rp {payment.amount?.toLocaleString('id-ID')}</p>
                  </div>
                  {payment.proof_url && (
                    <a href={payment.proof_url} target="_blank" rel="noopener noreferrer" className="block">
                      {payment.proof_url.match(/\.(jpg|jpeg|png)$/i) ? (
                        <img
                          src={payment.proof_url}
                          alt="Bukti Pembayaran"
                          className="rounded-lg border max-h-64 object-contain cursor-pointer hover:opacity-90 w-full"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <FileText className="h-8 w-8 text-red-500" />
                          <span className="text-sm text-blue-600 dark:text-blue-400">Lihat Bukti Bayar (PDF)</span>
                        </div>
                      )}
                    </a>
                  )}
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleApprovePayment}
                      disabled={isApproving}
                    >
                      {isApproving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                      Setujui
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setShowRejectModal(true)}
                      disabled={isRejecting}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Tolak
                    </Button>
                  </div>
                </>
              ) : payment.status === 'approved' ? (
                <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-3">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">✅ Pembayaran sudah dikonfirmasi</p>
                  {payment.reviewed_at && (
                    <p className="text-xs text-gray-500 mt-1">{getRelativeTime(payment.reviewed_at)}</p>
                  )}
                </div>
              ) : payment.status === 'rejected' ? (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-3 space-y-2">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">❌ Bukti ditolak</p>
                  {payment.rejection_reason && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">Alasan: {payment.rejection_reason}</p>
                  )}
                  <p className="text-xs text-gray-500">Customer diminta upload ulang</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white">Tolak Bukti Pembayaran</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Berikan alasan agar customer bisa upload ulang dengan benar.</p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Nominal tidak sesuai, foto buram, bukan bukti transfer"
              rows={3}
              className="mb-4"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => { setShowRejectModal(false); setRejectReason("") }}
                disabled={isRejecting}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectPayment}
                disabled={isRejecting || !rejectReason.trim()}
              >
                {isRejecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Tolak Pembayaran
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}