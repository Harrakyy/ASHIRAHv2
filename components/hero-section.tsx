"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, ShoppingBag } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1742281695025-d6bf76d6e743?w=1920&q=80&auto=format&fit=crop"
          alt="Textile factory background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#1c2143]/70" />
      </div>

      {/* Decorative shapes */}
      <div className="absolute top-40 right-0 w-96 h-96 opacity-5">
        <div className="w-full h-full rounded-full bg-white blur-3xl" />
      </div>
      <div className="absolute bottom-20 left-0 w-72 h-72 opacity-5">
        <div className="w-full h-full rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Small gold header */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-[28rem] h-36">
              <Image
                src="/images/logo.png"
                alt="ASHIRA'H"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8" style={{ backgroundColor: '#D4AF37' }} />
            <span className="text-sm font-medium tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
              PREMIUM CUSTOM APPAREL MANUFACTURER
            </span>
            <div className="h-px w-8" style={{ backgroundColor: '#D4AF37' }} />
          </div>

          {/* Main title */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-tight mb-6 tracking-tight">
            ASHIRA GROUP
          </h1>

          {/* Sub-title */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            First Customizable Apparel Supplier in Indonesia
          </p>

          {/* Quote with gold vertical line */}
          <div className="flex items-start gap-4 max-w-2xl mx-auto mb-12 text-left">
            <div className="w-1 h-full min-h-[3rem] shrink-0 rounded-full" style={{ backgroundColor: '#D4AF37' }} />
            <p className="italic text-white/80 text-base md:text-lg leading-relaxed">
              &ldquo;At ASHIRA GROUP, we believe every stitch tells a story. We&apos;re not just crafting apparel—we&apos;re bringing your vision to life with 
              premium quality and unmatched customization.&rdquo;
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/order"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 32px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                fontSize: "16px",
                fontWeight: 500,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
            >
              Order Our Apparel
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/community"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 32px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                fontSize: "16px",
                fontWeight: 500,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
            >
              <Users className="w-5 h-5" />
              Join Our Community
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl text-white mb-1" style={{ color: '#D4AF37' }}>500+</p>
              <p className="text-sm text-white/60">Projects Completed</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl text-white mb-1" style={{ color: '#D4AF37' }}>100+</p>
              <p className="text-sm text-white/60">Partner Organizations</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl text-white mb-1" style={{ color: '#D4AF37' }}>50K+</p>
              <p className="text-sm text-white/60">Items Delivered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
