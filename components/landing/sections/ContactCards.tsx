import { ArrowRight } from "lucide-react"
import { WHATSAPP_URL } from "@/data/hero-slides"
import { SectionBadge } from "./BusinessSection"

const contacts = [
  {
    channel: "WhatsApp",
    title: "Chat tim ASHIRA",
    description: "Konsultasi produksi, bahan, dan order.",
    cta: "Chat sekarang",
    href: WHATSAPP_URL,
  },
  {
    channel: "Instagram",
    title: "@ashira.group",
    description: "Cerita dan aktivitas terbaru ASHIRA Group.",
    cta: "Lihat Instagram",
    href: "https://instagram.com/ashira.group",
  },
  {
    channel: "Website",
    title: "ashiragroup.id",
    description: "Info lengkap holding dan subholding.",
    cta: "Kunjungi",
    href: "https://ashiragroup.id",
  },
]

export function ContactCards() {
  return (
    <section id="contact" className="scroll-mt-24 px-3 pb-8 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1376px] flex-col items-center text-center">
        <SectionBadge>Kontak</SectionBadge>
        <h2 className="mt-5 text-[32px] font-bold tracking-[-0.02em] text-ashira-navy sm:text-[44px]">Hubungi Kami</h2>
        <p className="mt-3 max-w-[560px] text-base leading-[1.6] text-ashira-muted sm:text-lg">
          Punya kebutuhan produksi apparel atau ingin konsultasi solusi teknologi? Tim ASHIRA siap membantu.
        </p>

        <div className="mt-10 grid w-full gap-5 text-left md:grid-cols-3 lg:gap-6">
          {contacts.map(({ channel, title, description, cta, href }) => (
            <a
              key={channel}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] border border-white bg-white/90 p-7 shadow-[0_12px_32px_rgba(10,18,51,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(10,18,51,0.16)]"
            >
              <span className="text-[13px] font-medium text-ashira-muted">{channel}</span>
              <p className="mt-2 text-[22px] font-bold text-ashira-navy">{title}</p>
              <p className="mt-2 text-[15px] leading-[1.55] text-ashira-muted">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ashira-blue">
                {cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
