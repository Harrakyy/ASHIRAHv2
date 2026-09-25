"use client"

import React from "react"
import { motion, useReducedMotion } from "framer-motion"

export const HeroTextBlock = React.memo(function HeroTextBlock() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      className="flex flex-col items-start"
    >
      {/* Badge (above headline) */}
      <div className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-4 py-1.5 text-[12px] font-semibold text-white/80 w-fit">
        Ashirah Apparel × AshiraTech
      </div>

      {/* Headline */}
      <h1 className="font-display text-[34px] sm:text-[40px] lg:text-[48px] font-semibold tracking-tight text-white leading-[1.08] mt-4">
        Dari kaos custom
        <br />
        ke deal, dalam satu alur.
      </h1>

      {/* Subheadline */}
      <p className="font-sans text-[13px] sm:text-[14px] lg:text-[15px] text-slate-300 max-w-[420px] mt-3 leading-relaxed">
        Desain di kanvas, nego harga otomatis dengan AshirahBot, langsung checkout —
        semua produksi garmen custom Ashirah dalam satu ekosistem digital.
      </p>
    </motion.div>
  )
})
