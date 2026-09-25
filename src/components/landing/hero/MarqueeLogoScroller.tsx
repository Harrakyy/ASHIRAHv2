"use client"

import React from "react"

interface PartnerLogo {
  name: string
  short: string
  sub: string
  gradient: string
  svgIcon?: React.ReactNode
}

const PARTNERS: PartnerLogo[] = [
  {
    name: "Universitas Indonesia",
    short: "UI",
    sub: "Mitra Kampus",
    gradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
  },
  {
    name: "IPB University",
    short: "IPB",
    sub: "Mitra Kampus",
    gradient: "linear-gradient(135deg, #064e3b, #10b981)",
  },
  {
    name: "IKABA FIB UI",
    short: "IKABA",
    sub: "Alumni & Ormawa",
    gradient: "linear-gradient(135deg, #4338ca, #8b5cf6)",
  },
  {
    name: "Syabaab Ussunnah",
    short: "SS",
    sub: "Komunitas",
    gradient: "linear-gradient(135deg, #78350f, #f59e0b)",
  },
  {
    name: "Corporate Partners",
    short: "CORP",
    sub: "Enterprise B2B",
    gradient: "linear-gradient(135deg, #0f172a, #0284c7)",
  },
  {
    name: "Figma",
    short: "FIGMA",
    sub: "Design System",
    gradient: "linear-gradient(135deg, #7c3aed, #ec4899)",
  },
  {
    name: "Google Cloud",
    short: "GCLOUD",
    sub: "Cloud Infrastructure",
    gradient: "linear-gradient(135deg, #0284c7, #38bdf8)",
  },
  {
    name: "Shopify",
    short: "SHOPIFY",
    sub: "Commerce Stack",
    gradient: "linear-gradient(135deg, #15803d, #84cc16)",
  },
]

export function MarqueeLogoScroller() {
  return (
    <section
      className="relative w-full max-w-[1400px] mx-auto mt-10 mb-16 overflow-hidden select-none"
      aria-label="Mitra dan Ekosistem Ashira Group"
    >
      <style>{`
        @keyframes marquee-infinite {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-scroller {
          display: flex;
          width: max-content;
          animation: marquee-infinite 32s linear infinite;
        }
        .animate-marquee-scroller:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Left/Right Masking Gradient fading to transparent on edges */}
      <div
        className="w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        {/* Double list inline to ensure seamless continuous loop */}
        <div className="animate-marquee-scroller flex items-center gap-6 py-4">
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div
              key={`${partner.short}-${idx}`}
              className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden cursor-pointer"
            >
              {/* Inner Gradient Expanding Div on Group Hover */}
              <div
                className="absolute inset-0 scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 rounded-full"
                style={{ background: partner.gradient }}
              />

              {/* Logo / Text Content that inverts to crisp white on hover */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-3 transition-all duration-300 group-hover:brightness-0 group-hover:invert">
                <span className="text-xl font-bold font-display tracking-tight text-[#0a1b33]">
                  {partner.short}
                </span>
                <span className="text-[10px] font-medium font-sans text-slate-500 tracking-tight line-clamp-1">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
