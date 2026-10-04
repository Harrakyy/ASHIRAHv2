import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const highlights = [
  { title: "Gratis", caption: "Sampel desain" },
  { title: "Cepat", caption: "Waktu produksi" },
  { title: "Nasional", caption: "Kirim ke seluruh Indonesia" },
]

export function ApparelHero() {
  return (
    <section className="px-3 pb-8 pt-[92px] sm:px-6 lg:px-8 lg:pt-[112px]">
      <div className="ashira-dark-gradient relative mx-auto max-w-[1376px] overflow-hidden rounded-[32px] shadow-[0_20px_48px_rgba(10,18,51,0.25)] lg:rounded-[44px]">
        <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 xl:p-14">
          {/* Konten */}
          <div className="flex flex-col items-start">
            <Image src="/images/logo.png" alt="ASHIRA'H — ASHIRA Apparel" width={180} height={63} className="h-auto w-[150px] object-contain sm:w-[180px]" />

            <span className="mt-6 rounded-full border border-white/55 px-4 py-2 text-[13px] font-medium text-white sm:text-sm">
              PT Ashira Swarna Apparel — Premium Quality
            </span>

            <h1 className="ashira-silver-text mt-6 text-[36px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[48px] xl:text-[56px]">
              Apparel Custom Premium
            </h1>

            <p className="mt-5 max-w-[520px] text-base leading-[1.6] text-[#D9D9D9] sm:text-lg">
              Solusi pakaian custom berkualitas tinggi untuk organisasi, kampus, dan perusahaan.
            </p>

            <p className="mt-4 flex items-center gap-3 font-medium text-ashira-lilac">
              <span className="h-px w-8 bg-ashira-lilac" aria-hidden />
              Harga bisa nego &amp; bonus eksklusif
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href={process.env.NEXT_PUBLIC_CANVAS_URL || "https://canvas.ashiragroup.id/ashira-apparel"}
                className="ashira-silver-gradient inline-flex items-center justify-center gap-2.5 rounded-full px-[26px] py-3.5 text-[15px] font-semibold text-ashira-navy shadow-[0_8px_24px_rgba(4,3,13,0.3)] transition-transform hover:scale-[1.02] sm:text-base"
              >
                Minta Penawaran <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-full border border-white/50 px-[26px] py-3.5 text-[15px] font-medium text-white transition-colors hover:border-white hover:bg-white/10 sm:text-base"
              >
                Lihat Produk
              </a>
            </div>

            <dl className="mt-10 grid w-full grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {highlights.map((h) => (
                <div key={h.title}>
                  <dt className="text-lg font-bold text-white sm:text-2xl">{h.title}</dt>
                  <dd className="mt-0.5 text-xs text-white/60 sm:text-sm">{h.caption}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual produk */}
          <div className="ashira-stage relative h-[340px] overflow-hidden rounded-[28px] sm:h-[460px] lg:h-[560px] lg:rounded-[36px]">
            <div
              aria-hidden
              className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_70%)]"
            />
            <div className="absolute inset-y-[10%] left-[8%] w-[46%]">
              <Image
                src="/images/hero/tshirt-back.webp"
                alt="Tampak belakang kaos custom ASHIRA Apparel"
                fill
                sizes="(min-width: 1024px) 280px, 45vw"
                className="object-contain opacity-90 drop-shadow-[0_18px_24px_rgba(10,18,51,0.16)]"
              />
            </div>
            <div className="absolute inset-y-[6%] right-[6%] w-[54%]">
              <Image
                src="/images/hero/tshirt-front.webp"
                alt="Tampak depan kaos custom ASHIRA Apparel"
                fill
                priority
                sizes="(min-width: 1024px) 320px, 50vw"
                className="object-contain drop-shadow-[0_22px_28px_rgba(10,18,51,0.22)]"
              />
            </div>
            <span className="absolute bottom-5 left-5 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ashira-navy shadow-[0_4px_12px_rgba(10,18,51,0.12)] sm:bottom-6 sm:left-6 sm:text-[13px]">
              Jersey · T-Shirt · Varsity · Work Jacket
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
