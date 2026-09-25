"use client"

import React from "react"
import { HeroMotionSection } from "./HeroMotionSection"
import { MarqueeLogoScroller } from "./MarqueeLogoScroller"

export function HeroContainer() {
  return (
    <section className="relative w-full pt-28 md:pt-32 pb-4 px-4 sm:px-6 lg:px-8 bg-white">
      <HeroMotionSection />
      <MarqueeLogoScroller />
    </section>
  )
}
