# 📋 BRIEFING & DOKUMEN TUGAS FRONTEND DEVELOPER

**Penerima Tugas:** Reta (Frontend Developer)  
**Proyek:** Redesign & Developing Frontend ASHIRA Web Platform  
**File Referensi Desain:** [Figma Design: ashiratech-newest](https://www.figma.com/design/NfnUG3lJnXabhYIkSTV8YE/ashiratech-newest?node-id=0-1&p=f&t=fxLqjc1g404LIMXg-0)  
**Stack Teknologi:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons  

---

## 🎯 Ringkasan Tujuan (Objective)

Tugas utama untuk Frontend Developer (Reta) adalah:
1. **Redesign visual frontend** mengacu pada file Figma terbaru (`ashiratech-newest`), menyesuaikan hierarki merek ASHIRA Group sebagai holding company beserta dua entitas bisnis utamanya: **ASHIRA Apparel** dan **ASHIRATECH**.
2. **Membangun Hero Section baru berbentuk Interactive Slider/Carousel 3 Slide** yang memuat:
   - **Slide 1:** ASHIRA GROUP (Holding Company & Ekosistem)
   - **Slide 2:** ASHIRA APPAREL (Produksi Garmen & Customizable Apparel)
   - **Slide 3:** ASHIRATECH (SaaS, AI Agentic Negotiation & In-Website Design Apps)
3. **Restrukturisasi & Pembersihan Navigasi/Halaman:**
   - Menghapus tab/menu **Portfolio**
   - Menghapus tab/menu **Join Marketer**
   - Menghapus submenu & halaman **ASHIRA Community** (di bawah dropdown navbar *Divisions*)
4. **Membantu developing fungsionalitas** komponen pendukung serta memastikan integrasi desain berjalan responsif, mulus, dan bebas error.

---

## 🎨 Panduan Design System (Dari Figma)

| Elemen | Token / Spesifikasi | Catatan Penggunaan |
| :--- | :--- | :--- |
| **Primary Navy** | `#0B1233` / `#1C2143` / `#213167` | Warna latar utama hero section & navbar |
| **Royal Blue Accent** | `#2B2996` / `#2A50D0` | Warna aksen, hover glow, border aktif |
| **Lilac / Purple Accent**| `#B899CB` / `#5A5F8E` | Gradien sekunder & badge visual |
| **Surface White/Off-White** | `#FFFFFF` / `#F0F0EA` / `#D9D9D9` | Teks headline, kartu kontras, background terang |
| **Font Display / Heading** | **Inter** (SemiBold 600, Bold 700, ExtraBold 800) | Judul hero, nama produk, angka metrik |
| **Font Body Text** | **Plus Jakarta Sans** (Regular 400, Medium 500) | Paragraf, deskripsi subholding, label tombol |
| **Font Accent/Script** | **Satisfy** (Regular 400) | Aksen teks dekoratif (misal: tagline/callout) |
| **Gradient Utama** | `linear-gradient(90deg, #213167 0%, #616593 100%)` & `linear-gradient(180deg, #04030D 0%, #2B2996 100%)` | Digunakan pada card container, pill tags, dan overlay |

---

## 🚀 Rincian Tugas & Spesifikasi Komponen

### TUGAS 1: Redesign Hero Section Menjadi 3-Slide Interactive Carousel

Ganti komponen hero yang ada di `components/landing/hero/` atau `components/hero-section.tsx` menjadi format **Interactive Slider** dengan transisi halus (`framer-motion`). 

Hero memiliki 3 slide utama yang dapat berganti otomatis (interval ~6-8 detik, jeda saat kursor hover) atau dapat digeser manual melalui dot indicator / thumbnail tabs.

```
+-----------------------------------------------------------------------------------+
| [Navbar: Logo | Home | About | Divisions [v] | Contact | [Order Now] ]            |
+-----------------------------------------------------------------------------------+
|  HERO SLIDER:                                                                     |
|  [ < Prev ]                                                           [ Next > ]  |
|                                                                                   |
|  +-----------------------------------+  +--------------------------------------+  |
|  | KIRI: TEXT ZONE                   |  | KANAN: VISUAL / MOCKUP SHOWCASE      |  |
|  | - Badge Kategori                  |  | (Mockup Device, Produk, atau         |  |
|  | - Headline Utama                  |  |  Interactive Canvas Preview)         |  |
|  | - Paragraf Deskripsi              |  |                                      |  |
|  | - CTA Buttons (Primary & Secondary)|  |                                      |  |
|  +-----------------------------------+  +--------------------------------------+  |
|                                                                                   |
|  [ Indicator Tab/Dots: 01 Ashira Group  |  02 Ashira Apparel  |  03 Ashira Tech ] |
+-----------------------------------------------------------------------------------+
```

#### 📌 Slide 1 — ASHIRA GROUP (Holding Company)
- **Tag / Badge:** `PT Ashira Niaga Indonesia — Holding Company`
- **Headline Utama:** *"Dua subholding, satu ekosistem fashion yang berkelanjutan."*
- **Deskripsi:** 
  > ASHIRA Group adalah holding company yang membawahi dua subholding: ASHIRATECH di bidang teknologi & AI, dan ASHIRA Apparel di bidang garmen dan produksi apparel custom.
- **CTA Actions:**
  - Tombol Utama: `Tentang Kami` (Arahkan ke anchor `#about`)
  - Tombol Sekunder: `Lihat Bisnis Kami` (Arahkan ke section Subholding/Divisions)
  - Tombol Aksi Langsung: `Order Now`
- **Visual Kolom Kanan:**
  - Mockup visual ekosistem gabungan: device preview (MacBook / iPhone) yang menampilkan integrasi antara tech platform & garmen, didukung aksen radial glow biru gelap.

#### 📌 Slide 2 — ASHIRA APPAREL (Subholding Garmen)
- **Tag / Badge:** `PT Ashira Swarna Apparel — Apparel & Garment`
- **Headline Utama:** *"Produksi garmen yang dibuat sesuai kebutuhan bisnis Anda."*
- **Deskripsi:**
  > Menangani produksi garmen dan pembuatan customizable apparel skala kecil hingga besar, menghubungkan klien dengan jaringan mitra pabrik produksi terpercaya.
- **Poin Unggulan (Pill Badges / List):**
  - Produksi Garmen Berstandar Ekspor
  - Customizable Apparel (Jersey, T-shirt, Jaket Varsity, Kemeja Kantor)
  - Kemitraan Pabrik Terpercaya
  - Spesifikasi Material: 100% Cotton, Drifit Premium, Bordir & Sablon Presisi
- **CTA Actions:**
  - Tombol Utama: `Katalog Produk` (Arahkan ke `/apparel#products`)
  - Tombol Sekunder: `Konsultasi Produksi via WA`
- **Visual Kolom Kanan:**
  - Mockup produk apparel premium, color swatch, dan kartu detail harga per pcs (referensi Figma: kartu produk `01 / Produk Premium - Rp85.000/pcs`).

#### 📌 Slide 3 — ASHIRATECH (Subholding Teknologi & AI)
- **Tag / Badge:** `ASHIRATECH — Technology & AI Solutions`
- **Headline Utama:** *"Teknologi untuk bisnis yang bergerak lebih cepat."*
- **Deskripsi:**
  > Penyedia layanan software as a service (SaaS) dan AI yang membantu pemilik bisnis dan UMKM menjalankan operasional dari negosiasi cerdas hingga kehadiran digital tanpa beban biaya besar di awal.
- **3 Fitur Utama (Interactive Callouts / Cards):**
  1. **Agentic AI Negotiation:** WA Bot AI 24/7 yang dapat melakukan negosiasi harga dinamis dan konfirmasi pesanan otomatis (AshirahBot).
  2. **In-Website Design Apps:** Kanvas kustomisasi real-time untuk mendesain apparel dan kalkulasi harga instan.
  3. **Layanan End-to-End & Fleksibel:** Solusi digital website custom siap pakai dengan opsi cicilan ("Bayarnya Mencicil Saja!").
- **CTA Actions:**
  - Tombol Utama: `Coba Fitur Kustomisasi` (Arahkan ke `/order` atau web app design)
  - Tombol Sekunder: `Konsultasi Gratis`
- **Visual Kolom Kanan:**
  - Mockup interaktif chatbot WhatsApp AI / simulasi tawar-menawar diskon (referensi Figma: chat balon AshirahBot *"Diskon 7% - harga per pcs jadi Rp97.650"* dan Order ID).

---

### TUGAS 2: Restrukturisasi Navigasi (Navbar & Footer)

Lakukan refactor pada file `components/header.tsx` dan `components/footer.tsx`.

#### ❌ Yang Wajib Dihapus / Di-remove:
1. **Tab & Route Portfolio (`/portfolio`):**
   - Hapus item `Portfolio` dari array `navItems` di `components/header.tsx`.
   - Hapus route folder `app/(public)/portfolio/` jika sudah tidak digunakan, atau un-export route-nya.
   - Hapus tautan `Portfolio` dari `components/footer.tsx`.
2. **Tab & Route Join Marketer (`/join-marketer`):**
   - Hapus item `Join Marketer` dari array `navItems` di `components/header.tsx`.
   - Hapus route folder `app/(public)/join-marketer/`.
   - Hapus tautan `Join Our Marketer` / `Reseller Program` dari `components/footer.tsx`.
3. **Halaman & Menu ASHIRA Community (`/community`):**
   - Hapus submenu `ASHIRA Community` yang ada di bawah dropdown **Divisions** di `components/header.tsx`.
   - Hapus/nonaktifkan route folder `app/(public)/community/`.

####  Struktur Navbar Baru yang Diharapkan:
```typescript
const navItems = [
  { label: t("home"), href: "/" },
  { label: t("about"), href: "/#about" },
  { 
    label: t("divisions"), 
    href: "#",
    submenu: [
      { label: "ASHIRA Group", href: "/" },
      { label: "ASHIRA Apparel", href: "/apparel" },
      { label: "ASHIRATECH", href: "/#tech" }, // atau link dedicated tech
    ]
  },
  { label: t("contact"), href: "/#contact" },
]
```
- Pertahankan tombol aksi **Order Now** dan selector bahasa (EN/ID) di pojok kanan header.
- Pastikan tampilan mobile drawer menu (hamburger menu) juga diperbarui mengikuti struktur ini.

---

### TUGAS 3: Bantuan Developing & Integrasi

1. **Responsivitas Layar:**
   - Semua elemen Figma harus tampil optimal di Desktop (1440px+), Tablet (768px - 1024px), dan Smartphone (360px - 480px).
   - Pastikan teks di mobile tidak terpotong (gunakan `w-full`, `break-words`, atau wrapping yang rapi).
2. **Animasi & Transisi:**
   - Gunakan `framer-motion` untuk perpindahan antar slide (fade-in/slide-in, durasi ~0.4s - 0.6s).
   - Hormati pengaturan aksesibilitas sistem (`prefers-reduced-motion`).
3. **Clean Code & Tipe Data:**
   - Pastikan kode ditulis dalam TypeScript yang strictly-typed (tanpa `any` sembarangan).
   - Pisahkan data teks tiap slide ke dalam file data/konfigurasi terpisah (misal: `hero-slides-data.ts`) agar mudah di-maintain.
4. **Aset Gambar & Mockup:**
   - Ekspor aset-aset vektor (SVG) dan mockup produk resolusi tinggi dari Figma dan simpan di folder `public/images/`.
   - Gunakan komponen `<Image />` dari `next/image` dengan properti `priority` untuk slide pertama agar LCP (Largest Contentful Paint) tetap cepat.

---

## 📅 Tahapan Pengerjaan Rekomendasi (Action Plan)

- [ ] **Fase 1 (Cleanup & Setup):**
  - Hapus menu & link Portfolio, Join Marketer, dan Community dari Navbar & Footer.
  - Rapikan rute file yang sudah tidak terpakai di folder `app/(public)/`.
- [ ] **Fase 2 (Asset Export & Token Sync):**
  - Ekspor aset visual, icon, dan mockup dari Figma link yang disediakan.
  - Perbarui token Tailwind CSS di `tailwind.config.js` / `globals.css` sesuai warna dan font Figma.
- [ ] **Fase 3 (Slider Implementation):**
  - Buat komponen `HeroSlider.tsx` dan `HeroSlideItem.tsx`.
  - Implementasikan Slide 1 (Ashira Group), Slide 2 (Ashira Apparel), dan Slide 3 (Ashira Tech).
  - Hubungkan kontrol slider (next/prev, dot indicators, autoplay timer).
- [ ] **Fase 4 (Mobile Optimization & Testing):**
  - Uji tampilan pada breakpoint mobile dan desktop.
  - Uji navigasi tautan tombol CTA ke section yang tepat.
  - Jalankan `npm run build` untuk memastikan tidak ada build error atau lint error.

---

*Jika Reta menemukan kendala teknis atau pertanyaan seputar aset desain Figma, silakan langsung koordinasikan dengan tim lead.*
