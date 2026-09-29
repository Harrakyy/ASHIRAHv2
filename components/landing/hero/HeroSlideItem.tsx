import Link from "next/link"
import { ArrowRight, Bot, PenTool, Workflow } from "lucide-react"
import type { HeroCta, HeroPillar, HeroSlide } from "@/data/hero-slides"
import { OrderTrigger } from "@/components/order-modal"

const pillarIcons: Record<HeroPillar["icon"], typeof Bot> = { bot: Bot, canvas: PenTool, workflow: Workflow }

function CtaLink({ cta, variant }: { cta: HeroCta; variant: "primary" | "secondary" }) {
  const base =
    "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 py-3.5 text-[15px] transition-all sm:px-[26px] xl:py-4 xl:text-base"
  const styles =
    variant === "primary"
      ? "ashira-silver-gradient font-semibold text-ashira-navy shadow-[0_8px_24px_rgba(4,3,13,0.3)] hover:scale-[1.02]"
      : "border border-white/50 font-medium text-white hover:border-white hover:bg-white/10"
  const content = (
    <>
      {cta.label}
      {variant === "primary" && <ArrowRight className="h-4 w-4" />}
    </>
  )

  if (cta.opensOrderModal) {
    return <OrderTrigger className={`${base} ${styles}`}>{content}</OrderTrigger>
  }
  if (cta.external) {
    return (
      <a href={cta.href} target="_blank" rel="noopener noreferrer" className={`${base} ${styles}`}>
        {content}
      </a>
    )
  }
  return (
    <Link href={cta.href} className={`${base} ${styles}`}>
      {content}
    </Link>
  )
}

/**
 * Kolom kiri hero: badge, headline, deskripsi, fitur/pilar, dan 2 CTA.
 * `sizer` = salinan tak terlihat yang hanya dipakai untuk mengunci tinggi kolom
 * (headline dirender sebagai <p> agar halaman tetap punya satu <h1>).
 */
export function HeroSlideItem({ slide, sizer = false }: { slide: HeroSlide; sizer?: boolean }) {
  const Headline = sizer ? "p" : "h1"
  return (
    <div className="flex flex-col items-start gap-5">
      <span className="rounded-full border border-white/55 px-4 py-2 text-[13px] font-medium text-white sm:text-sm">
        {slide.badge}
      </span>

      <Headline className="ashira-silver-text text-[32px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[42px] md:text-[32px] lg:text-[40px] xl:text-[50px] xl:leading-[1.08]">
        {slide.headline}
      </Headline>

      <p className="max-w-[540px] text-base leading-[1.6] text-[#D9D9D9] md:text-[15px] lg:text-base xl:max-w-[620px] xl:text-[17px]">{slide.description}</p>

      {slide.features.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Poin utama">
          {slide.features.map((feature) => (
            <li
              key={feature}
              className="rounded-full border border-white/25 bg-white/[0.06] px-3.5 py-1.5 text-[13px] font-medium leading-snug text-ashira-offwhite"
            >
              {feature}
            </li>
          ))}
        </ul>
      )}

      {slide.pillars.length > 0 && (
        <ul className="grid w-full gap-2" aria-label="Pilar layanan">
          {slide.pillars.map((pillar) => {
            const Icon = pillarIcons[pillar.icon]
            return (
              <li
                key={pillar.title}
                className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-3.5 py-2.5"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold leading-snug text-white">{pillar.title}</span>
                  <span className="mt-0.5 hidden text-[12px] leading-snug text-[#C9CAD9] sm:block md:hidden lg:block">{pillar.description}</span>
                </span>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
        <CtaLink cta={slide.primaryCta} variant="primary" />
        <CtaLink cta={slide.secondaryCta} variant="secondary" />
      </div>
    </div>
  )
}
