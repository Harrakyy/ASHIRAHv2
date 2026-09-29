"use client"

import { useState, useEffect, useRef } from "react"
import { Upload, CheckCircle, Send, ArrowRight, Loader2, MessageCircle } from "lucide-react"
import { WHATSAPP_URL } from "@/data/hero-slides"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface OrderFormData {
  name: string
  email: string
  whatsapp: string
  address: string
  orderType: string
  sizes: {
    S: number
    M: number
    L: number
    XL: number
    XXL: number
  }
  designFile: File | null
  notes: string
  negotiated_price?: number
  original_price?: number
  negotiation_summary?: string
  ai_session_id?: string
}

const card =
  "rounded-[28px] border border-white bg-white/90 p-6 shadow-[0_12px_32px_rgba(10,18,51,0.1)] md:p-8"
const field =
  "h-11 rounded-xl border-ashira-navy/15 bg-white text-ashira-navy placeholder:text-ashira-muted/60 focus-visible:border-ashira-royal focus-visible:ring-ashira-royal/20"
const label = "mb-2 block text-sm font-medium text-ashira-navy"

function StepTitle({ step, children }: { step: string; children: React.ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-ashira-navy">
      <span className="ashira-dark-gradient flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white">
        {step}
      </span>
      {children}
    </h2>
  )
}

export function OrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    whatsapp: "",
    address: "",
    orderType: "",
    sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    designFile: null,
    notes: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [showNegotiator, setShowNegotiator] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user'|'assistant', content: string}>>([])
  const [userInput, setUserInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isDealDone, setIsDealDone] = useState(false)
  const [dealData, setDealData] = useState<Record<string, unknown> | null>(null)
  /** true bila API negosiasi gagal (mis. API key AI belum di-set) → tampilkan jalur WhatsApp. */
  const [aiUnavailable, setAiUnavailable] = useState(false)
  const negotiatorRef = useRef<HTMLDivElement>(null)

  // Bawa panel negosiasi ke layar begitu muncul — sebelumnya muncul di bawah fold tanpa tanda apa pun.
  useEffect(() => {
    if (showNegotiator) negotiatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [showNegotiator])

  useEffect(() => {
    const stored = localStorage.getItem("ashira_prefill")
    if (stored) {
      try {
        const { nama, email, whatsapp } = JSON.parse(stored)
        // localStorage hanya ada di browser → prefill harus setelah mount (hindari hydration mismatch)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(prev => ({
          ...prev,
          name: nama || "",
          email: email || "",
          whatsapp: whatsapp || "",
        }))
      } catch {}
      localStorage.removeItem("ashira_prefill")
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSizeChange = (size: keyof typeof formData.sizes, value: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: { ...prev.sizes, [size]: Math.max(0, parseInt(value) || 0) }
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, designFile: e.target.files![0] }))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, designFile: e.dataTransfer.files[0] }))
    }
  }

  const totalQuantity = Object.values(formData.sizes).reduce((a, b) => a + b, 0)

  const sizeSummary = Object.entries(formData.sizes)
    .filter(([, qty]) => qty > 0)
    .map(([size, qty]) => `${size}: ${qty}`)
    .join(", ")
  const waOrderText = [
    "Halo ASHIRA, saya ingin order custom apparel:",
    `- Nama: ${formData.name}`,
    `- Produk: ${formData.orderType}`,
    `- Jumlah: ${totalQuantity} pcs${sizeSummary ? ` (${sizeSummary})` : ""}`,
    `- Alamat: ${formData.address}`,
    formData.notes && `- Catatan: ${formData.notes}`,
    formData.designFile && `- File desain: ${formData.designFile.name} (akan saya kirim di chat ini)`,
  ]
    .filter(Boolean)
    .join("\n")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (totalQuantity === 0) {
      setError('Masukkan jumlah ukuran terlebih dahulu.')
      return
    }
    
    setShowNegotiator(true)
    setIsChatLoading(true)
    setAiUnavailable(false)
    setChatMessages([])
    setIsDealDone(false)
    
    try {
      const orderContext = {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        address: formData.address,
        orderType: formData.orderType,
        sizes: formData.sizes,
        notes: formData.notes,
        totalQty: totalQuantity,
        basePrice: 0,
        totalPrice: 0,
      }
      
      const res = await fetch('/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], orderContext }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'AI tidak tersedia')
      
      if (data.message) {
        setChatMessages([{ role: 'assistant', content: data.message }])
      }
    } catch (err) {
      setAiUnavailable(true)
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!userInput.trim() || isChatLoading || isDealDone) return
    
    const newMessages = [...chatMessages, { role: 'user' as const, content: userInput }]
    setChatMessages(newMessages)
    setUserInput('')
    setIsChatLoading(true)
    
    try {
      const orderContext = {
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        address: formData.address,
        orderType: formData.orderType,
        sizes: formData.sizes,
        notes: formData.notes,
        totalQty: totalQuantity,
        basePrice: 0,
        totalPrice: 0,
      }
      
      const res = await fetch('/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          orderContext,
        }),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'AI tidak tersedia')
      
      if (data.message) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      }
      
      if (data.isDealConfirmed && data.dealData) {
        setDealData(data.dealData)
        setIsDealDone(true)
        await submitOrder(data.dealData)
      }
      
      if (data.isDealRejected) {
        setIsDealDone(true)
      }
      
    } catch (err) {
      setAiUnavailable(true)
    } finally {
      setIsChatLoading(false)
    }
  }

  const submitOrder = async (deal: Record<string, unknown>) => {
    try {
      const fd = new FormData()
      fd.append('name', String(deal.customer_name || formData.name))
      fd.append('email', String(deal.customer_email || formData.email))
      fd.append('whatsapp', String(deal.customer_whatsapp || formData.whatsapp))
      fd.append('address', String(deal.customer_address || formData.address))
      fd.append('orderType', String(deal.order_type || formData.orderType))
      fd.append('sizes', JSON.stringify(deal.sizes || formData.sizes))
      fd.append('notes', String(deal.notes || formData.notes || ''))
      fd.append('negotiated_price', String(deal.total_price || 0))
      fd.append('original_price', String(deal.total_price || 0))
      fd.append('negotiation_summary', 
        `Deal: ${deal.total_qty} pcs ${deal.order_type} @ Rp ${Number(deal.negotiated_price).toLocaleString('id-ID')}/pcs. Total: Rp ${Number(deal.total_price).toLocaleString('id-ID')}`)
      fd.append('ai_session_id', Date.now().toString())
      
      if (formData.designFile) {
        fd.append('designFile', formData.designFile)
      }
      
      const res = await fetch('/api/public-order', {
        method: 'POST',
        body: fd,
      })
      
      const result = await res.json()
      
      if (result.success) {
        setOrderNumber(result.order_number)
        setIsSubmitted(true)
        localStorage.removeItem('ashira_prefill')
      }
    } catch (err) {
      console.error('Submit order failed:', err)
    }
  }

  if (isSubmitted) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pb-16 pt-28">
        <div className="w-full max-w-lg rounded-[32px] border border-white bg-white/90 p-8 text-center shadow-[0_20px_48px_rgba(10,18,51,0.12)] sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D9F5DC]">
            <CheckCircle className="h-9 w-9 text-[#22C55E]" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-ashira-navy">Order Berhasil!</h1>
          <div className="mb-6 rounded-2xl bg-[#ECEDF3] p-5">
            <p className="mb-1 text-sm text-ashira-muted">Nomor Order Kamu</p>
            <p className="font-mono text-2xl font-bold text-ashira-deep">{orderNumber}</p>
          </div>
          <p className="mb-3 text-ashira-navy/80">
            Tim Ashira akan menghubungi kamu via WhatsApp atau Email dalam 1x24 jam untuk konfirmasi detail order.
          </p>
          <p className="text-sm text-ashira-muted">Simpan nomor order ini sebagai referensi.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="px-3 pb-20 pt-[92px] sm:px-6 lg:px-8 lg:pt-[112px]">
      {/* Header */}
      <div className="ashira-dark-gradient mx-auto max-w-[1376px] rounded-[32px] px-6 py-12 text-center shadow-[0_20px_48px_rgba(10,18,51,0.25)] sm:px-10 lg:rounded-[44px] lg:py-16">
        <span className="rounded-full border border-white/55 px-4 py-1.5 text-[13px] font-medium text-white">
          ASHIRA Apparel — Pesanan Custom
        </span>
        <h1 className="ashira-silver-text mx-auto mt-6 max-w-[720px] text-[34px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[48px]">
          Formulir Pesanan Apparel Custom
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-[1.6] text-[#D9D9D9]">
          Isi data di bawah untuk meminta penawaran custom. Tim kami akan menghubungimu dalam 1×24 jam.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Details */}
          <div className={card}>
            <StepTitle step="1">Data Pemesan</StepTitle>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="order-name" className={label}>Nama Lengkap *</label>
                <Input id="order-name" name="name" value={formData.name} onChange={handleInputChange} required className={field} placeholder="Nama lengkap" />
              </div>
              <div>
                <label htmlFor="order-email" className={label}>Email *</label>
                <Input id="order-email" type="email" name="email" value={formData.email} onChange={handleInputChange} required className={field} placeholder="nama@email.com" />
              </div>
              <div>
                <label htmlFor="order-whatsapp" className={label}>Nomor WhatsApp *</label>
                <Input
                  id="order-whatsapp"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  pattern="(\+62|62|0)8[0-9 \-]{7,15}"
                  title="Nomor WhatsApp Indonesia, mis. 08123456789"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                  className={field}
                  placeholder="08123456789"
                />
              </div>
              <div>
                <label htmlFor="order-address" className={label}>Alamat *</label>
                <Input id="order-address" name="address" value={formData.address} onChange={handleInputChange} required className={field} placeholder="Kota, Provinsi" />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className={card}>
            <StepTitle step="2">Detail Pesanan</StepTitle>
            <div className="space-y-6">
              <div>
                <label htmlFor="order-type" className={label}>Jenis Produk *</label>
                <Input
                  id="order-type"
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleInputChange}
                  required
                  className={field}
                  placeholder="mis. Jersey Futsal, Jaket Varsity, Kaos Event"
                />
              </div>

              {/* Size Grid */}
              <fieldset>
                <legend className={label}>Jumlah per Ukuran</legend>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {(Object.keys(formData.sizes) as Array<keyof typeof formData.sizes>).map((size) => (
                    <div key={size} className="text-center">
                      <label htmlFor={`size-${size}`} className="mb-2 block text-sm font-semibold text-ashira-muted">{size}</label>
                      <Input
                        id={`size-${size}`}
                        type="number"
                        min="0"
                        inputMode="numeric"
                        value={formData.sizes[size] || ""}
                        onChange={(e) => handleSizeChange(size, e.target.value)}
                        className={`${field} px-1 text-center`}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-ashira-muted">
                  Total: <span className="font-semibold text-ashira-blue">{totalQuantity} pcs</span>
                </p>
              </fieldset>
            </div>
          </div>

          {/* Design Upload */}
          <div className={card}>
            <StepTitle step="3">Unggah Desain</StepTitle>
            <div
              className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                isDragging ? "border-ashira-royal bg-[#EEF0FA]" : "border-ashira-navy/15 hover:border-ashira-navy/30"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto mb-4 h-10 w-10 text-ashira-muted" />
              <p className="mb-2 font-medium text-ashira-navy">
                {formData.designFile ? formData.designFile.name : "Tarik & lepas file desain di sini"}
              </p>
              <p className="mb-4 text-sm text-ashira-muted">atau</p>
              <label className="cursor-pointer">
                <span className="inline-flex rounded-full border border-ashira-navy/20 px-5 py-2 text-sm font-semibold text-ashira-navy transition-colors hover:bg-[#EEF0FA]">
                  Pilih File
                </span>
                <input type="file" className="sr-only" accept="image/*,.pdf,.ai,.psd" onChange={handleFileChange} />
              </label>
              <p className="mt-4 text-xs text-ashira-muted">Format: JPG, PNG, PDF, AI, PSD</p>
            </div>
          </div>

          {/* Additional Notes */}
          <div className={card}>
            <StepTitle step="4">Catatan Tambahan</StepTitle>
            <Textarea
              aria-label="Catatan tambahan"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="rounded-xl border-ashira-navy/15 bg-white text-ashira-navy placeholder:text-ashira-muted/60"
              placeholder="Kebutuhan khusus, deadline, atau pertanyaan..."
            />
          </div>

          {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isChatLoading}
            aria-busy={isChatLoading}
            className="ashira-dark-gradient flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(10,18,51,0.25)] transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100"
          >
            {isChatLoading && !chatMessages.length ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Menghitung harga...
              </>
            ) : (
              <>
                {showNegotiator ? "Cek Harga Ulang" : "Cek Harga"} <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-ashira-muted">
            Dengan mengirim formulir ini, kamu setuju dihubungi tim kami terkait pesananmu.
          </p>
        </form>

        {showNegotiator && !isSubmitted && (
          <div ref={negotiatorRef} className={`${card} mt-6 scroll-mt-24`}>
            <StepTitle step="✦">Negosiasi Harga</StepTitle>

            <div className={`max-h-96 space-y-3 overflow-y-auto ${chatMessages.length || isChatLoading ? "mb-6" : ""}`} aria-live="polite">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "rounded-tr-md bg-ashira-deep font-medium text-white"
                        : "rounded-tl-md bg-[#EEF0FA] text-ashira-navy"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-md bg-[#EEF0FA] px-4 py-3">
                    <span className="text-sm text-ashira-muted">Tim ASHIRA sedang mengetik...</span>
                  </div>
                </div>
              )}
            </div>

            {aiUnavailable && (
              <div className="rounded-2xl bg-[#EEF0FA] p-5">
                <p className="font-semibold text-ashira-navy">Negosiasi otomatis sedang tidak tersedia</p>
                <p className="mt-1 text-sm text-ashira-muted">
                  Data pesananmu tidak hilang. Kirim ringkasannya ke tim kami lewat WhatsApp untuk mendapatkan penawaran harga.
                </p>
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent(waOrderText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ashira-dark-gradient mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" /> Lanjut via WhatsApp
                </a>
              </div>
            )}

            {!isDealDone && !aiUnavailable && (
              <div className="flex gap-3">
                <Input
                  aria-label="Pesan negosiasi"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ketik pesanmu di sini..."
                  disabled={isChatLoading}
                  className={`${field} flex-1`}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isChatLoading || !userInput.trim()}
                  aria-label="Kirim pesan"
                  className="ashira-dark-gradient h-11 w-11 rounded-full p-0 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isDealDone && !isSubmitted && (
              <p className="text-center text-sm text-ashira-muted">Sedang memproses order kamu...</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
