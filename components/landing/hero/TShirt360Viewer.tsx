"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Rotate3d, Sparkles, Layers, ShieldCheck } from "lucide-react"

interface TShirt360ViewerProps {
  className?: string
  autoSpinSpeed?: number // degrees per second
}

interface FrameConfig {
  src: string
  alt: string
  label: string
  sublabel: string
  centerDeg: number
}

const FRAMES: FrameConfig[] = [
  {
    src: "/assets/hero/tshirt-front.webp",
    alt: "Kaos Ashira Apparel — Tampak Depan",
    label: "Tampak Depan",
    sublabel: "Front View",
    centerDeg: 0,
  },
  {
    src: "/assets/hero/tshirt-side-right.webp",
    alt: "Kaos Ashira Apparel — Tampak Samping Kanan",
    label: "Samping Kanan",
    sublabel: "Right Profile",
    centerDeg: 90,
  },
  {
    src: "/assets/hero/tshirt-back.webp",
    alt: "Kaos Ashira Apparel — Tampak Belakang",
    label: "Tampak Belakang",
    sublabel: "Back View",
    centerDeg: 180,
  },
  {
    src: "/assets/hero/tshirt-side-left.webp",
    alt: "Kaos Ashira Apparel — Tampak Samping Kiri",
    label: "Samping Kiri",
    sublabel: "Left Profile",
    centerDeg: 270,
  },
]

export function TShirt360Viewer({
  className = "",
  autoSpinSpeed = 30, // 30 deg/sec = 1 full spin in 12s
}: TShirt360ViewerProps) {
  const shouldReduceMotion = useReducedMotion()
  const [angle, setAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const lastPointerX = useRef(0)
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  // Preload all 4 images on mount
  useEffect(() => {
    FRAMES.forEach((frame) => {
      const img = new Image()
      img.src = frame.src
    })
  }, [])

  // Auto-spin loop
  useEffect(() => {
    if (shouldReduceMotion) return

    const tick = (time: number) => {
      if (lastTimeRef.current !== null && !isDragging && !isInteracting) {
        const deltaSec = (time - lastTimeRef.current) / 1000
        setAngle((prev) => (prev + autoSpinSpeed * deltaSec) % 360)
      }
      lastTimeRef.current = time
      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isDragging, isInteracting, autoSpinSpeed, shouldReduceMotion])

  // Determine current active frame and relative angle for 3D tilt
  const { currentFrame, relAngle } = useMemo(() => {
    const normalized = ((angle % 360) + 360) % 360

    let activeIdx = 0
    let minDiff = 180

    FRAMES.forEach((frame, idx) => {
      let diff = normalized - frame.centerDeg
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360

      if (Math.abs(diff) < Math.abs(minDiff)) {
        minDiff = diff
        activeIdx = idx
      }
    })

    return {
      currentFrame: FRAMES[activeIdx],
      relAngle: minDiff, // -45 to +45 deg relative to current frame center
    }
  }, [angle])

  // Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setIsInteracting(true)
    lastPointerX.current = e.clientX
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return
      const deltaX = e.clientX - lastPointerX.current
      lastPointerX.current = e.clientX

      // Drag to rotate: 1 px move = 0.5 degrees
      setAngle((prev) => (prev + deltaX * 0.5 + 360) % 360)
    },
    [isDragging]
  )

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }

    // Resume auto-spin after 2.5 seconds idle
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 2500)
  }, [])

  // Dynamic light offset based on angle
  const rad = (angle * Math.PI) / 180
  const lightX = 50 + Math.sin(rad) * 16 // 34% to 66%

  // 3D perspective rotation style
  const tiltY = shouldReduceMotion ? 0 : relAngle * 0.4 // subtle 3D tilt

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Ambient Radial Backlight behind shirt */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(ellipse at ${lightX}% 46%, rgba(255, 255, 255, 0.18) 0%, rgba(99, 102, 241, 0.12) 30%, transparent 70%)`,
        }}
      />

      {/* Main Center Stage with Shirt & Floating Info Badges */}
      <div className="relative flex items-center justify-center">
        {/* 360 Interactive Container */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative z-10 flex items-center justify-center p-2 cursor-grab active:cursor-grabbing group transition-transform ${
            isDragging ? "cursor-grabbing" : ""
          }`}
          title="Klik dan geser horizontal untuk memutar 360°"
        >
          {/* Soft Ground Shadow */}
          <div
            className="absolute bottom-4 w-[200px] sm:w-[240px] md:w-[280px] h-[20px] rounded-full blur-xl pointer-events-none transition-transform duration-200"
            style={{
              background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 75%)",
              transform: `scale(${1 + Math.abs(relAngle) * 0.002})`,
            }}
          />

          {/* T-Shirt Display with 3D Perspective */}
          <div
            className="relative transition-transform duration-75 ease-out"
            style={{
              perspective: 1000,
              transformStyle: "preserve-3d",
            }}
          >
            <motion.img
              key={currentFrame.src}
              src={currentFrame.src}
              alt={currentFrame.alt}
              draggable={false}
              initial={{ opacity: 0.95 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="h-[310px] sm:h-[350px] md:h-[400px] lg:h-[430px] w-auto max-w-[420px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] pointer-events-none"
              style={{
                transform: `perspective(900px) rotateY(${tiltY}deg)`,
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>

        {/* Floating Spec Badges on Right Side (Desktop md+) */}
        <div className="hidden md:flex flex-col gap-3 absolute -right-20 lg:-right-36 xl:-right-48 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          {/* Badge 1: Material */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
            transition={{
              opacity: { delay: 0.4, duration: 0.5 },
              x: { delay: 0.4, duration: 0.5 },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            }}
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-2xl bg-[#0A1128]/80 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.35)] w-52 lg:w-56"
          >
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold tracking-wider text-sky-400">Material Standard</span>
              <span className="text-xs font-semibold text-white leading-tight mt-0.5">Cotton Combed 24s/30s</span>
              <span className="text-[10px] text-slate-300 mt-0.5">GSM 220 · Sejuk & Anti-Shrink</span>
            </div>
          </motion.div>

          {/* Badge 2: DTF & Sablon */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
            transition={{
              opacity: { delay: 0.6, duration: 0.5 },
              x: { delay: 0.6, duration: 0.5 },
              y: { repeat: Infinity, duration: 4.5, delay: 0.8, ease: "easeInOut" },
            }}
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-2xl bg-[#0A1128]/80 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.35)] w-52 lg:w-56"
          >
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-400">Teknik Cetak</span>
              <span className="text-xs font-semibold text-white leading-tight mt-0.5">Area DTF & Plastisol HD</span>
              <span className="text-[10px] text-slate-300 mt-0.5">Presisi Bebas · Tajam CMYK</span>
            </div>
          </motion.div>

          {/* Badge 3: MOQ & QC */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
            transition={{
              opacity: { delay: 0.8, duration: 0.5 },
              x: { delay: 0.8, duration: 0.5 },
              y: { repeat: Infinity, duration: 4.2, delay: 1.5, ease: "easeInOut" },
            }}
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-2xl bg-[#0A1128]/80 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.35)] w-52 lg:w-56"
          >
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400">Fleksibilitas</span>
              <span className="text-xs font-semibold text-white leading-tight mt-0.5">Min. Order Mulai 12 Pcs</span>
              <span className="text-[10px] text-slate-300 mt-0.5">Garansi QC 100% Retur</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic View & 360 Controller Bar */}
      <div className="relative z-20 flex flex-col items-center gap-2 mt-2 pointer-events-auto">
        {/* Active Angle Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[11px]"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-semibold text-white tracking-wide">{currentFrame.label}</span>
          <span className="text-white/40">·</span>
          <span className="text-slate-300">{currentFrame.sublabel}</span>
        </motion.div>

        {/* Main 360 & Angle Preset Bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#0A1128]/85 backdrop-blur-xl border border-white/20 shadow-2xl text-white text-xs"
        >
          {/* Drag Hint / Auto Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 text-white/80 hover:text-white transition-colors cursor-pointer"
            onClick={() => setAngle((prev) => (prev + 90) % 360)}
            title="Klik untuk putar 90° atau geser kaos langsung"
          >
            <Rotate3d className={`w-3.5 h-3.5 text-sky-400 ${isDragging ? "animate-spin" : ""}`} />
            <span className="text-[11px] font-semibold hidden sm:inline">360° Interaktif</span>
          </div>

          <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

          {/* Angle Preset Switchers */}
          <div className="flex items-center gap-1">
            {FRAMES.map((f) => {
              const isActive = currentFrame.centerDeg === f.centerDeg
              return (
                <button
                  key={f.centerDeg}
                  type="button"
                  onClick={() => {
                    setAngle(f.centerDeg)
                    setIsInteracting(true)
                    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
                    resumeTimerRef.current = setTimeout(() => setIsInteracting(false), 2500)
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    isActive
                      ? "bg-sky-500/25 text-sky-300 border border-sky-400/40 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {f.label.replace("Tampak ", "")}
                </button>
              )
            })}
          </div>

          <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

          {/* Live Degree counter */}
          <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-400/20 px-2 py-0.5 rounded-full">
            {Math.round(((angle % 360) + 360) % 360)}°
          </span>
        </motion.div>
      </div>
    </div>
  )
}

