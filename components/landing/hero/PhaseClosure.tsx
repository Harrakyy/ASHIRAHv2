"use client"

import React, { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export function PhaseClosure() {
  const shouldReduceMotion = useReducedMotion()
  const [orderId, setOrderId] = useState("SIM-1788346252111")

  useEffect(() => {
    setOrderId(`SIM-${Date.now()}`)
  }, [])

  const confettiPoints = [
    { x: -55, y: -25, delay: 0 },
    { x: 55, y: -30, delay: 0.1 },
    { x: -35, y: 20, delay: 0.2 },
    { x: 45, y: 15, delay: 0.3 },
    { x: -65, y: -5, delay: 0.4 },
    { x: 65, y: -15, delay: 0.5 },
  ]

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Container kartu: Receipt di belakang + Modal di depan */}
      <div className="relative flex flex-col items-center justify-center">
        {/* 1. Receipt card di BELAKANG modal */}
        <div className="absolute rotate-[-4deg] scale-95 opacity-60 z-0 bg-white rounded-xl p-3 w-[210px] text-[9px] space-y-1 -translate-y-8 shadow-md border border-slate-100">
          <div className="text-slate-700 font-medium">Premium Cotton T-Shirt × 50</div>
          <div className="text-[#16A34A] font-semibold">Diskon 7% diterapkan</div>
          <div className="border-t border-dashed border-slate-300 pt-1 flex justify-between items-center text-slate-800">
            <span className="text-slate-500">Total</span>
            <span className="font-bold text-[#0F1B3D]">Rp4.882.500</span>
          </div>
        </div>

        {/* 2. Modal utama DI DEPAN dengan efek stamp */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { scale: 1, opacity: 1, rotate: 0 }
              : { scale: 2, opacity: 0, rotate: -15 }
          }
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 200, damping: 15 }
          }
          className="bg-white rounded-2xl px-6 py-4 flex flex-col items-center gap-1 shadow-2xl z-10 w-[240px] text-center border border-slate-100"
        >
          {/* Check icon dalam circle bg-green-100 */}
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-0.5">
            <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
          </div>

          <h3 className="text-[14px] font-bold text-[#0F1B3D]">
            Terima kasih!
          </h3>

          <p className="text-[11px] text-slate-500">
            Pesanan Anda sedang diproses.
          </p>

          {/* Order ID box */}
          <div className="bg-slate-50 rounded-lg px-3 py-1.5 mt-1 w-full text-center">
            <span className="text-[9px] text-slate-400 block leading-tight">Order ID</span>
            <span className="text-[11px] font-bold font-mono text-[#0F1B3D] tracking-wider block mt-0.5">
              {orderId}
            </span>
          </div>
        </motion.div>

        {/* 3. Partikel confetti minimal (4-6 dot hijau beterbangan ke atas) */}
        {!shouldReduceMotion &&
          confettiPoints.map((p, idx) => (
            <motion.div
              key={idx}
              className="w-1.5 h-1.5 rounded-full bg-[#16A34A]/50 absolute pointer-events-none z-20"
              style={{ left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px)` }}
              initial={{ opacity: 1, y: 0 }}
              animate={{ y: -45, opacity: [1, 0] }}
              transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
            />
          ))}
      </div>

      {/* Brand lockup di bawah modal */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-col items-center gap-1 mt-4 z-10"
      >
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/brand/logo-ashirah.png"
            alt="Ashirah"
            className="h-5 brightness-0 invert object-contain"
          />
          <span className="text-white/30 text-xs">×</span>
          <img
            src="/assets/brand/logo-ashiratech.png"
            alt="AshiraTech"
            className="h-5 brightness-0 invert object-contain"
          />
        </div>
        <span className="text-[11px] text-white/50 tracking-wide">
          Bersama dalam Ashira Group
        </span>
        <span className="text-[10px] text-white/30">
          Produksi presisi, negosiasi cerdas.
        </span>
      </motion.div>
    </div>
  )
}
