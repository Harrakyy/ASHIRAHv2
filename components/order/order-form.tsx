"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Upload, CheckCircle, Send, ArrowRight } from "lucide-react"
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

  useEffect(() => {
    const stored = localStorage.getItem("ashira_prefill")
    if (stored) {
      try {
        const { nama, email, whatsapp } = JSON.parse(stored)
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
      sizes: { ...prev.sizes, [size]: parseInt(value) || 0 }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (totalQuantity === 0) {
      setError('Masukkan jumlah ukuran terlebih dahulu.')
      return
    }
    
    setShowNegotiator(true)
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
        body: JSON.stringify({ messages: [], orderContext }),
      })
      
      const data = await res.json()
      
      if (data.message) {
        setChatMessages([{ role: 'assistant', content: data.message }])
      }
    } catch (err) {
      setError('Koneksi gagal, coba lagi.')
      setShowNegotiator(false)
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
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Maaf, terjadi kesalahan koneksi. Coba lagi.' 
      }])
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
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-3xl text-white mb-4">Order Berhasil!</h2>
          <div className="bg-[#1c2143] border border-[#C0C0C0]/20 p-6 mb-8">
            <p className="text-white/60 text-sm mb-2">Nomor Order Kamu</p>
            <p className="text-2xl font-mono text-[#D4AF37]">{orderNumber}</p>
          </div>
          <p className="text-white/60 mb-4">
            Tim Ashira akan menghubungi kamu via WhatsApp atau Email 
            dalam 1x24 jam untuk konfirmasi detail order.
          </p>
          <p className="text-white/40 text-sm">Simpan nomor order ini sebagai referensi.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            src="/images/ashira-corporate-logo.png"
            alt="ASHIRA'H.CO"
            width={150}
            height={50}
            className="mx-auto mb-6"
            style={{ width: 'auto', height: 'auto' }}
          />
          <h1 className="font-serif text-3xl md:text-4xl text-white mb-4">
            Custom Apparel Order Form
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Fill in your details below to request a custom quote. Our team will contact you within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Details */}
          <div className="bg-[#1c2143]/50 border border-[#C0C0C0]/10 p-6 md:p-8">
            <h3 className="text-white font-medium mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D4AF37] text-[#1c2143] rounded-full text-sm flex items-center justify-center">1</span>
              Client Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Full Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white placeholder:text-white/30"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white placeholder:text-white/30"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">WhatsApp Number *</label>
                <Input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                  className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white placeholder:text-white/30"
                  placeholder="08123456789"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Address *</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white placeholder:text-white/30"
                  placeholder="City, Province"
                />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-[#1c2143]/50 border border-[#C0C0C0]/10 p-6 md:p-8">
            <h3 className="text-white font-medium mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D4AF37] text-[#1c2143] rounded-full text-sm flex items-center justify-center">2</span>
              Order Details
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-white/60 text-sm mb-2 block">Order Type *</label>
                <Input
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleInputChange}
                  required
                  className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white placeholder:text-white/30"
                  placeholder="e.g., Jersey Futsal, Varsity Jacket, T-Shirt Event"
                />
              </div>

              {/* Size Grid */}
              <div>
                <label className="text-white/60 text-sm mb-4 block">Size Quantities</label>
                <div className="grid grid-cols-5 gap-3">
                  {(Object.keys(formData.sizes) as Array<keyof typeof formData.sizes>).map((size) => (
                    <div key={size} className="text-center">
                      <label className="text-white/80 text-sm block mb-2">{size}</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.sizes[size] || ""}
                        onChange={(e) => handleSizeChange(size, e.target.value)}
                        className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white text-center"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-sm mt-3">
                  Total Quantity: <span className="text-[#D4AF37]">{totalQuantity} pcs</span>
                </p>
              </div>


            </div>
          </div>

          {/* Design Upload */}
          <div className="bg-[#1c2143]/50 border border-[#C0C0C0]/10 p-6 md:p-8">
            <h3 className="text-white font-medium mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D4AF37] text-[#1c2143] rounded-full text-sm flex items-center justify-center">3</span>
              Design Upload
            </h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
                  : 'border-[#C0C0C0]/20 hover:border-[#C0C0C0]/40'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="w-10 h-10 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 mb-2">
                {formData.designFile 
                  ? formData.designFile.name 
                  : "Drag and drop your design here"}
              </p>
              <p className="text-white/40 text-sm mb-4">or</p>
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-[#C0C0C0]/10 text-white/80 text-sm hover:bg-[#C0C0C0]/20 transition-colors">
                  Browse Files
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.ai,.psd"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-white/30 text-xs mt-4">
                Supported: JPG, PNG, PDF, AI, PSD
              </p>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-[#1c2143]/50 border border-[#C0C0C0]/10 p-6 md:p-8">
            <h3 className="text-white font-medium mb-6 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#D4AF37] text-[#1c2143] rounded-full text-sm flex items-center justify-center">4</span>
              Additional Notes
            </h3>
            
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white placeholder:text-white/30"
              placeholder="Any special requirements, deadline, or questions..."
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full py-6 text-base font-medium transition-all hover:scale-[1.02]"
            style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
          >
            Cek Harga
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-white/40 text-xs text-center">
            By submitting this form, you agree to be contacted by our team regarding your order.
          </p>
        </form>

        {showNegotiator && !isSubmitted && (
          <div className="max-w-4xl mx-auto mt-8 mb-16">
            <div className="bg-[#1c2143]/50 border border-[#C0C0C0]/10 p-6 md:p-8">
              <h3 className="text-white font-medium mb-6 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#D4AF37] text-[#1c2143] rounded-full text-sm flex items-center justify-center">✦</span>
                Negosiasi Harga
              </h3>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-[#D4AF37] text-[#1c2143] font-medium'
                          : 'bg-[#0a0d1a] text-white/90 border border-[#C0C0C0]/10'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0a0d1a] border border-[#C0C0C0]/10 px-4 py-3 rounded-2xl">
                      <span className="text-white/40 text-sm">Tim Ashira sedang mengetik...</span>
                    </div>
                  </div>
                )}
              </div>
              
              {!isDealDone && (
                <div className="flex gap-3">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ketik pesanmu di sini..."
                    disabled={isChatLoading}
                    className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white placeholder:text-white/30 flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isChatLoading || !userInput.trim()}
                    style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {isDealDone && !isSubmitted && (
                <p className="text-white/40 text-sm text-center">
                  Sedang memproses order kamu...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
