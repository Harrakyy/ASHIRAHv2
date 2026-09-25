"use client"

import React, { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"

const formatRupiah = (val: number) =>
  `Rp${new Intl.NumberFormat("id-ID").format(val)}`

function TypingIndicator({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`flex items-center gap-1 bg-white/10 rounded-2xl px-3 py-2 w-fit ${
        align === "right" ? "ml-auto rounded-tr-sm" : "rounded-tl-sm"
      }`}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          className="w-1.5 h-1.5 rounded-full bg-white/60"
        />
      ))}
    </motion.div>
  )
}

export function PhaseIntelligence() {
  const shouldReduceMotion = useReducedMotion()
  const [step, setStep] = useState<number>(shouldReduceMotion ? 4 : 0)

  useEffect(() => {
    if (shouldReduceMotion) return

    // Sequence timing relative to phase mount (total 4000ms duration)
    const t1 = setTimeout(() => setStep(1), 600)  // user typing
    const t2 = setTimeout(() => setStep(2), 1100) // user bubble visible
    const t3 = setTimeout(() => setStep(3), 1800) // bot typing
    const t4 = setTimeout(() => setStep(4), 2400) // deal bubble visible
    const t5 = setTimeout(() => setStep(5), 3000) // deal ribbon visible

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [shouldReduceMotion])

  return (
    <div className="relative w-full h-full flex flex-col justify-center px-4 sm:px-8 py-3 select-none overflow-hidden">
      {/* Header chat */}
      <div className="flex items-center gap-2 mb-2 max-w-[300px] mx-auto w-full">
        {/* Avatar bulat 28px inisial "A" */}
        <div className="w-7 h-7 rounded-full bg-[#16A34A] flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-sm">
          A
        </div>

        <span className="text-[12px] font-semibold text-white tracking-tight">
          AshirahBot
        </span>

        {/* Dot online hijau */}
        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />

        {/* Badge Deal 7% */}
        <span className="rounded-full bg-[#16A34A]/20 text-[#16A34A] text-[9px] font-bold px-2 py-0.5 ml-auto border border-[#16A34A]/30">
          Deal 7%
        </span>
      </div>

      {/* Chat area */}
      <div className="max-w-[300px] mx-auto w-full space-y-2">
        {/* Bubble 1 (bot) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 text-white rounded-2xl rounded-tl-sm px-3 py-2 text-[11px] leading-relaxed max-w-[260px] backdrop-blur-sm border border-white/10 self-start"
        >
          Untuk 50 pcs, harganya {formatRupiah(105000)} per pcs, jadi totalnya {formatRupiah(5250000)} 😊
        </motion.div>

        {/* Typing indicator user / Bubble 2 */}
        {step === 1 && <TypingIndicator align="right" />}

        {step >= 2 && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/20 text-white ml-auto rounded-2xl rounded-tr-sm px-3 py-2 text-[11px] leading-relaxed max-w-[240px] backdrop-blur-sm border border-white/15"
          >
            Kasih diskon lah kak, pesanannya banyak ini
          </motion.div>
        )}

        {/* Typing indicator bot / Bubble 3 deal */}
        {step === 3 && <TypingIndicator align="left" />}

        {step >= 4 && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: [1, 1.03, 1] }}
            transition={{
              opacity: { duration: 0.3 },
              y: { duration: 0.3 },
              scale: { duration: 0.5, repeat: 2 },
            }}
            className="bg-[#16A34A] text-white rounded-2xl rounded-tl-sm px-3 py-2.5 text-[11px] font-medium leading-relaxed shadow-[0_0_24px_rgba(22,163,74,0.45)] self-start max-w-[270px]"
          >
            Diskon 7% — harga per pcs jadi {formatRupiah(97650)}, total {formatRupiah(4882500)} untuk 50 pcs ✓
          </motion.div>
        )}

        {/* Ribbon hasil deal */}
        {step >= 5 && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className="bg-white rounded-xl p-2.5 mt-2 flex justify-between items-center shadow-xl border border-slate-100"
          >
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-medium">Total Akhir</span>
              <span className="text-[14px] font-bold text-[#16A34A] leading-tight">
                {formatRupiah(4882500)}
              </span>
            </div>

            <span className="text-[9px] bg-slate-100 rounded-full px-2 py-0.5 text-slate-600 font-semibold">
              50 pcs
            </span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
