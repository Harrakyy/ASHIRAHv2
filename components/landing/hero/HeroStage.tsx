"use client"

import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRight, Check } from "lucide-react"
import { negotiationDemo, type HeroStageKind } from "@/data/hero-slides"

const rupiah = (value: number) => `Rp${new Intl.NumberFormat("id-ID").format(value)}`

/* ------------------------------------------------------------------ */
/* Slide 01 — mockup laptop + iPhone (diekspor langsung dari Figma)    */
/* ------------------------------------------------------------------ */
function StageEcosystem() {
  return (
    <div className="relative flex h-full w-full items-start justify-center md:items-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(123,116,255,0.35)_0%,rgba(43,41,150,0)_70%)]"
      />
      <Image
        src="/images/hero/ashira-ecosystem-mockup.webp"
        alt="Aplikasi kustomisasi ASHIRATECH di laptop dan konfirmasi pesanan di iPhone"
        width={762}
        height={679}
        priority
        sizes="(min-width: 1024px) 648px, 90vw"
        className="relative h-auto w-full max-w-[680px] translate-x-[2%] object-contain"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Slide 02 — mockup produk + pilihan bahan/warna + kartu harga        */
/* ------------------------------------------------------------------ */


function StageApparel() {
  return (
    <div className="ashira-stage relative h-full w-full overflow-hidden rounded-[28px] lg:rounded-[36px]">


      {/* Mockup kaos */}
      <div className="absolute inset-x-14 bottom-[128px] top-14 flex items-center justify-center sm:bottom-24 sm:top-16 lg:bottom-20 lg:left-20 lg:right-10 xl:inset-x-16">
        <div className="relative aspect-[7/10] h-full max-h-[420px]">
          <Image
            src="/images/hero/tshirt-front.webp"
            alt="Kaos custom premium ASHIRA Apparel"
            fill
            sizes="(min-width: 1024px) 300px, 60vw"
            className="object-contain drop-shadow-[0_18px_24px_rgba(10,18,51,0.18)]"
          />
          {/* Cetakan logo di dada kaos (Figma: kaos dengan logo ASHIRATECH) */}
          <Image
            src="/images/hero/ashiratech-wordmark.png"
            alt=""
            width={351}
            height={102}
            className="absolute left-1/2 top-[27%] h-auto w-[34%] -translate-x-1/2"
          />
        </div>
      </div>


    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Slide 03 — nego AshirahBot → checkout → pesanan diproses            */
/* ------------------------------------------------------------------ */
function ChatBubble({
  children,
  side,
  tone = "white",
  delay,
  animate,
}: {
  children: React.ReactNode
  side: "left" | "right"
  tone?: "white" | "green"
  delay: number
  animate: boolean
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12px] leading-snug sm:px-4 sm:py-3 text-ashira-navy shadow-[0_6px_16px_rgba(10,18,51,0.1)] sm:text-[15px] ${
        side === "right" ? "self-end rounded-tr-md" : "self-start rounded-tl-md"
      } ${tone === "green" ? "bg-[#92E58E]" : "bg-white"}`}
    >
      {children}
    </motion.div>
  )
}

function StageTech({ checkedOut, onCheckout }: { checkedOut: boolean; onCheckout: () => void }) {
  const reduceMotion = useReducedMotion()
  const animate = !reduceMotion
  const { quantity, basePrice, discountPercent, orderId } = negotiationDemo
  const unitAfter = Math.round((basePrice * (100 - discountPercent)) / 100)
  const total = unitAfter * quantity

  return (
    <div className="ashira-stage relative h-full w-full overflow-hidden rounded-[28px] lg:rounded-[36px]">
      <AnimatePresence mode="wait" initial={false}>
        {!checkedOut ? (
          <motion.div
            key="chat"
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 md:p-5 lg:p-8"
          >
            <div className="flex w-full max-w-[440px] flex-col gap-2 sm:gap-3">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ashira-deep text-sm font-bold text-white sm:h-9 sm:w-9 sm:text-base">
                    A
                  </span>
                  <span className="text-lg font-bold text-ashira-deep sm:text-2xl md:text-xl lg:text-2xl">AshirahBot</span>
                </div>
                <span className="shrink-0 rounded-full bg-ashira-deep/90 px-3 py-1 text-[12px] font-medium text-white sm:px-4 sm:py-1.5 sm:text-[13px]">
                  Deal {discountPercent}%
                </span>
              </div>

              <ChatBubble side="left" delay={0.1} animate={animate}>
                Untuk {quantity} pcs, harganya {rupiah(basePrice)} per pcs, jadi totalnya {rupiah(basePrice * quantity)}
              </ChatBubble>
              <ChatBubble side="right" delay={0.45} animate={animate}>
                Kasih diskon lah kak, pesanannya banyak ini
              </ChatBubble>
              <ChatBubble side="left" tone="green" delay={0.8} animate={animate}>
                Diskon {discountPercent}% — harga per pcs jadi {rupiah(unitAfter)}, total {rupiah(total)} untuk {quantity} pcs
              </ChatBubble>

              <motion.div
                initial={animate ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 1.15 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-end justify-between gap-3 rounded-2xl ashira-bluewhite-gradient px-4 py-3 text-white sm:px-5 sm:py-4 shadow-[0_10px_24px_rgba(10,18,51,0.25)]">
                  <div>
                    <p className="text-[12px] text-white/75 sm:text-[13px]">Total Akhir</p>
                    <p className="text-lg font-bold sm:text-2xl">{rupiah(total)}</p>
                  </div>
                  <span className="shrink-0 text-sm text-white/85">{quantity} pcs</span>
                </div>
                <button
                  type="button"
                  onClick={onCheckout}
                  className="flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#213167_0%,#2B2996_100%)] py-2.5 text-sm font-semibold sm:py-3 sm:text-[15px] text-white shadow-[0_6px_16px_rgba(10,18,51,0.25)] transition-transform hover:scale-[1.01]"
                >
                  Checkout sekarang <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={animate ? { opacity: 0, scale: 0.94 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute inset-0 flex items-center justify-center p-6"
            role="status"
          >
            <div className="flex w-full max-w-[340px] flex-col items-center gap-2 rounded-3xl border border-white bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F3F3_100%)] px-6 pb-6 pt-7 text-center shadow-[0_18px_40px_rgba(10,18,51,0.22)]">
              <span className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9F5DC]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E] text-white">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </span>
              </span>
              <p className="text-xl font-bold text-ashira-deep">Terima Kasih!</p>
              <p className="text-[15px] text-ashira-muted">Pesanan Anda sedang diproses</p>
              <div className="mt-3 w-full rounded-2xl bg-[#ECEDF3] px-4 py-3">
                <p className="text-[13px] text-ashira-muted">Order ID</p>
                <p className="text-[15px] font-bold tracking-wide text-ashira-deep">{orderId}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function HeroStage({
  kind,
  checkedOut,
  onCheckout,
}: {
  kind: HeroStageKind
  checkedOut: boolean
  onCheckout: () => void
}) {
  if (kind === "ecosystem") return <StageEcosystem />
  if (kind === "apparel") return <StageApparel />
  return <StageTech checkedOut={checkedOut} onCheckout={onCheckout} />
}
