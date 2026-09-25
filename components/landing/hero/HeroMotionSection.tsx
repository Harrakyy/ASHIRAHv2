"use client"

import React from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useHeroTimeline, STAGE_LABELS } from "./useHeroTimeline"
import { HeroTextBlock } from "./HeroTextBlock"
import { PhaseIndicator } from "./PhaseIndicator"
import { PhaseCraft } from "./PhaseCraft"

const PhaseCanvas = dynamic(
  () => import("./PhaseCanvas").then((mod) => mod.PhaseCanvas),
  { ssr: false }
)
const PhaseIntelligence = dynamic(
  () => import("./PhaseIntelligence").then((mod) => mod.PhaseIntelligence),
  { ssr: false }
)
const PhaseClosure = dynamic(
  () => import("./PhaseClosure").then((mod) => mod.PhaseClosure),
  { ssr: false }
)

export function HeroMotionSection() {
  const {
    currentPhase,
    phaseDuration,
    jumpToPhase,
    isReducedMotion,
  } = useHeroTimeline()

  return (
    <div className="relative w-full max-w-[1400px] mx-auto rounded-[32px] bg-[#0F1B3D] overflow-hidden min-h-[620px] lg:h-[85vh] lg:max-h-[850px] isolate flex items-center shadow-2xl border border-white/5">
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_45%,rgba(30,58,138,0.25)_0%,transparent_70%)]" />

      {/* FIXED GRID ARCHITECTURE: 42% Kolom Kiri, 58% Kolom Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] h-full w-full items-center px-8 sm:px-10 md:px-14 py-8 lg:py-10 gap-8 relative z-10">
        
        {/* KOLOM KIRI (TextZone) — posisi & isi 100% STATIS di semua fase */}
        <div className="flex flex-col justify-between h-full max-h-[480px] w-full">
          {/* Headline & Subheadline (Mounted once, no re-animation on phase change) */}
          <div className="w-full">
            <HeroTextBlock />
          </div>

          {/* Bottom Row: PhaseIndicator (kiri) + CTA "Custom Now" (kanan) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 mt-8 pt-4 w-full">
            <PhaseIndicator
              currentPhase={currentPhase}
              phaseDuration={phaseDuration}
              onJumpToPhase={jumpToPhase}
              isReducedMotion={isReducedMotion}
            />

            <Link href="/order" className="shrink-0">
              <motion.button
                type="button"
                whileHover={isReducedMotion ? undefined : { scale: 1.03 }}
                whileTap={isReducedMotion ? undefined : { scale: 0.97 }}
                className="flex items-center gap-2 bg-white text-[#0F1B3D] px-6 py-3 rounded-full text-[13px] font-semibold shadow-[0_8px_24px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)] transition-shadow cursor-pointer"
              >
                <span>Custom Now</span>
                <ChevronRight className="w-4 h-4 text-[#0F1B3D]" />
              </motion.button>
            </Link>
          </div>
        </div>

        {/* KOLOM KANAN (StagePanel) — SATU frame tetap ukurannya di semua fase */}
        <div className="w-full flex items-center justify-center">
          <div className="relative w-full h-[420px] md:h-[480px] rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
            
            {/* Label kecil MELAYANG di pojok kiri-atas StagePanel */}
            <span className="absolute top-4 left-4 text-[10px] font-mono text-white/40 uppercase tracking-wider z-30 select-none">
              {STAGE_LABELS[currentPhase]}
            </span>

            {/* StagePanel Content Container */}
            <div className="w-full h-full relative flex items-center justify-center">
              {isReducedMotion ? (
                <PhaseClosure />
              ) : (
                <AnimatePresence mode="wait">
                  {currentPhase === 1 && (
                    <motion.div
                      key="phase-1"
                      className="w-full h-full absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PhaseCraft />
                    </motion.div>
                  )}

                  {currentPhase === 2 && (
                    <motion.div
                      key="phase-2"
                      className="w-full h-full absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PhaseCanvas />
                    </motion.div>
                  )}

                  {currentPhase === 3 && (
                    <motion.div
                      key="phase-3"
                      className="w-full h-full absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PhaseIntelligence />
                    </motion.div>
                  )}

                  {currentPhase === 4 && (
                    <motion.div
                      key="phase-4"
                      className="w-full h-full absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PhaseClosure />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
