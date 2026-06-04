"use client"

import Image from "next/image"
import { ArrowRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28" style={{ backgroundColor: '#1c2143' }}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gold gradient accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full" style={{ background: 'linear-gradient(to left, rgba(212, 175, 55, 0.08), transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="max-w-4xl">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/images/logo.png"
              alt="ASHIRA GROUP"
              width={180}
              height={60}
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12" style={{ backgroundColor: '#D4AF37' }} />
            <span className="text-sm font-medium tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
              Premium Custom Apparel Manufacturer
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white leading-tight mb-6 text-balance">
            ASHIRA GROUP
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-4">
            First Customizable Apparel Supplier in Indonesia
          </p>

          {/* Quote */}
          <blockquote className="border-l-2 pl-6 my-8 max-w-2xl" style={{ borderColor: '#D4AF37' }}>
            <p className="text-lg md:text-xl text-white/70 italic leading-relaxed">
              &ldquo;We are not just selling the product, we are selling efficiency, time, and trust&rdquo;
            </p>
          </blockquote>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium tracking-wide transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
            >
              <a
                href="/order"
              >
                Order Our Apparel
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base font-medium tracking-wide border-white/30 text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#ffffff', color: '#1c2143' }}
            >
              <a href="/community">
                <Users className="mr-2 w-5 h-5" />
                Join Our Community
                
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-white/10">
            <div>
              <p className="text-3xl md:text-4xl font-serif mb-2" style={{ color: '#D4AF37' }}>500+</p>
              <p className="text-sm text-white/60 tracking-wide">Projects Completed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-serif mb-2" style={{ color: '#D4AF37' }}>100+</p>
              <p className="text-sm text-white/60 tracking-wide">Partner Organizations</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-serif mb-2" style={{ color: '#D4AF37' }}>50K+</p>
              <p className="text-sm text-white/60 tracking-wide">Items Delivered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
