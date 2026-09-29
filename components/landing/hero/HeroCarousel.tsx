"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { heroSlides, HERO_AUTOPLAY_MS } from "@/data/hero-slides"
import { HeroSlideItem } from "./HeroSlideItem"
import { HeroIndicators } from "./HeroIndicators"
import { HeroStage } from "./HeroStage"

/**
 * Hero carousel 3 slide: ASHIRA Group → ASHIRA Apparel → ASHIRATECH.
 * - Autoplay ±6,5 detik, pause saat hover / fokus keyboard (bukan klik mouse) / tab tidak aktif.
 * - Autoplay mati bila pengguna memilih "reduce motion".
 * - Navigasi manual: 3 bar indikator, tombol ← →, tombol panah keyboard, dan swipe di layar sentuh.
 */
/** true bila pengguna mengaktifkan "reduce motion" di sistem operasinya. */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduce(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return reduce
}

export function HeroCarousel() {
  const reduceMotion = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [checkedOut, setCheckedOut] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)

  const count = heroSlides.length
  const slide = heroSlides[index]
  const autoplay = !reduceMotion
  const paused = hovered || focused || tabHidden

  const goTo = useCallback((i: number) => {
    setIndex(((i % count) + count) % count)
    setCheckedOut(false)
  }, [count])
  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  /*
    Mobile (< 768px): teks & visual bertumpuk. Kolom teks dikunci setinggi slide tertinggi agar
    konten di bawah hero tidak melompat — tapi itu menyisakan celah kosong di antara teks & visual.
    Di mobile, sisa ruang itu dipindah ke bawah visual (spacer) sehingga visual menempel ke teks
    dan tinggi hero tetap konstan (dipasang sebagai margin bawah visual).
    `mobileSpacer === null` = mode default (desktop / sebelum diukur).
  */
  const sizerBoxRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)
  const [mobileSpacer, setMobileSpacer] = useState<number | null>(null)
  useEffect(() => {
    const box = sizerBoxRef.current
    const active = activeRef.current
    if (!box || !active) return
    const mq = window.matchMedia("(max-width: 767px)")
    const sizers = Array.from(box.querySelectorAll<HTMLElement>("[data-hero-sizer]"))
    const measure = () => {
      if (!mq.matches) return setMobileSpacer(null)
      const tallest = Math.max(...sizers.map((el) => el.offsetHeight))
      setMobileSpacer(Math.max(0, tallest - active.offsetHeight))
    }
    const ro = new ResizeObserver(measure) // dipanggil otomatis sekali saat mulai observe
    ro.observe(active)
    sizers.forEach((el) => ro.observe(el))
    mq.addEventListener("change", measure)
    return () => {
      ro.disconnect()
      mq.removeEventListener("change", measure)
    }
  }, [])

  // Swipe horizontal di layar sentuh: geser ≥ 50px dan lebih horizontal daripada vertikal.
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    if (dx < 0) next()
    else prev()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") next()
    if (e.key === "ArrowLeft") prev()
  }

  const fade = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
      }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Sorotan ASHIRA Group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Pause hanya untuk fokus keyboard (Figma) — klik mouse pada tombol/indikator tidak menghentikan autoplay
      onFocusCapture={(e) => setFocused((e.target as HTMLElement).matches(":focus-visible"))}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false)
      }}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="ashira-page-gradient px-3 pb-8 pt-[92px] sm:px-6 lg:px-8 lg:pt-[112px]"
    >
      <div className="ashira-dark-gradient relative mx-auto max-w-[1376px] overflow-hidden rounded-[32px] shadow-[0_20px_48px_rgba(10,18,51,0.25)] lg:rounded-[44px]">
        <div className="grid gap-8 p-6 sm:gap-10 sm:p-10 md:grid-cols-2 md:gap-8 md:p-8 lg:gap-10 lg:p-10 xl:grid-cols-[minmax(0,660px)_minmax(0,1fr)] xl:gap-12 xl:px-14 xl:py-12">
          {/* Kolom kiri */}
          <div className="flex flex-col justify-between gap-10">
            {/*
              Semua slide dirender tak terlihat di sel grid yang sama sehingga tinggi
              kolom = slide tertinggi → konten di bawah hero tidak "melompat" saat ganti slide.
            */}
            <div
              ref={sizerBoxRef}
              className="relative grid"
              aria-roledescription="slide"
              aria-label={`${index + 1} dari ${count}: ${slide.name}`}
            >
              {heroSlides.map((s) => (
                <div
                  key={s.id}
                  data-hero-sizer
                  aria-hidden
                  className={`invisible col-start-1 row-start-1 ${mobileSpacer !== null ? "absolute inset-x-0 top-0" : ""}`}
                >
                  <HeroSlideItem slide={s} sizer />
                </div>
              ))}
              <div ref={activeRef} className="col-start-1 row-start-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={slide.id} {...fade} transition={{ duration: 0.5, ease: "easeOut" }}>
                    <HeroSlideItem slide={slide} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="hidden md:block">
              <HeroIndicators
                count={count}
                activeIndex={index}
                label={`${String(index + 1).padStart(2, "0")} / ${slide.name}`}
                durationMs={HERO_AUTOPLAY_MS}
                paused={paused}
                autoplay={autoplay}
                cycleKey={`${slide.id}-${checkedOut}`}
                onSelect={goTo}
                onPrev={prev}
                onNext={next}
                onComplete={next}
              />
            </div>
          </div>

          {/* Kolom kanan: visual */}
          <div
            className="relative h-[440px] max-md:mb-(--hero-spacer) sm:h-[500px] md:h-[540px] md:self-center lg:h-[580px]"
            style={{ "--hero-spacer": `${mobileSpacer ?? 0}px` } as React.CSSProperties}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <HeroStage
                  kind={slide.stage}
                  checkedOut={checkedOut}
                  onCheckout={() => setCheckedOut(true)}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indikator di mobile (< 768px): di bawah visual */}
          <div className="md:hidden">
            <HeroIndicators
              count={count}
              activeIndex={index}
              label={`${String(index + 1).padStart(2, "0")} / ${slide.name}`}
              durationMs={HERO_AUTOPLAY_MS}
              paused={paused}
              autoplay={autoplay}
              cycleKey={`${slide.id}-${checkedOut}-m`}
              onSelect={goTo}
              onPrev={prev}
              onNext={next}
              onComplete={next}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
