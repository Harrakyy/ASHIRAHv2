"use client"

import React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ImageUp, Type, Layers } from "lucide-react"

const formatRupiah = (val: number) =>
  `Rp${new Intl.NumberFormat("id-ID").format(val)}`

export function PhaseCanvas() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      {/* Toolbar mini di kiri */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
        <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white ring-2 ring-[#16A34A] shadow-lg">
          <ImageUp className="w-4 h-4 text-[#16A34A]" />
        </div>
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <Type className="w-4 h-4" />
        </div>
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <Layers className="w-4 h-4" />
        </div>
      </div>

      {/* Kaos di tengah dengan elemen editing progresif */}
      <div className="relative flex items-center justify-center">
        <img
          src="/assets/brand/tshirt-front.png"
          alt="Kaos Custom Editing"
          className="w-[200px] md:w-[220px] object-contain drop-shadow-2xl pointer-events-none"
        />

        {/* Dada Kaos: Area Desain yang Muncul Progresif */}
        <div className="absolute top-[34%] flex flex-col items-center justify-center pointer-events-none">
          {/* Logo Mark AshiraTech (t=4.0s-5.0s) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="w-9 h-9 rounded-lg bg-white shadow-md flex items-center justify-center p-1.5 border border-slate-100"
          >
            <img
              src="/assets/brand/logo-ashiratech.png"
              alt="AshiraTech Mark"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Teks ASHIRAH (t=5.0s-6.0s) */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="text-[#0F1B3D] text-[9px] font-extrabold tracking-widest text-center mt-1 drop-shadow-sm uppercase"
          >
            ASHIRAH
          </motion.p>
        </div>

        {/* Kursor dot hijau bergerak */}
        {!shouldReduceMotion && (
          <motion.div
            className="w-2.5 h-2.5 bg-[#16A34A] rounded-full shadow-[0_0_10px_#16A34A] absolute z-30 pointer-events-none"
            animate={{
              x: [-120, 0, 0],
              y: [0, -35, -12],
            }}
            transition={{
              duration: 2.5,
              times: [0, 0.55, 1],
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Floating Card Ringkasan Pesanan di kanan-bawah */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        className="absolute bottom-4 right-4 z-20 w-[180px] rounded-xl bg-white p-3 text-[10px] space-y-1 shadow-2xl border border-slate-100"
      >
        <div className="flex justify-between items-center text-slate-500">
          <span>Harga per pcs</span>
          <span className="font-medium text-slate-800">{formatRupiah(85000)}</span>
        </div>
        <div className="flex justify-between items-center text-slate-500">
          <span>+ Logo</span>
          <span className="font-medium text-slate-800">{formatRupiah(15000)}</span>
        </div>
        <div className="flex justify-between items-center text-slate-500">
          <span>+ Teks</span>
          <span className="font-medium text-slate-800">{formatRupiah(5000)}</span>
        </div>

        <div className="border-t border-slate-100 my-1" />

        <div className="flex justify-between items-baseline pt-0.5">
          <span className="text-[10px] font-medium text-slate-500">Subtotal</span>
          <span className="font-bold text-[13px] text-[#0F1B3D]">
            {formatRupiah(105000)}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
