/**
 * Data teks hero carousel (Figma: "Redesign v2 — Hero Carousel").
 * Tim copywriter/desainer cukup mengubah file ini untuk memperbarui isi slide.
 */

export const WHATSAPP_URL = "https://wa.me/6285819993633"

export type HeroStageKind = "ecosystem" | "apparel" | "tech"

export interface HeroCta {
  label: string
  href: string
  /** Buka di tab baru (untuk link eksternal seperti WhatsApp). */
  external?: boolean
  /** Buka modal "Mulai Order" (Figma) — href tetap jadi fallback tanpa JavaScript. */
  opensOrderModal?: boolean
}

export interface HeroPillar {
  /** Kunci ikon (dipetakan ke ikon Lucide di HeroSlideItem). */
  icon: "bot" | "canvas" | "workflow"
  title: string
  description: string
}

export interface HeroSlide {
  id: string
  /** Label pendek di bawah indikator, mis. "01 / ASHIRA Group". */
  name: string
  badge: string
  headline: string
  description: string
  /** Poin fitur ringkas (daftar centang). */
  features: string[]
  /** Pilar fitur dengan penjelasan singkat (callout card). */
  pillars: HeroPillar[]
  primaryCta: HeroCta
  secondaryCta: HeroCta
  stage: HeroStageKind
}

export const heroSlides: HeroSlide[] = [
  {
    id: "group",
    name: "ASHIRA Group",
    badge: "PT Ashira Niaga Indonesia — Holding Company",
    headline: "Dua subholding, satu ekosistem fashion yang berkelanjutan.",
    description:
      "ASHIRA Group adalah holding company yang membawahi dua subholding: ASHIRATECH di bidang teknologi & AI, dan ASHIRA Apparel di bidang garmen dan produksi apparel custom.",
    features: [],
    pillars: [],
    primaryCta: { label: "Tentang Kami", href: "/#about" },
    secondaryCta: { label: "Lihat Bisnis Kami", href: "/#holdings" },
    stage: "ecosystem",
  },
  {
    id: "apparel",
    name: "ASHIRA Apparel",
    badge: "PT Ashira Swarna Apparel — Custom Apparel & Garment",
    headline: "Produksi garmen yang dibuat sesuai kebutuhan bisnis Anda.",
    description:
      "Menangani produksi garmen dan pembuatan customizable apparel, menghubungkan klien dengan jaringan mitra pabrik produksi terpercaya dari skala kecil hingga tender massal.",
    features: [
      "Produksi Garmen Berstandar Ekspor",
      "Customizable Apparel (Jersey, T-shirt, Jaket Varsity, Kemeja Kantor)",
      "Kemitraan Pabrik Terpercaya",
      "Bahan & Spesifikasi: 100% Cotton Combed, Drifit Tech, Jahitan Presisi",
    ],
    pillars: [],
    primaryCta: { label: "Lihat Katalog Produk", href: "/apparel#products" },
    secondaryCta: { label: "Konsultasi Produksi via WA", href: WHATSAPP_URL, external: true },
    stage: "apparel",
  },
  {
    id: "tech",
    name: "ASHIRATECH",
    badge: "ASHIRATECH — Technology & AI Solutions",
    headline: "Teknologi untuk bisnis yang bergerak lebih cepat.",
    description:
      'Penyedia layanan software as a service dan AI yang membantu pemilik bisnis dan UMKM menjalankan operasional dari negosiasi cerdas hingga kehadiran digital tanpa beban biaya besar di awal ("Bayarnya Mencicil Saja!").',
    features: [],
    pillars: [
      {
        icon: "bot",
        title: "Agentic AI Negotiation",
        description:
          "WA Bot AI otomatis 24/7 yang dapat melakukan negosiasi harga dinamis, potongan volume, dan kalkulasi otomatis (AshirahBot).",
      },
      {
        icon: "canvas",
        title: "In-Website Design Apps",
        description:
          "Kanvas desain apparel langsung di dalam website untuk menambahkan logo, tipografi, dan preview instan.",
      },
      {
        icon: "workflow",
        title: "Layanan End-to-End & Fleksibel",
        description: "Pengembangan website bisnis siap pakai dengan opsi termin pembayaran ringan.",
      },
    ],
    primaryCta: { label: "Coba Kanvas Kustomisasi", href: "/order", opensOrderModal: true },
    secondaryCta: { label: "Konsultasi AI Gratis", href: WHATSAPP_URL, external: true },
    stage: "tech",
  },
]

/** Durasi tiap slide sebelum pindah otomatis (ms). */
export const HERO_AUTOPLAY_MS = 6500

/** Data simulasi di panel AshirahBot (slide 03). */
export const negotiationDemo = {
  quantity: 50,
  basePrice: 105000,
  discountPercent: 7,
  orderId: "SIM-1790150070093",
}
