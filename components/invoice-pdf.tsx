"use client"

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  brandName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  brandTagline: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#374151",
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e3a5f",
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
  },
  value: {
    fontSize: 10,
    color: "#111827",
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a5f",
    padding: 8,
  },
  tableHeaderText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
    color: "#374151",
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "center" },
  col3: { flex: 1, textAlign: "right" },
  col4: { flex: 1, textAlign: "right" },
  totalSection: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 40,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 11,
    color: "#111827",
    minWidth: 80,
    textAlign: "right",
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  notes: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e3a5f",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: "#6b7280",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
  },
})

interface InvoiceItem {
  id?: string
  nama_layanan?: string
  description?: string
  qty?: number
  quantity?: number
  harga_satuan?: number
  unit_price?: number
  subtotal?: number
  total?: number
}

interface InvoiceData {
  id?: string
  invoice_number?: string
  created_at?: string
  due_date?: string
  status?: string
  subtotal?: number
  tax_percent?: number
  tax_amount?: number
  total?: number
  notes?: string
}

interface InvoicePDFProps {
  invoice: InvoiceData
  items: InvoiceItem[]
  customerName: string
  customerEmail?: string
}

export function InvoiceDocument({
  invoice,
  items,
  customerName,
  customerEmail,
}: InvoicePDFProps) {
  const formatCurrency = (amount: number | undefined) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0)

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getItemName = (item: InvoiceItem) =>
    item.nama_layanan || item.description || "Layanan"
  const getItemQty = (item: InvoiceItem) => item.qty || item.quantity || 1
  const getItemPrice = (item: InvoiceItem) => item.harga_satuan || item.unit_price || 0
  const getItemSubtotal = (item: InvoiceItem) =>
    item.subtotal || item.total || getItemQty(item) * getItemPrice(item)

  const subtotal = invoice?.subtotal || items.reduce((sum, i) => sum + getItemSubtotal(i), 0)
  const taxPercent = invoice?.tax_percent || 11
  const taxAmount =
    invoice?.tax_amount || (subtotal * taxPercent) / 100
  const total =
    invoice?.total ||
    subtotal + taxAmount

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>Ashira.co</Text>
            <Text style={styles.brandTagline}>Professional Website Services</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>
              {invoice?.invoice_number ||
                `#${invoice?.id?.slice(0, 8).toUpperCase()}`}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tanggal</Text>
            <Text style={styles.value}>{formatDate(invoice?.created_at)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Jatuh Tempo</Text>
            <Text style={styles.value}>{formatDate(invoice?.due_date)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>
              {(invoice?.status || "unpaid").toUpperCase()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pelanggan</Text>
            <Text style={styles.value}>{customerName}</Text>
          </View>
          {customerEmail && (
            <View style={styles.row}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{customerEmail}</Text>
            </View>
          )}
        </View>

        <View style={styles.table}>
          <Text style={styles.sectionTitle}>Detail Layanan</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>Deskripsi</Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>Harga</Text>
            <Text style={[styles.tableHeaderText, styles.col4]}>Total</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                {getItemName(item)}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>
                {getItemQty(item)}
              </Text>
              <Text style={[styles.tableCell, styles.col3]}>
                {formatCurrency(getItemPrice(item))}
              </Text>
              <Text style={[styles.tableCell, styles.col4]}>
                {formatCurrency(getItemSubtotal(item))}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          {taxAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Pajak ({taxPercent}%)
              </Text>
              <Text style={styles.totalValue}>
                {formatCurrency(taxAmount)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.grandTotal]}>Total</Text>
            <Text style={[styles.totalValue, styles.grandTotal]}>
              {formatCurrency(total)}
            </Text>
          </View>
        </View>

        {invoice?.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Catatan Pembayaran:</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Ashira.co — Terima kasih atas kepercayaan Anda
        </Text>
      </Page>
    </Document>
  )
}

interface InvoiceDownloadButtonProps {
  invoice: InvoiceData
  items: InvoiceItem[]
  customerName: string
  customerEmail?: string
  loadingText?: string
  buttonText?: string
  className?: string
}

export function InvoiceDownloadButton({
  invoice,
  items,
  customerName,
  customerEmail,
  loadingText = "Menyiapkan PDF...",
  buttonText = "Download PDF",
  className = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50",
}: InvoiceDownloadButtonProps) {
  const fileName = `invoice-${
    invoice?.invoice_number || invoice?.id?.slice(0, 8) || "download"
  }.pdf`

  return (
    <PDFDownloadLink
      document={
        <InvoiceDocument
          invoice={invoice}
          items={items}
          customerName={customerName}
          customerEmail={customerEmail}
        />
      }
      fileName={fileName}
    >
      {({ loading }) => (
        <button
          className={className}
          disabled={loading}
        >
          {loading ? loadingText : buttonText}
        </button>
      )}
    </PDFDownloadLink>
  )
}