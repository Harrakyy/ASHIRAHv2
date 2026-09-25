"use client"

import React, { memo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import type { HeroPhase } from "./useHeroTimeline"

interface BrandLockupOverlayProps {
  phase: HeroPhase
  isReducedMotion?: boolean
}

export const BrandLockupOverlay = memo(function BrandLockupOverlay({
  phase,
  isReducedMotion = false,
}: BrandLockupOverlayProps) {
  return (
    <div className="absolute top-20 sm:top-24 inset-x-0 z-20 flex justify-center pointer-events-none px-4">
      <motion.div
        className="flex items-center gap-3.5 px-5 py-2 rounded-full bg-[#1C2143]/85 border border-[#5A5F8E]/35 backdrop-blur-xl shadow-2xl pointer-events-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Ashira'h Apparel Real Logo Mark */}
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-24 sm:w-28">
            <Image
              src="/assets/hero/ashirah-apparel-logo.png"
              alt="Ashira'h Apparel"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Separator */}
        <span className="text-[#B396C8] text-sm font-light select-none">&times;</span>

        {/* AshiraTech Real Logo Mark on Clean White Pill */}
        <div className="flex items-center gap-2 bg-[#FAFAFA] rounded-md px-2 py-0.5 shadow-sm">
          <div className="relative h-5 w-20 sm:w-24">
            <Image
              src="/assets/hero/ashiratech-logo-transparent.png"
              alt="AshiraTech"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-4 w-px bg-[#5A5F8E]/40" />

        {/* Dual Ecosystem Badge */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#B396C8] font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#B396C8]" />
          <span className="hidden sm:inline text-[#F0F0EA]">Dual Ecosystem</span>
        </div>
      </motion.div>
    </div>
  )
})
