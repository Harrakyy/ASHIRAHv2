import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { gradientBody } from "@/components/landing/sections/BusinessSection"

export const metadata: Metadata = {
  title: "Tentang Kami | ASHIRA Group",
  description:
    "ASHIRA Group adalah holding company yang membawahi ASHIRATECH (teknologi & AI) dan ASHIRA Apparel (garmen & apparel custom).",
}

const blocks = [
  {
    title: "ASHIRATECH",
    body: "Subholding teknologi ASHIRA Group, menyediakan layanan software as a service dan AI bagi pemilik bisnis dan UMKM. Melalui Agentic AI Negotiation, in-website design app, dan layanan end-to-end, ASHIRATECH mempermudah pelaku usaha mengelola operasional dan efisiensi bisnis mereka.",
  },
  {
    title: "ASHIRA Apparel",
    body: "Subholding ASHIRA Group yang bergerak di produksi garmen dan pembuatan customizable apparel, memproduksi jaket, t-shirt, vest, dan seragam custom untuk menghasilkan produk fashion yang sesuai kebutuhan.",
  },
  {
    title: "Ekosistem yang berkelanjutan",
    body: "Dengan menyatukan sisi teknologi dan produksi dalam satu grup, ASHIRA berupaya membangun ekosistem industri fashion yang lebih efisien dari proses desain hingga produksi.",
  },
]

const logoPill =
  "ashira-silver-gradient flex h-[88px] w-[300px] items-center justify-center rounded-[22px] border border-white shadow-[0_10px_24px_rgba(10,18,51,0.15),inset_0_2px_4px_rgba(255,255,255,0.8)]"

export default function AboutPage() {
  return (
    <main className="ashira-page-gradient min-h-screen">
      <div className="ashira-grid-pattern relative isolate overflow-hidden">
        {/* Latar foto gedung samar (Figma) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[900px] bg-[url('/images/decor/building.webp')] bg-cover bg-top opacity-[0.08] grayscale"
        />
        {/* Hero */}
        <section className="mx-auto grid max-w-[1376px] items-center gap-12 px-6 pb-16 pt-32 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-16 lg:pb-20 lg:pt-40">
          <div>
            <p className="text-sm font-medium text-ashira-muted">Tentang Kami</p>
            <h1 className="mt-4 text-[38px] font-bold leading-[1.08] tracking-[-0.03em] text-ashira-navy sm:text-[52px] lg:text-[60px]">
              Dua <em className="font-bold">subholding</em>, satu
              <br />
              ekosistem fashion
              <br />
              <span className="text-ashira-royal">yang berkelanjutan</span>
            </h1>
            <p className={`mt-6 max-w-[560px] text-base leading-[1.4] ${gradientBody}`}>
              ASHIRA Group adalah holding company yang membawahi dua subholding: ASHIRATECH di bidang teknologi &amp; AI,
              dan ASHIRA Apparel di bidang garmen dan produksi apparel custom.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#tentang"
                className="ashira-dark-gradient inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(10,18,51,0.25)]"
              >
                Tentang Kami <ArrowDown className="h-4 w-4" />
              </a>
              <Link
                href="/#holdings"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ashira-navy/40 px-7 py-3.5 text-[15px] font-medium text-ashira-navy hover:bg-white/60"
              >
                Lihat Bisnis Kami <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 lg:items-end">
            <div className={logoPill}>
              <Image
                src="/images/hero/ashiratech-wordmark.png"
                alt="ASHIRATECH"
                width={351}
                height={102}
                className="h-11 w-auto object-contain"
              />
            </div>
            <div className={logoPill}>
              <Image
                src="/images/hero/ashirah-apparel-logo.png"
                alt="ASHIRA'H — ASHIRA Apparel"
                width={991}
                height={330}
                className="h-12 w-auto object-contain opacity-85 brightness-0"
              />
            </div>
          </div>
        </section>

        {/* Isi */}
        <section id="tentang" className="scroll-mt-24 px-3 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-[1264px] rounded-[32px] border border-white bg-white/90 p-8 shadow-[0_20px_48px_rgba(10,18,51,0.12)] sm:p-12 lg:rounded-[40px] lg:p-16">
            <div className="space-y-12">
              {blocks.map((b) => (
                <div key={b.title}>
                  <h2 className="text-[28px] font-bold tracking-[-0.02em] text-ashira-navy sm:text-[40px]">{b.title}</h2>
                  <p className={`mt-4 max-w-[1040px] text-lg leading-[1.45] sm:text-[24px] ${gradientBody}`}>{b.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-14 text-center text-sm italic text-ashira-muted">
              Lihat postingan terbaru kami di Instagram{" "}
              <a
                href="https://instagram.com/ashira.group"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ashira-blue hover:underline"
              >
                @ashira.group
              </a>{" "}
              untuk cerita dan aktivitas terkini.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
