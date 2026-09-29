/** Testimoni beranda — Figma "REVISI TESTIMONI, LOGO › Dipercaya Untuk Tumbuh Bersama". */

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Kendala terbesar kami sebelumnya adalah revisi mockup visual yang bolak-balik via WhatsApp 3–5 hari, ditambah risiko salah rekap ukuran saat masuk meja potong. Fitur In-Website Design Canvas dari ASHIRATECH jadi game-changer buat brand kami. Klien corporate sekarang bisa utak-atik warna kaos dan upload logo sendiri secara real-time.",
    name: "Amanda R.",
    role: "Founder & Creative Director",
    company: "Clothing Brand",
  },
  {
    quote:
      "Tantangan terbesar di pengadaan pesanan garmen partai besar adalah proses tawar-menawar harga yang berlarut-larut serta risiko salah catat spesifikasi bahan dan ukuran dari spreadsheet manual. Bantuan ASHIRATECH, proses negosiasi bisa berjalan otomatis dengan batas diskon berjenjang yang aman bagi margin pabrik kami.",
    name: "Hendra Kurniawan",
    role: "Operations Manager",
    company: "Garment Industry",
  },
  {
    quote:
      "Setelah pasang WhatsApp Bot AI dari ASHIRATECH, semua chat konsultasi bahan, rekomendasi warna, sampai tawar-menawar harga otomatis dilayani dalam hitungan detik nonstop 24/7. Kami bangun tidur tahu-tahu data pesanan dan rinciannya sudah rapi masuk ke antrean kerja. Respon cepat ini memangkas waktu kerja admin kami.",
    name: "Budi H.",
    role: "Owner",
    company: "Konveksi & Sablon Garmen",
  },
]
