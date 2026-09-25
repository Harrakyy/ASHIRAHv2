"use client"

import React from "react"
import { motion } from "framer-motion"
import { type HeroPhase, PHASE_LABELS } from "./useHeroTimeline"

interface PhaseIndicatorProps {
  currentPhase: HeroPhase
  phaseDuration: number
  onJumpToPhase: (phase: HeroPhase) => void
  isReducedMotion?: boolean
}

export function PhaseIndicator({
  currentPhase,
  phaseDuration,
  onJumpToPhase,
  isReducedMotion = false,
}: PhaseIndicatorProps) {
  const phases: HeroPhase[] = [1, 2, 3, 4]

  return (
    <div className="flex flex-col h-[40px] justify-between select-none">
      <div className="flex items-center gap-2">
        {phases.map((phase) => {
          const isActive = currentPhase === phase

          return (
            <button
              key={phase}
              type="button"
              onClick={() => onJumpToPhase(phase)}
              aria-label={`Pindah ke fase ${phase}: ${PHASE_LABELS[phase]}`}
              className="cursor-pointer focus:outline-none"
            >
              {isActive ? (
                <div className="h-[3px] w-10 rounded-full bg-white/30 overflow-hidden relative">
                  {!isReducedMotion ? (
                    <motion.div
                      key={`progress-${phase}-${phaseDuration}`}
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: ["0%", "100%"] }}
                      transition={{
                        duration: phaseDuration / 1000,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-white rounded-full" />
                  )}
                </div>
              ) : (
                <div className="h-[3px] w-10 rounded-full bg-white/20 hover:bg-white/40 transition-colors" />
              )}
            </button>
          )
        })}
      </div>
      <span className="text-[11px] text-white/50 font-medium">
        {PHASE_LABELS[currentPhase]}
      </span>
    </div>
  )
}
