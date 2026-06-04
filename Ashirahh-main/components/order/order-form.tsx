"use client"

import { useState } from "react"
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
  price: string
  designFile: File | null
  notes: string
}

function generateOrderId() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ASH/K-${year}-${random}`
}

export function OrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    whatsapp: "",
    address: "",
    orderType: "",
    sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    price: "",
    designFile: null,
    notes: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [isDragging, setIsDragging] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newOrderId = generateOrderId()
    setOrderId(newOrderId)
    setIsSubmitted(true)
  }

  const generateWhatsAppMessage = () => {
    const sizeDetails = Object.entries(formData.sizes)
      .filter(([, qty]) => qty > 0)
      .map(([size, qty]) => `${size}: ${qty}`)
      .join(", ")

    const message = `
*NEW ORDER - ${orderId}*
---
*Client Details:*
Name: ${formData.name}
Email: ${formData.email}
WhatsApp: ${formData.whatsapp}
Address: ${formData.address}

*Order Details:*
Type: ${formData.orderType}
Sizes: ${sizeDetails}
Total Qty: ${totalQuantity} pcs
Price Expectation: ${formData.price}

*Notes:*
${formData.notes || "No additional notes"}
---
Submitted via ASHIRA Order Form
    `.trim()

    return encodeURIComponent(message)
  }

  if (isSubmitted) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#D4AF37]" />
          </div>
          
          <h2 className="font-serif text-3xl text-white mb-4">Order Submitted!</h2>
          
          <div className="bg-[#1c2143] border border-[#C0C0C0]/20 p-6 mb-8">
            <p className="text-white/60 text-sm mb-2">Your Order ID</p>
            <p className="text-2xl font-mono text-[#D4AF37]">{orderId}</p>
          </div>

          <p className="text-white/60 mb-8">
            Thank you for your order! Please send your complete order details to our admin via WhatsApp.
          </p>

          <Button
            asChild
            size="lg"
            className="w-full rounded-full py-6"
            style={{ backgroundColor: '#25D366', color: 'white' }}
          >
            <a
              href={`https://wa.me/6285819993633?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="mr-2 w-5 h-5" />
              Send to Admin WhatsApp
            </a>
          </Button>

          <button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                name: "",
                email: "",
                whatsapp: "",
                address: "",
                orderType: "",
                sizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
                price: "",
                designFile: null,
                notes: "",
              })
            }}
            className="mt-6 text-white/50 text-sm hover:text-white transition-colors"
          >
            Submit Another Order
          </button>
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

              <div>
                <label className="text-white/60 text-sm mb-2 block">Price Expectation</label>
                <Input
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white placeholder:text-white/30"
                  placeholder="e.g., Rp 100.000/pcs or Negotiable"
                />
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

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full py-6 text-base font-medium transition-all hover:scale-[1.02]"
            style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
          >
            Submit Order
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-white/40 text-xs text-center">
            By submitting this form, you agree to be contacted by our team regarding your order.
          </p>
        </form>
      </div>
    </section>
  )
}
