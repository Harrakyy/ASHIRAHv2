import { Shirt, Crown, Briefcase, Award, BadgeCheck, Layers, Wind, Shield, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SectionBadge } from "@/components/landing/sections/BusinessSection"

const products = [
  {
    icon: Shirt,
    title: "Jersey Custom",
    materials: ["Jersey Print", "Jersey Sablon"],
    options: ["Full Print", "Sablon Polyflex", "DTF", "Manual"],
    description: "Jersey olahraga berperforma tinggi dengan kualitas cetak premium untuk tim dan organisasi.",
    price: "Mulai Rp75.000",
    specs: [
      { icon: Wind, label: "Sirkulasi udara baik" },
      { icon: Shield, label: "Cetakan awet" },
    ],
  },
  {
    icon: Layers,
    title: "T-Shirt Custom",
    materials: ["PE", "18s", "24s", "30s", "Jersey", "Biowash"],
    options: ["Full Print", "Sablon Polyflex", "DTF", "Manual"],
    description: "Kaos custom serbaguna dengan pilihan bahan premium untuk berbagai acara.",
    price: "Mulai Rp50.000",
    specs: [
      { icon: Zap, label: "Katun premium" },
      { icon: Wind, label: "Nyaman dipakai" },
    ],
  },
  {
    icon: Crown,
    title: "Varsity Jacket",
    materials: ["Cotton Fleece", "Canvas", "Wool Blend"],
    options: ["Full Print", "Bordir Timbul", "Bordir Biasa"],
    description: "Jaket varsity klasik dengan pilihan bordir premium untuk sekolah dan organisasi.",
    price: "Mulai Rp180.000",
    specs: [
      { icon: Shield, label: "Bahan premium" },
      { icon: Award, label: "Patch custom" },
    ],
  },
  {
    icon: Briefcase,
    title: "Work Jacket",
    materials: ["Canvas", "Corduroy", "Harrington", "American Drill"],
    options: ["Bordir Timbul", "Bordir Biasa", "Full Print"],
    description: "Jaket kerja profesional yang awet, bergaya, dan menonjolkan identitas perusahaan.",
    price: "Mulai Rp150.000",
    specs: [
      { icon: Shield, label: "Tahan banting" },
      { icon: Wind, label: "Segala cuaca" },
    ],
  },
  {
    icon: Award,
    title: "Almamater",
    materials: ["American Drill", "Hightwist"],
    options: ["Bordir Biasa", "Bordir Timbul"],
    description: "Jaket almamater untuk institusi pendidikan dengan finishing profesional.",
    price: "Mulai Rp200.000",
    specs: [
      { icon: Award, label: "Standar resmi" },
      { icon: Shield, label: "Tahan lama" },
    ],
  },
  {
    icon: BadgeCheck,
    title: "Polo & Kemeja",
    materials: ["POLO", "American Drill", "Ribstop", "Jersey"],
    options: ["Bordir Timbul", "Bordir Biasa", "Sablon"],
    description: "Polo dan kemeja profesional untuk seragam perusahaan dan acara.",
    price: "Mulai Rp85.000",
    specs: [
      { icon: BadgeCheck, label: "Standar korporat" },
      { icon: Wind, label: "Mudah dirawat" },
    ],
  },
]

const additionalProducts = [
  "PDL/Field Jackets",
  "Vest/Rompi",
  "Lanyard & ID Card",
  "Topi Custom",
  "Goodie Bag",
  "Masker Custom",
]

export function ApparelProducts() {
  return (
    <section id="products" className="scroll-mt-24 px-3 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-[1376px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <SectionBadge>Katalog Produk</SectionBadge>
          <h2 className="mt-5 text-[32px] font-bold tracking-[-0.02em] text-ashira-navy sm:text-[44px]">
            Premium Custom Apparel
          </h2>
          <p className="mt-3 max-w-[620px] text-base leading-[1.6] text-ashira-muted sm:text-lg">
            Konveksi kustom dengan harga yang bisa dinegosiasi. Clothing event dan produksi seragam berkualitas tinggi.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {products.map((product) => (
            <article
              key={product.title}
              className="flex flex-col rounded-[28px] border border-white bg-white/90 p-7 shadow-[0_12px_32px_rgba(10,18,51,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(10,18,51,0.16)]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="ashira-dark-gradient flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white">
                  <product.icon className="h-6 w-6" />
                </span>
                <span className="rounded-full bg-[#EEF0FA] px-3 py-1.5 text-[13px] font-semibold text-ashira-blue">
                  {product.price}
                </span>
              </div>

              <h3 className="mt-5 text-[22px] font-bold text-ashira-navy">{product.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.55] text-ashira-muted">{product.description}</p>

              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {product.specs.map((spec) => (
                  <li key={spec.label} className="flex items-center gap-1.5 text-[13px] font-medium text-ashira-navy">
                    <spec.icon className="h-4 w-4 text-ashira-royal" />
                    {spec.label}
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-3 border-t border-ashira-navy/10 pt-5">
                {[
                  { label: "Bahan", items: product.materials },
                  { label: "Opsi Cetak", items: product.options },
                ].map((group) => (
                  <div key={group.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ashira-muted">{group.label}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span key={item} className="rounded-full bg-[#EEF0FA] px-2.5 py-1 text-xs font-medium text-ashira-navy">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Additional Products */}
        <div className="mt-6 rounded-[28px] border border-white bg-white/90 p-7 text-center shadow-[0_12px_32px_rgba(10,18,51,0.08)]">
          <p className="text-sm font-medium text-ashira-muted">Juga tersedia:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            {additionalProducts.map((product) => (
              <span key={product} className="rounded-full border border-ashira-navy/15 px-4 py-2 text-sm font-medium text-ashira-navy">
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href={process.env.NEXT_PUBLIC_CANVAS_URL || "https://canvas.ashiragroup.id/ashira-apparel"}
            className="ashira-dark-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-[0_8px_20px_rgba(10,18,51,0.25)] transition-transform hover:scale-[1.02]"
          >
            Minta Penawaran Custom <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
