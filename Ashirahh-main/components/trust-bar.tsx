"use client"

import { useEffect, useRef } from "react"

const clients = [
  { name: "Universitas Indonesia", short: "UI" },
  { name: "IPB University", short: "IPB" },
  { name: "IKABA FIB UI", short: "IKABA" },
  { name: "Syabaab Ussunnah", short: "SS" },
  { name: "Corporate Partners", short: "CORP" },
  { name: "Local Brands", short: "LOCAL" },
  { name: "Student Organizations", short: "ORMAWA" },
  { name: "Government Agencies", short: "GOV" },
]

export function TrustBar() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0

    const scroll = () => {
      scrollPosition += 0.5
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <section className="py-16 bg-secondary border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-2" style={{ color: '#D4AF37' }}>
            Trusted By
          </p>
          <h3 className="text-lg text-muted-foreground">
            Partnering with Visionary Organizations Across Universities & Corporates in Indonesia
          </h3>
        </div>

        {/* Scrolling logos */}
        <div 
          ref={scrollRef}
          className="overflow-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-12 w-max">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={index}
                className="group flex items-center justify-center px-8 py-4 bg-card border border-border hover:border-[#D4AF37]/50 transition-all duration-300 min-w-[180px]"
              >
                <div className="text-center">
                  <p className="text-2xl font-serif text-muted-foreground group-hover:text-foreground transition-colors">
                    {client.short}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1 group-hover:text-muted-foreground transition-colors">
                    {client.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Keywords */}
        <div className="mt-10 text-center">
          <p className="text-xs text-muted-foreground/50 max-w-3xl mx-auto">
            Premium Apparel Manufacturer based in Tangerang, Serving Nationwide | 
            Konveksi Premium Jakarta | Custom Varsity Jacket Indonesia | 
            Pengiriman Seluruh Indonesia | Produksi Seragam Berkualitas
          </p>
        </div>
      </div>
    </section>
  )
}
