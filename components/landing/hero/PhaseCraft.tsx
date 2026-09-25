"use client"

import React from "react"
import { motion, useReducedMotion } from "framer-motion"

export function PhaseCraft() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Kaos di tengah */}
      <motion.img
        src="/assets/brand/tshirt-front.png"
        alt="Premium Cotton T-Shirt"
        initial={shouldReduceMotion ? { scale: 1 } : { scale: 1 }}
        animate={shouldReduceMotion ? { scale: 1 } : { scale: 1.12 }}
        transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] as const }}
        className="w-[200px] md:w-[220px] object-contain drop-shadow-2xl pointer-events-none"
      />

      {/* Tag spec MELAYANG di bawah kaos */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="rounded-full bg-white/10 border border-white/10 px-3 py-1 flex items-center gap-2 mt-3 backdrop-blur-md shadow-lg"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
        <span className="text-[11px] text-white/70 font-medium tracking-wide">
          100% Cotton · Rp85.000/pcs
        </span>
      </motion.div>
    </div>
  )
}
