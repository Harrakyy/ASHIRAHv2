"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"

interface HeroIndicatorsProps {
  count: number
  activeIndex: number
  /** Label slide aktif, mis. "01 / ASHIRA Group". */
  label: string
  durationMs: number
  paused: boolean
  autoplay: boolean
  /** Berubah setiap kali progress harus mulai ulang (ganti slide / checkout). */
  cycleKey: string
  onSelect: (index: number) => void
  onPrev: () => void
  onNext: () => void
  /** Dipanggil saat progress bar slide aktif penuh → pindah slide. */
  onComplete: () => void
}

export function HeroIndicators({
  count,
  activeIndex,
  label,
  durationMs,
  paused,
  autoplay,
  cycleKey,
  onSelect,
  onPrev,
  onNext,
  onComplete,
}: HeroIndicatorsProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="flex flex-col gap-3.5">
        {/* Indikator 3 bar (Figma): bar aktif terisi sesuai progress timer, bisa diklik untuk loncat slide */}
        <div className="flex gap-2.5" role="tablist" aria-label="Pilih slide">
          {Array.from({ length: count }).map((_, i) => {
            const active = i === activeIndex
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Slide ${i + 1} dari ${count}`}
                onClick={() => onSelect(i)}
                className="group relative flex h-6 w-12 items-center sm:w-16"
              >
                <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/40">
                  {active && (
                    <span
                      key={cycleKey}
                      className="absolute inset-y-0 left-0 rounded-full bg-white"
                      style={
                        autoplay
                          ? {
                              animation: `ashira-hero-progress ${durationMs}ms linear forwards`,
                              animationPlayState: paused ? "paused" : "running",
                            }
                          : { width: "100%" }
                      }
                      onAnimationEnd={onComplete}
                    />
                  )}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-sm font-medium text-[#D1D1D1]" aria-live="polite">
          {label}
        </p>
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Slide sebelumnya"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10"
        >
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Slide berikutnya"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10"
        >
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  )
}
