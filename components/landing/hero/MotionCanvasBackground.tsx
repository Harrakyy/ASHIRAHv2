"use client"

import React from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { type HeroPhase } from "./useHeroTimeline"
import { PhaseCraft } from "./PhaseCraft"

// Dynamic import for phase components as specified in guardrails
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

interface MotionCanvasBackgroundProps {
  currentPhase: HeroPhase
  isReducedMotion?: boolean
}

export function MotionCanvasBackground({
  currentPhase,
  isReducedMotion = false,
}: MotionCanvasBackgroundProps) {
  const shouldReduceMotion = useReducedMotion() || isReducedMotion

  // prefers-reduced-motion: matikan semua transform, tampilkan static frame PhaseClosure sebagai fallback
  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none h-full w-full">
        <PhaseClosure />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none h-full w-full">
      <AnimatePresence mode="wait">
        {currentPhase === 1 && (
          <motion.div
            key="phase-1"
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PhaseCraft />
          </motion.div>
        )}

        {currentPhase === 2 && (
          <motion.div
            key="phase-2"
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PhaseCanvas />
          </motion.div>
        )}

        {currentPhase === 3 && (
          <motion.div
            key="phase-3"
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PhaseIntelligence />
          </motion.div>
        )}

        {currentPhase === 4 && (
          <motion.div
            key="phase-4"
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <PhaseClosure />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
