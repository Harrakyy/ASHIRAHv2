import { glassCard, gradientBody } from "./BusinessSection"

/** "Misi Kami" (Figma). `id="about"` = target CTA hero "Tentang Kami" (HANDOVER). */
export function MissionSection() {
  return (
    <section id="about" className="scroll-mt-24 px-3 py-8 sm:px-6 lg:px-8">
      <div
        className={`${glassCard} mx-auto grid max-w-[1376px] items-center gap-6 p-7 sm:p-10 lg:min-h-[280px] lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:px-28 lg:py-14`}
      >
        <h2 className="text-[36px] font-bold tracking-[-0.03em] text-ashira-navy sm:text-[48px]">Misi Kami</h2>
        <p className={`text-base leading-[1.35] ${gradientBody}`}>
          ASHIRA Group berfokus untuk menciptakan ekosistem industri fashion yang <em>sustainable</em> — menghubungkan
          inovasi teknologi AI dengan produksi apparel, sehingga setiap bisnis dan komunitas yang bekerja sama dengan kami
          dapat tumbuh dengan lebih efisien dan bertanggung jawab.
        </p>
      </div>
    </section>
  )
}
