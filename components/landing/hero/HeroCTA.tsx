"use client"

import React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { PhaseIndicator } from "./PhaseIndicator"
import { type HeroPhase } from "./useHeroTimeline"

interface HeroCTAProps {
  currentPhase: HeroPhase
  phaseDuration: number
  onJumpToPhase: (phase: HeroPhase) => void
  isReducedMotion?: boolean
}

export function HeroCTA({
  currentPhase,
  phaseDuration,
  onJumpToPhase,
  isReducedMotion = false,
}: HeroCTAProps) {
  const shouldReduceMotion = useReducedMotion() || isReducedMotion

  return (
    <div className="flex items-center justify-between w-full flex-wrap gap-4">
      {/* Left: PhaseIndicator */}
      <PhaseIndicator
        currentPhase={currentPhase}
        phaseDuration={phaseDuration}
        onJumpToPhase={onJumpToPhase}
        isReducedMotion={shouldReduceMotion}
      />

      {/* Right: motion.button CTA */}
      <Link href="/order">
        <motion.button
          type="button"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          className="flex items-center gap-2 bg-white text-[#0F1B3D] px-6 py-3 rounded-full text-[13px] font-semibold shadow-[0_8px_24px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)] transition-shadow cursor-pointer"
        >
          <span>Custom Now</span>
          <ChevronRight className="w-4 h-4 text-[#0F1B3D]" />
        </motion.button>
      </Link>
    </div>
  )
}
