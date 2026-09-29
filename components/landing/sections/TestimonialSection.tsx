import { testimonials } from "@/data/testimonials"
import { SectionBadge } from "./BusinessSection"

/** "Dipercaya Untuk Tumbuh Bersama" — Figma REVISI TESTIMONI, LOGO. */
export function TestimonialSection() {
  return (
    <section className="px-3 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <div className="mx-auto flex max-w-[1376px] flex-col items-center text-center">
        <SectionBadge>Testimoni</SectionBadge>
        <h2 className="mt-5 text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-ashira-navy sm:text-[44px]">
          Dipercaya Untuk
          <br />
          <span className="text-ashira-royal">Tumbuh Bersama</span>
        </h2>
        <p className="mt-3 max-w-[600px] text-base leading-[1.6] text-ashira-muted sm:text-lg">
          Kolaborasi dengan berbagai partner untuk menghadirkan solusi yang relevan dan mendukung perkembangan bisnis.
        </p>

        <div className="mt-10 grid w-full gap-5 text-left md:grid-cols-3 lg:gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-[28px] border border-white bg-white/90 p-7 shadow-[0_12px_32px_rgba(10,18,51,0.1)]"
            >
              <blockquote className="text-[14px] leading-[1.45] text-ashira-muted md:text-justify">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto pt-5">
                <p className="text-[22px] font-semibold text-ashira-navy">{t.name}</p>
                <p className="mt-1 text-sm text-ashira-muted">{t.role}</p>
                <p className="text-sm text-ashira-muted">{t.company}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
