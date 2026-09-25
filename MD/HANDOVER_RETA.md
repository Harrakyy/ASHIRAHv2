# 📋 DOKUMEN HANDOVER & INSTRUKSI KERJA FRONTEND DEVELOPER

**Ditujukan Kepada:** Reta (Frontend Developer)  
**Pemberi Dokumen:** Lead / Product Team  
**Proyek:** Redesign & Development Platform Web ASHIRA  
**Repositori:** `ASHIRAHv2-main`  
**File Referensi Desain Figma:** [Figma Design: ashiratech-newest](https://www.figma.com/design/NfnUG3lJnXabhYIkSTV8YE/ashiratech-newest?node-id=0-1&p=f&t=fxLqjc1g404LIMXg-0)  
**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons  

---

## 📌 1. Latar Belakang & Tujuan (Context & Objectives)

Situs web ASHIRA sedang mengalami pembaruan (*redesign*) visual dan struktur konten untuk menegaskan identitas **ASHIRA Group** sebagai holding company yang mengintegrasikan ekosistem fashion & teknologi, membawahi dua subholding utama:
1. **ASHIRA Apparel** (PT Ashira Swarna Apparel): Produksi garmen dan pembuatan apparel custom terstandarisasi.
2. **ASHIRATECH**: Solusi teknologi dan AI (software as a service, agentic negotiation AI, live in-website design application).

Tugas Reta sebagai Frontend Developer adalah:
1. **Mengimplementasikan desain visual terbaru** dari file Figma ke dalam kode frontend.
2. **Membuat komponen Hero Section baru** berbentuk **Interactive Slider 3 Slide** (Slide 1: ASHIRA Group, Slide 2: ASHIRA Apparel, Slide 3: ASHIRATECH).
3. **Melakukan de-scoping / pembersihan navigasi dan halaman** dengan menghapus tab **Portfolio**, **Join Marketer**, dan menu/halaman **ASHIRA Community** (di bawah navbar Divisions).
4. **Membantu developing komponen interaktif** serta memastikan kualitas kode, responsivitas, dan performa web optimal.

---

## 🎨 2. Design System & Style Tokens (Acuan Figma)

Reta wajib menggunakan token desain berikut agar serasi dengan acuan Figma:

### A. Palet Warna (Color Palette)
- **Primary Deep Navy:** `#0B1233` / `#1C2143` (Background container utama, navbar, kartu)
- **Deep Slate Blue:** `#213167` / `#243469` (Gradien bar, card surface)
- **Royal Blue Accent:** `#2B2996` / `#2A50D0` (Border glow, tombol aktif, badge aksen)
- **Lilac / Soft Purple:** `#B899CB` / `#5A5F8E` (Teks aksen, gradien sekunder)
- **Neutral Light / Off-White:** `#FFFFFF` / `#F0F0EA` / `#D9D9D9` (Teks judul, body terang)
- **Gradien Signature:**
  - *Dark Blue Gradient:* `linear-gradient(180deg, #04030D 0%, #2B2996 100%)`
  - *Blue White Gradient:* `linear-gradient(90deg, #213167 0%, #616593 100%)`
  - *Silver White Gradient:* `linear-gradient(90deg, #D1D1D1 0%, #FFFFFF 100%)`

### B. Tipografi (Typography)
- **Headings & Title Display:** **Inter** (Weight: 700 Bold / 800 ExtraBold)
- **Body & Description:** **Plus Jakarta Sans** atau **Inter** (Weight: 400 Regular / 500 Medium)
- **Decorative Accent / Script:** **Satisfy** (Weight: 400 Regular, misal untuk callout handwritten)

---

## 🛠️ 3. Rincian Tugas Teknis (Detailed Task Breakdown)

```
===================================================================================
                                STRUKTUR TUGAS RETA
===================================================================================
1. REFACTOR HERO SECTION         -> 3-Slide Dynamic Carousel (Framer Motion)
   ├─ Slide 1: ASHIRA GROUP      -> Holding Company Ecosystem
   ├─ Slide 2: ASHIRA APPAREL    -> Custom Garment & Production
   └─ Slide 3: ASHIRATECH        -> SaaS, Agentic AI Bot, In-Website Design App
-----------------------------------------------------------------------------------
2. REFACTOR NAVIGASI & ROUTING   -> Header & Footer Cleanup
   ├─ Hapus Tab Portfolio        -> Hapus di navbar, footer, & route /portfolio
   ├─ Hapus Tab Join Marketer    -> Hapus di navbar, footer, & route /join-marketer
   └─ Hapus ASHIRA Community     -> Hapus submenu di Divisions & route /community
-----------------------------------------------------------------------------------
3. DEVELOPING & INTEGRASI        -> Interaktivitas, Responsivitas, & Optimasi
   ├─ Slider Controller          -> Autoplay timer, dot indicator, pause on hover
   ├─ Responsive Layout          -> Stack rapi di mobile (<768px), 2 kolom di desktop
   └─ Asset Optimization         -> Export SVG/WebP dari Figma ke public/images/
===================================================================================
```

---

### 🔹 TUGAS 1: Implementasi Hero Section Baru (3-Slide Interactive Carousel)

Lokasi pengerjaan: `components/landing/hero/` atau `components/hero-section.tsx`.

Ganti struktur Hero yang lama menjadi komponen carousel yang dapat bergeser otomatis (setiap ~6–7 detik) dan dapat diklik secara manual melalui tombol navigasi / tab indikator di bawahnya.

#### 📄 Spesifikasi Tiap Slide:

#### 1. Slide 1 — ASHIRA GROUP (Holding Company)
* **Kategori / Pill Badge:** `PT Ashira Niaga Indonesia — Holding Company`
* **Headline:** *"Dua subholding, satu ekosistem fashion yang berkelanjutan."*
* **Deskripsi:**
  > ASHIRA Group adalah holding company yang membawahi dua subholding: ASHIRATECH di bidang teknologi & AI, dan ASHIRA Apparel di bidang garmen dan produksi apparel custom.
* **Tombol Aksi (CTA):**
  - Primary CTA: `Tentang Kami` (Scroll halus ke anchor `#about`)
  - Secondary CTA: `Lihat Bisnis Kami` (Scroll ke anchor `#holdings` atau section subholding)
  - Floating/Action CTA: `Order Now`
* **Visual Kolom Kanan (Stage):**
  - Mockup visual ekosistem holding (preview MacBook Air / iPhone) yang menampilkan sinergi teknologi dan industri fashion, dengan latar belakang radial glow biru tua gelap.

#### 2. Slide 2 — ASHIRA APPAREL (PT Ashira Swarna Apparel)
* **Kategori / Pill Badge:** `PT Ashira Swarna Apparel — Custom Apparel & Garment`
* **Headline:** *"Produksi garmen yang dibuat sesuai kebutuhan bisnis Anda."*
* **Deskripsi:**
  > Menangani produksi garmen dan pembuatan customizable apparel, menghubungkan klien dengan jaringan mitra pabrik produksi terpercaya dari skala kecil hingga tender massal.
* **Poin Fitur / Badges:**
  - Produksi Garmen Berstandar Ekspor
  - Customizable Apparel (Jersey, T-shirt, Jaket Varsity, Kemeja Kantor)
  - Kemitraan Pabrik Terpercaya
  - Bahan & Spesifikasi: 100% Cotton Combed, Drifit Tech, Jahitan Presisi
* **Tombol Aksi (CTA):**
  - Primary CTA: `Lihat Katalog Produk` (`/apparel#products`)
  - Secondary CTA: `Konsultasi Produksi via WA` (Link ke WhatsApp official)
* **Visual Kolom Kanan (Stage):**
  - Mockup produk apparel premium, preview pilihan bahan/warna, dan kartu harga transparan (mengacu pada Figma: kartu produk `01 / Produk Premium - Rp85.000/pcs`).

#### 3. Slide 3 — ASHIRATECH (Subholding Teknologi & AI)
* **Kategori / Pill Badge:** `ASHIRATECH — Technology & AI Solutions`
* **Headline:** *"Teknologi untuk bisnis yang bergerak lebih cepat."*
* **Deskripsi:**
  > Penyedia layanan software as a service dan AI yang membantu pemilik bisnis dan UMKM menjalankan operasional dari negosiasi cerdas hingga kehadiran digital tanpa beban biaya besar di awal ("Bayarnya Mencicil Saja!").
* **3 Pilar Fitur (Callout Cards):**
  1. **Agentic AI Negotiation:** WA Bot AI otomatis 24/7 yang dapat melakukan negosiasi harga dinamis, potongan volume, dan kalkulasi otomatis (AshirahBot).
  2. **In-Website Design Apps:** Kanvas desain apparel langsung di dalam website untuk menambahkan logo, tipografi, dan preview instan.
  3. **Layanan End-to-End & Fleksibel:** Pengembangan website bisnis siap pakai dengan opsi termin pembayaran ringan.
* **Tombol Aksi (CTA):**
  - Primary CTA: `Coba Kanvas Kustomisasi` (Arahkan ke `/order` atau app customizer)
  - Secondary CTA: `Konsultasi AI Gratis`
* **Visual Kolom Kanan (Stage):**
  - Mockup interaktif chatbot AshirahBot (balon chat simulasi tawar-menawar harga per pcs, diskon volume bertingkat 7%, subtotal otomatis, dan konfirmasi Order ID).

---

### 🔹 TUGAS 2: Pembersihan Navigasi & Halaman (Header & Footer)

Lokasi pengerjaan:
- `components/header.tsx`
- `components/footer.tsx`
- Rute halaman di `app/(public)/`

#### Yang WAJIB Dihapus:
1. **Tab & Rute Portfolio (`/portfolio`):**
   - Hapus entri `{ label: t("portfolio"), href: "/portfolio" }` dari variabel `navItems` di `components/header.tsx`.
   - Hapus tautan `Portfolio` dari `components/footer.tsx`.
   - Hapus folder rute `app/(public)/portfolio/` (atau redirect ke `/apparel` jika diperlukan).
2. **Tab & Rute Join Marketer (`/join-marketer`):**
   - Hapus entri `{ label: t("joinMarketer"), href: "/join-marketer" }` di `components/header.tsx`.
   - Hapus tautan `Join Our Marketer` / `Reseller Program` di `components/footer.tsx`.
   - Hapus folder rute `app/(public)/join-marketer/`.
3. **Submenu & Halaman ASHIRA Community (`/community`):**
   - Di dalam dropdown **Divisions** pada `components/header.tsx`, hapus entri `{ label: t("communityDiv"), href: "/community" }`.
   - Hapus folder rute `app/(public)/community/`.

#### Susunan Navbar Header Baru:
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
      { label: "ASHIRATECH", href: "/#tech" }, // atau halaman dedicated tech jika sudah tersedia
    ]
  },
  { label: t("contact"), href: "/#contact" },
]
```
*Catatan: Pertahankan tombol `Order Now`, selector bahasa (EN/ID), dan profil akun yang sudah ada di header.*

---

### 🔹 TUGAS 3: Bantuan Developing, Interaktivitas, & Clean Code

1. **Struktur Komponen Rapi:**
   - Pisahkan data teks tiap slide ke dalam file data terpisah (misal: `data/hero-slides.ts`) agar mudah diperbarui oleh tim copywriter/desainer.
   - Buat komponen modular: `HeroCarousel.tsx`, `HeroSlideItem.tsx`, `HeroIndicators.tsx`.
2. **Animasi Halus & Aksesibilitas:**
   - Gunakan `framer-motion` (`AnimatePresence`) untuk transisi slide.
   - Dukung `prefers-reduced-motion` untuk aksesibilitas pengguna.
   - Sediakan tombol manual (next/prev atau dots) selain autoplay. Autoplay otomatis pause saat pointer/mouse berada di atas hero container.
3. **Responsivitas:**
   - Pastikan teks di layar mobile (<640px) tidak terpotong atau overflow horizontal.
   - Mockup visual kanan di mobile diletakkan secara vertikal di bawah teks (stacked layout).
4. **Optimasi Aset:**
   - Simpan semua icon SVG dan gambar mockup beresolusi tinggi di `public/images/`.
   - Gunakan `<Image />` dari `next/image` dengan atribut `priority` pada slide pertama untuk memastikan skor LCP (Largest Contentful Paint) tetap tinggi.

---

## ✅ 4. Checklist Kriteria Selesai (Definition of Done)

Gunakan checklist ini untuk memvalidasi pengerjaan sebelum diserahkan ke Lead:

- [ ] **Navbar Header & Footer:**
  - [ ] Tab Portfolio tidak ada lagi di Navbar & Footer.
  - [ ] Tab Join Marketer tidak ada lagi di Navbar & Footer.
  - [ ] Menu ASHIRA Community tidak ada lagi di dropdown Divisions maupun Footer.
  - [ ] Dropdown Divisions menampilkan entitas yang benar (ASHIRA Group, ASHIRA Apparel, ASHIRATECH).
  - [ ] Mobile navigation (hamburger drawer) sudah tersinkronisasi dengan menu baru.
- [ ] **Hero Section Slider:**
  - [ ] Slide 1 (ASHIRA Group) selesai dengan teks, CTA, dan visual mockup yang tepat.
  - [ ] Slide 2 (ASHIRA Apparel) selesai dengan detail garmen, badges, dan mockup produk.
  - [ ] Slide 3 (ASHIRATECH) selesai dengan 3 pilar fitur (AI Bot, Design Canvas, End-to-end) dan visual chat AshirahBot.
  - [ ] Autoplay bekerja mulus (~6-7s) dan pause saat kursor hover.
  - [ ] Tombol/dot selector slide berfungsi aktif dan menunjukkan status slide yang sedang terbuka.
- [ ] **Quality Assurance (QA):**
  - [ ] Tampilan responsif di Desktop (1440px), Tablet (768px - 1024px), dan Mobile (375px - 430px).
  - [ ] Menjalankan `npm run build` sukses tanpa ada error TypeScript atau ESLint.
  - [ ] Tidak ada broken link atau error 404 pada tombol CTA.

---

*Jika terdapat pertanyaan seputar spesifikasi teknis atau aset Figma yang belum jelas, silakan langsung diskusikan dengan tim lead.*
