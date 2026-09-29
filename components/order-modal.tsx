"use client"

import { createContext, useContext, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { WHATSAPP_URL } from "@/data/hero-slides"

/**
 * Modal "Mulai Order" — Figma "Prototype / Modal · Order".
 * Dipicu oleh Order Now (navbar & hero) dan CTA kanvas. Pemicu tetap berupa link ke /order
 * agar tetap berfungsi sebelum JavaScript termuat.
 */

const OrderModalContext = createContext<{ open: () => void } | null>(null)

export function useOrderModal() {
  return useContext(OrderModalContext)
}

const optionClass =
  "group block rounded-2xl border border-ashira-muted/35 bg-[#F4F5FB] px-5 py-4 transition-colors hover:border-ashira-royal/60 hover:bg-[#EEF0FA]"

export function OrderModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  return (
    <OrderModalContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] gap-0 rounded-[28px] border-0 bg-white p-7 shadow-[0_24px_60px_rgba(4,3,13,0.35)] sm:max-w-[520px] sm:p-9">
          <DialogTitle className="text-[26px] font-bold tracking-[-0.01em] text-ashira-navy">Mulai Order</DialogTitle>
          <DialogDescription className="mt-3 text-base text-ashira-muted">
            Pilih cara order yang paling nyaman buat kamu.
          </DialogDescription>

          <div className="mt-6 space-y-4">
            <Link href="/order" onClick={close} className={optionClass}>
              <span className="flex items-center gap-2 text-[17px] font-semibold text-ashira-navy">
                Desain sendiri di kanvas
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block text-sm text-ashira-muted">
                Pilih produk, tambah logo &amp; teks, harga langsung terhitung.
              </span>
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={close} className={optionClass}>
              <span className="flex items-center gap-2 text-[17px] font-semibold text-ashira-navy">
                Konsultasi dulu via WhatsApp
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block text-sm text-ashira-muted">
                Tanya bahan, jumlah minimum, dan estimasi harga.
              </span>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </OrderModalContext.Provider>
  )
}

/** Link ke /order yang membuka modal "Mulai Order" bila provider tersedia. */
export function OrderTrigger({
  className,
  children,
  onClick,
}: {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}) {
  const modal = useOrderModal()
  return (
    <Link
      href="/order"
      className={className}
      onClick={(e) => {
        onClick?.()
        if (!modal) return
        e.preventDefault()
        modal.open()
      }}
    >
      {children}
    </Link>
  )
}
