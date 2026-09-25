"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

export function ModernEpochHero() {
  return (
    <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
      {/* 2. Absolutely positioned underlying layer for background video (No overlays) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 transition-transform duration-1000"
        />
      </div>

      {/* 3. Hero Text Content */}
      <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl flex flex-col items-start"
        >
          {/* Headline - Opsi A: Bahasa Indonesia Kuat & Elegan */}
          <h1 className="font-display text-[42px] md:text-[56px] font-medium leading-[1.08] tracking-tight text-[#0a1b33]">
            Pondasi Era Baru
            <br />
            Ekosistem Sandang Modern
          </h1>

          {/* Subheadline adapted to Ashira Group Business Context */}
          <p className="mt-4 max-w-xl font-sans text-[14px] md:text-[15px] leading-relaxed text-[#64748b]">
            Merancang produk pakaian berkualitas tinggi, memberdayakan ekosistem
            konveksi terdesentralisasi, dan menyediakan fondasi kustomisasi
            cerdas untuk korporasi, ormawa, dan brand visioner di seluruh
            Indonesia.
          </p>

          {/* Contact Button */}
          <motion.div
            className="mt-6"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/order"
              className="inline-flex items-center justify-center bg-[#0a152d] text-white rounded-full px-7 py-3 text-sm font-medium shadow-md hover:bg-[#132247] transition-colors"
            >
              Mulai Kustomisasi
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* 4. Floating Bottom Navbar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-auto max-w-[92%] sm:max-w-none">
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40 gap-1 sm:gap-2"
        >
          {/* Circular Logo Placeholder with "✦" */}
          <div className="w-9 h-9 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center shrink-0">
            <span className="text-[#0a1b33] text-sm font-bold select-none">
              ✦
            </span>
          </div>

          {/* Two standard text buttons */}
          <div className="flex items-center">
            <Link
              href="/apparel"
              className="text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              Katalog Apparel
            </Link>
            <Link
              href="#tech"
              className="text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              Platform Tech
            </Link>
          </div>

          {/* "Get in touch" Button with ChevronRight */}
          <Link
            href="/#contact"
            className="bg-white px-4 sm:px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <span>Konsultasi Cepat</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#0a1b33]" />
          </Link>
        </motion.nav>
      </div>
    </div>
  )
}
