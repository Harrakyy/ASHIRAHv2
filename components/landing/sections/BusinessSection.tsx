import Image from "next/image"

interface Business {
  id: string
  badge: string
  titleTop: string
  titleBottom: string
  description: string
  /** Ikon dari Figma (public/images/icons/). */
  features: { label: string; icon: string }[]
}

const businesses: Business[] = [
  {
    id: "tech",
    badge: "ASHIRATECH",
    titleTop: "Teknologi untuk bisnis",
    titleBottom: "yang bergerak lebih cepat",
    description:
      "PT Ashira Technology sebagai penyedia layanan Software as a Service dan AI yang membantu pemilik bisnis dan UMKM menjalankan operasional dengan lebih mudah, mulai dari nego, konsultasi, payment, track order, hingga sampai ke tangan customer.",
    features: [
      { label: "Agentic AI Negotiation", icon: "/images/icons/chat-ai.svg" },
      { label: "In-Website Design Apps", icon: "/images/icons/globe.svg" },
      { label: "Layanan End-to-End", icon: "/images/icons/chat-ai.svg" },
    ],
  },
  {
    id: "apparel",
    badge: "ASHIRA Apparel",
    titleTop: "Produksi apparel yang",
    titleBottom: "dibuat sesuai kebutuhan",
    description:
      "PT Ashira Swarna Apparel menangani produksi garmen dan pembuatan customizable apparel, menghubungkan klien dengan jaringan mitra produksi terpercaya.",
    features: [
      { label: "Produksi Garmen", icon: "/images/icons/hanger.svg" },
      { label: "Customizable Apparel", icon: "/images/icons/fabric.svg" },
      { label: "Kemitraan Pabrik", icon: "/images/icons/collaborate.svg" },
    ],
  },
]

export function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-ashira-navy px-3.5 py-1.5 text-[13px] font-medium text-white">
      {children}
    </span>
  )
}

export const glassCard =
  "rounded-[32px] border border-white bg-white/90 shadow-[0_16px_40px_rgba(10,18,51,0.12)] backdrop-blur-sm lg:rounded-[40px]"

/** Teks body bergradasi navy → royal seperti di Figma. */
export const gradientBody =
  "bg-[linear-gradient(180deg,#04030D_0%,#2B2996_100%)] bg-clip-text text-transparent"

export function BusinessSection() {
  return (
    <section id="holdings" className="scroll-mt-24 px-3 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <div className="mx-auto grid max-w-[1376px] gap-6 lg:grid-cols-2 lg:gap-8">
        {businesses.map((b) => (
          <article key={b.id} id={b.id} className={`${glassCard} scroll-mt-28 p-7 sm:p-10 lg:p-12`}>
            <span className="inline-flex rounded-full bg-[linear-gradient(90deg,#213167_0%,#2B2996_100%)] px-4 py-1.5 text-[15px] text-white">
              {b.badge}
            </span>
            <h2 className="mt-6 text-[28px] font-bold leading-[1.1] tracking-[-0.03em] text-ashira-navy sm:text-[40px] xl:text-[48px]">
              {b.titleTop}
              <br />
              <span className="text-ashira-royal">{b.titleBottom}</span>
            </h2>
            <p className={`mt-5 max-w-[540px] text-[15px] leading-[1.35] sm:text-base ${gradientBody}`}>{b.description}</p>
            <ul className="mt-7 space-y-4">
              {b.features.map(({ label, icon }) => (
                <li key={label} className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white shadow-[0_4px_10px_rgba(10,18,51,0.18)]">
                    <Image src={icon} alt="" width={24} height={24} className="h-6 w-6" />
                  </span>
                  <span className="text-[17px] font-medium text-ashira-deep">{label}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
