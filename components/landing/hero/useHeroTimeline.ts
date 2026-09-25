"use client"

import { useState, useEffect, useCallback } from "react"

export type HeroPhase = 1 | 2 | 3 | 4

export const PHASE_DURATIONS: Record<HeroPhase, number> = {
  1: 4000,
  2: 3000,
  3: 4000,
  4: 3000,
}

export const PHASE_LABELS: Record<HeroPhase, string> = {
  1: "01 — Produk Premium",
  2: "02 — Kanvas Custom",
  3: "03 — Nego dengan AI",
  4: "04 — Deal Selesai",
}

export const STAGE_LABELS: Record<HeroPhase, string> = {
  1: "01 · PRODUK",
  2: "02 · KUSTOMISASI",
  3: "03 · NEGOSIASI",
  4: "04 · TRANSAKSI",
}

export const TOTAL_HERO_DURATION = 14000

export function useHeroTimeline() {
  const [currentPhase, setCurrentPhase] = useState<HeroPhase>(1)
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false)

  // 1. Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = (matches: boolean) => {
      if (matches) {
        setIsReducedMotion(true)
        setCurrentPhase(4)
      } else {
        setIsReducedMotion(false)
      }
    }

    updateMotionPreference(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => updateMotionPreference(e.matches)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler)
      return () => mediaQuery.removeEventListener("change", handler)
    } else {
      mediaQuery.addListener(handler)
      return () => mediaQuery.removeListener(handler)
    }
  }, [])

  // 2. Timeline state machine - auto advance per phase duration, loop after 14000ms
  useEffect(() => {
    if (isReducedMotion) return

    const duration = PHASE_DURATIONS[currentPhase]
    const timer = setTimeout(() => {
      setCurrentPhase((prev) => (prev === 4 ? 1 : ((prev + 1) as HeroPhase)))
    }, duration)

    return () => clearTimeout(timer)
  }, [currentPhase, isReducedMotion])

  // 3. Jump to a specific phase
  const jumpToPhase = useCallback((phase: HeroPhase) => {
    setCurrentPhase(phase)
  }, [])

  return {
    currentPhase,
    phaseDuration: PHASE_DURATIONS[currentPhase],
    jumpToPhase,
    isReducedMotion,
  }
}
