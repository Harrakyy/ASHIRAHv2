# ASHIRA'H v2 — Prompt Scaffolding Fase 3 (untuk Claude Code)

> **Cara pakai**: Copy seluruh isi file ini sebagai prompt ke Claude Code, dijalankan
> di folder kerja baru (BUKAN di dalam folder monolith `ASHIRAHv2-main` lama).
> Pastikan folder monolith lama tetap ada dan bisa diakses read-only sebagai referensi
> (misal di `../ASHIRAHv2-main` relatif terhadap working directory Claude Code).

---

## ATURAN KERAS — BACA DULU SEBELUM MULAI

1. **JANGAN ubah, hapus, atau tulis ulang apapun di folder monolith lama** (`ASHIRAHv2-main`).
   Folder itu hanya boleh dibaca sebagai referensi/sumber logic & komponen.
2. **`frontend-customer` — DILARANG KERAS mengubah tampilan/layout/desain halaman yang sudah ada.**
   Ini adalah aturan paling penting di seluruh prompt ini. Detail lengkap ada di §A.
3. **`frontend-admin` — bebas dirapikan/diubah strukturnya**, termasuk konversi
   `"use client"` yang tidak perlu jadi Server Component, karena admin akan dibangun
   dari struktur baru dan tidak ada tuntutan mempertahankan tampilan lama.
4. Jika ada bagian dari prompt ini yang ambigu atau informasi yang dibutuhkan tidak
   ditemukan di monolith lama — **STOP dan tanyakan ke user**, jangan menebak atau
   berasumsi. Jangan berhalusinasi kolom database, nama env var, atau struktur endpoint
   yang tidak disebutkan eksplisit di prompt ini.
5. Belum perlu implementasi logic bisnis penuh di tahap ini — fokus scaffolding:
   struktur folder, skeleton handler/component kosong (return placeholder / TODO),
   koneksi dasar (DB, auth middleware, fetch wrapper). Logic penuh dipindah di fase
   berikutnya, satu per satu domain.

---

## A. KONTRAK KHUSUS UNTUK `frontend-customer` (WAJIB DIPATUHI)

`frontend-customer` sudah punya desain/tampilan yang sudah bagus dan **tidak boleh
berubah secara visual**. Yang boleh diubah HANYA lapisan data-access di baliknya:

**BOLEH diubah:**
- `lib/supabase/queries.ts` dan `lib/supabase/queries-server.ts` → dipindah/diganti
  jadi pemanggilan ke `lib/api/*` (fetch wrapper ke `backend-go`), karena data access
  sekarang lewat Go, bukan langsung ke Supabase dari Next.js.
- File-file di `lib/api/` — baru, murni logic fetch, tidak ada tampilan.
- `middleware.ts` — boleh ditambah/disesuaikan (minimal, hanya untuk session refresh,
  BUKAN untuk proteksi halaman customer yang memang publik).
- Route handler internal seperti `auth/callback/route.ts` — tetap ada karena ini
  bagian dari flow OAuth Next.js, tidak berhubungan dengan tampilan.

**TIDAK BOLEH diubah:**
- Struktur JSX/markup, className, styling (Tailwind classes), urutan section, atau
  komponen visual apapun di `components/sections/`, `components/layout/`,
  `components/chatbot/`, `components/order/`, `components/marketer/`.
- Copy/teks yang ditampilkan ke user.
- Behavior UX yang sudah ada (animasi, transisi, validasi form di sisi client, dsb).
- File `components/ui/` (shadcn/ui) — copy apa adanya dari project lama, jangan
  di-restyle atau upgrade versi.

**Cara kerja yang benar:**
Komponen yang saat ini memanggil function dari `queries.ts` (misal
`getOrderByOrderNumber()`, `getServices()`) HARUS tetap punya interface/return type
yang sama persis (nama field, bentuk objek), hanya *implementasi di dalamnya* yang
berubah dari "query Supabase langsung" menjadi "fetch ke backend-go lalu return data
yang sudah di-mapping ke bentuk yang sama". Dengan begitu, komponen React yang
memanggilnya sama sekali tidak perlu tahu ada perubahan di baliknya, dan tampilan
tidak akan berubah.

Jika saat scaffolding kamu (Claude Code) menemukan bahwa sebuah komponen visual
**harus** diubah untuk bisa terhubung ke backend baru (misal ada logic fetching yang
menyatu dengan JSX di satu file client component), ikuti ATURAN KEPUTUSAN berikut —
JANGAN tanya balik ke user untuk kasus ini, langsung putuskan sesuai aturan:

**Default: Opsi A — biarkan inline dulu, JANGAN refactor sekarang.**
Copy komponen apa adanya (termasuk fetch/query lama di dalamnya kalau ada), catat di
`SCAFFOLD_REPORT.md` bagian "Komponen Perlu Refactor Data-Layer (Fase Berikutnya)"
lengkap dengan: nama file, kenapa dianggap problematik (misal: fetch Supabase
langsung nyatu dengan JSX, gak ada pemisahan data-layer), dan endpoint Go pengganti
yang seharusnya dipakai nanti. Backend Go & endpoint barunya tetap dibuat penuh di
fase ini — hanya *penyambungannya* ke komponen itu yang ditunda.

**Kecualian — boleh Opsi B (refactor sekarang) HANYA JIKA SEMUA syarat ini terpenuhi:**
1. Komponen adalah Server Component (bukan `"use client"`).
2. Fetching terjadi di baris terpisah dari JSX (misal `const data = await
   getX()` di atas, lalu `data` di-pass ke JSX di bawah tanpa logic tambahan) —
   BUKAN fetching yang bercampur dengan conditional rendering atau state client.
3. Mengganti sumber data TIDAK mengubah struktur/isi objek yang di-return (interface
   sama persis seperti disebutkan di §A) — sehingga JSX di bawahnya tidak perlu
   disentuh sama sekali.

Kalau ragu salah satu syarat terpenuhi atau tidak → default ke Opsi A. Prioritas
utama fase ini adalah tidak merusak apapun yang dirasakan customer; refactor presisi
lebih aman dikerjakan satu-per-satu di fase terpisah setelah backend Go stabil,
bukan bersamaan dengan scaffolding 3 repo sekaligus.

---

## B. KEPUTUSAN YANG SUDAH DIKONFIRMASI (jangan tanyakan ulang, ini final)

### B.1 — Track Order
- `/track/[orderId]` di frontend-customer **HANYA untuk public order** (order yang
  dibuat lewat `/api/public-order` lama / `POST /v1/public/orders` baru — yaitu order
  dengan `customer_id = null` dan `customer_email`/`customer_whatsapp` terisi).
- Order yang dibuat lewat dashboard (customer login, `customer_id` terisi) **tidak**
  diakses lewat `/track/[orderId]`. Customer login melihat order mereka lewat halaman
  dashboard customer (lihat catatan di §B.1.1 — perlu dicek apakah halaman ini sudah
  ada di monolith lama).
- Endpoint baru: `POST /v1/track/lookup`
  - Body: `{ "orderId": string, "contact": string }` (contact = email ATAU whatsapp)
  - Logic di Go: cari order by `order_number`. Jika order punya `customer_id` terisi
    (bukan public order) → selalu return "not found" di endpoint ini (karena memang
    bukan jalurnya). Jika `customer_email`/`customer_whatsapp` terisi → cocokkan
    `contact` terhadap salah satu dari dua kolom itu pakai constant-time comparison.
  - Response gagal HARUS seragam untuk semua kasus (order tidak ada / contact salah /
    order bukan public order) — jangan bocorkan informasi mana yang salah.
  - WAJIB rate-limited (contoh: 5 percobaan/menit per kombinasi IP+orderId).
  - Method **POST**, bukan GET, supaya `contact` tidak masuk ke URL/access log.

### B.1.1 — Yang perlu dicek Claude Code di monolith lama (bagian dari scaffolding)
Cek apakah ada halaman "Order Saya" / dashboard untuk customer yang login di
`ASHIRAHv2-main` (bukan admin dashboard, tapi customer-facing). Jika **tidak ada**,
catat ini di `SCAFFOLD_REPORT.md` sebagai gap yang perlu diisi — buatkan skeleton
kosong `app/(auth)/orders/page.tsx` (atau path yang sesuai konvensi project) di
`frontend-customer` sebagai placeholder, JANGAN buat desain baru, cukup skeleton
dengan komentar `// TODO: implementasi halaman order customer login`.

### B.2 — Dependency mati
Package berikut **TIDAK ikut dimigrasi** ke `package.json` manapun (di ketiga repo):
- `@google/genai`
- `@google/generative-ai`
- `@react-pdf/renderer`
- `jspdf`
- Folder `Ashirahh-main/` (sub-project duplikat lama) — jangan disentuh atau dicopy.
- `components/admin/admin-dashboard.tsx`, `components/admin/admin-login.tsx` — versi
  lama, tidak ikut dicopy ke `frontend-admin` (akan dibuat versi baru dari struktur di §7).

Verifikasi ini sudah dilakukan lewat grep di monolith lama: 0 import statement untuk
kedua package Google AI di seluruh codebase. AI chatbot & negotiate memakai Groq API
langsung via `fetch()`, bukan Google AI SDK.

### B.3 — Chatbot & Negotiate
- Tetap **stateless**, sama seperti implementasi lama.
- `backend-go` berfungsi sebagai proxy ke Groq API (`model: llama-3.3-70b-versatile`),
  BUKAN reimplementasi ulang logic AI.
- **TIDAK perlu** session storage tambahan (Redis/DB) untuk `ai_session_id` — kolom
  ini di tabel `orders` tetap ada sebagai data pasif (disimpan, tidak dibaca ulang
  untuk resume session), tidak perlu logic baru untuk itu.
- History percakapan tetap dikirim penuh dari client di setiap request (`messages[]`
  array), persis seperti behavior lama.
- Trigger parsing (`[SHOW_DETAIL_FORM]`, `[DEAL_CONFIRMED]`, `[DEAL_REJECTED]`) tetap
  dipertahankan sebagai bagian dari response text parsing di Go handler.

### B.4 — Public Order
- Tetap porting ke Go: `POST /v1/public/orders`.
- **Tambahan baru** (belum ada di versi lama): `POST /v1/public/orders/upload-url`
  untuk generate signed upload URL ke Supabase Storage. Frontend upload file besar
  langsung ke Supabase Storage dari browser (tidak lewat Go serverless function),
  baru kirim path file hasil upload ke `POST /v1/public/orders`.
- RLS policy anon insert di Supabase tetap harus berfungsi seperti sebelumnya.

### B.5 — Router Go
Gunakan **chi** (`github.com/go-chi/chi/v5`), bukan gin. Alasan: proyek jalan sebagai
serverless function tunggal di Vercel (`api/index.go` catch-all) — chi lebih ringan
untuk cold-start, dan skala endpoint (~15 route REST sederhana, JSON in/out) tidak
butuh fitur besar gin (binding otomatis, render engine, dsb). Middleware ditulis
sebagai `http.Handler` standar, dipasang lewat `r.Use(...)` di chi router.

### B.6 — Middleware `frontend-customer`
HANYA session refresh — panggil `updateSession()` dari `lib/supabase/middleware.ts`
di root `middleware.ts`. **TIDAK ADA** proteksi edge/redirect berbasis auth di
`frontend-customer`. Semua halaman `(public)/` memang publik. `/track/[orderId]`
diverifikasi di level API call (`POST /v1/track/lookup`), bukan di level route —
halamannya sendiri boleh diakses siapa saja. Proteksi edge yang ketat (redirect
sebelum render, cek role) HANYA untuk `frontend-admin` (lihat §F poin 1).

### B.7 — 4 Komponen dengan Inline Fetch/Supabase — Keputusan Per Komponen
Empat komponen ini punya logic fetch/Supabase yang menyatu dengan JSX. Keputusan
TIDAK seragam — masing-masing dinilai berdasarkan tingkat perubahan kontrak yang
sebenarnya diperlukan, bukan dipukul rata A atau B:

**1. `components/Chatbot.tsx`** → **Opsi A + 1 perubahan wajib (bukan refactor)**
- Copy struktur inline apa adanya (JANGAN dipindah ke `lib/api/chat.ts`).
- WAJIB ganti target URL `fetch('/api/chat')` → `` `${process.env.NEXT_PUBLIC_API_URL}/v1/chat` `` — ini bukan refactor, hanya ganti 1 string, karena endpoint lama tidak akan ada lagi setelah migrasi.
- Response shape dari Go (`message`, `showDetailForm`, `isDealConfirmed`, `isDealRejected`, `dealData`) SAMA PERSIS dengan lama (§B.3) — tidak ada logic parsing di komponen yang perlu diubah.
- Tampilan/behavior chatbot tidak berubah sama sekali dari sisi customer.

**2. `components/order/order-form.tsx`** → **Campuran A dan B, per bagian fetch**
- Fetch ke **negotiate** (2x panggilan negotiate dalam komponen ini) → **Opsi A**: cukup ganti URL ke `${NEXT_PUBLIC_API_URL}/v1/negotiate`, tidak ada perubahan kontrak.
- Fetch untuk **upload file & submit order** → **Opsi B (wajib direfactor)**: alasan bukan preferensi tapi keharusan arsitektural — flow lama (submit langsung ke `/api/public-order` dengan file) tidak kompatibel dengan flow baru (§4 & §B.4: harus minta signed upload URL dulu via `POST /v1/public/orders/upload-url`, upload langsung ke Supabase Storage dari browser, baru kirim path file ke `POST /v1/public/orders`). Kalau bagian ini tidak direfactor, order TIDAK AKAN PERNAH BERHASIL submit di arsitektur baru.
- Refactor pada poin ini HANYA pada logic fetch/upload, JSX form/validasi/step wizard/styling TIDAK BOLEH diubah.

**3. `components/header.tsx`** → **Wajib diperbaiki sekarang (bug fix, bukan pilihan A/B)**
- Ini bukan soal migrasi ke Go, tapi bug existing: `createClient()` + logic auth manual di header itu duplikat dari `contexts/auth-context.tsx`, berisiko state auth di header dan di context tidak sinkron.
- Perbaikan: ganti logic auth manual dengan `useAuth()` dari `auth-context.tsx` yang sudah ada. HANYA ganti sumber data auth, JSX/tampilan header (logo, menu, tombol login/logout, dsb) TIDAK BOLEH berubah sama sekali.
- Ini sejalan dengan prinsip "customer tidak diribetkan": user tidak akan melihat perbedaan apapun, tapi bug tersembunyi hilang.

**4. `components/admin-sidebar.tsx`** → **Opsi B, bebas direfactor (area admin)**
- Sesuai kesepakatan §ATURAN KERAS poin 3, admin bebas dirapikan.
- Ganti Supabase Realtime subscription dengan **polling** (interval 15-30 detik) ke endpoint dashboard/notification yang sesuai — BUKAN Server-Sent Events (SSE). Alasan: SSE butuh koneksi long-lived yang tidak cocok untuk Go serverless function di Vercel (ada timeout eksekusi function), sedangkan polling jauh lebih sederhana untuk skeleton fase ini dan cukup untuk use-case live badge notification yang tidak butuh real-time ketat. Bisa di-upgrade ke SSE nanti jika diperlukan.

---

## C. PEMETAAN ENDPOINT LENGKAP (referensi wajib, jangan menebak endpoint lain)

### C.1 — Endpoint migrasi dari lama
| # | Endpoint Lama | Endpoint Baru (Go) | Auth |
|---|---|---|---|
| 1 | `POST /api/chat` | `POST /v1/chat` | Public (rate-limit) |
| 2 | `POST /api/negotiate` | `POST /v1/negotiate` | Public (rate-limit) |
| 3 | `POST /api/notify` | `POST /v1/internal/notify` | Header `X-Internal-Secret` |
| 4 | `POST /api/orders` | `POST /v1/admin/orders` | JWT + role=admin |
| 5 | `POST /api/public-order` | `POST /v1/public/orders` | Public |
| 6 | `POST /api/webhook` | `POST /v1/webhooks/n8n` | Bearer token (existing) |
| 7 | `GET /auth/callback` | Tetap di masing-masing frontend (`frontend-customer` & `frontend-admin` masing-masing punya route sendiri) | — |

### C.2 — Endpoint baru (dari data-access layer lama)
| Endpoint | Method | Auth |
|---|---|---|
| `/v1/services` | GET | Public |
| `/v1/admin/services` | GET, POST | JWT + admin |
| `/v1/admin/services/:id` | GET, PUT, DELETE | JWT + admin |
| `/v1/admin/orders` | GET | JWT + admin |
| `/v1/admin/orders/:id` | GET, PATCH | JWT + admin |
| `/v1/track/lookup` | POST | Public + verifikasi orderId+contact (lihat §B.1) |
| `/v1/public/orders/upload-url` | POST | Public |
| `/v1/admin/invoices` | GET, POST | JWT + admin |
| `/v1/admin/invoices/:id` | GET | JWT + admin |
| `/v1/admin/dashboard/stats` | GET | JWT + admin |
| `/v1/admin/dashboard/revenue` | GET | JWT + admin |

---

## D. STRUKTUR FOLDER

### D.1 — `backend-go`
```
backend-go/
├── api/
│   └── index.go
├── internal/
│   ├── handler/
│   │   ├── chat_handler.go
│   │   ├── negotiate_handler.go
│   │   ├── order_handler.go
│   │   ├── invoice_handler.go
│   │   ├── service_handler.go
│   │   ├── dashboard_handler.go
│   │   ├── webhook_handler.go
│   │   ├── notify_handler.go
│   │   └── track_handler.go
│   ├── service/
│   ├── repository/
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── role.go
│   │   ├── cors.go
│   │   ├── internal_secret.go
│   │   └── rate_limit.go
│   ├── model/
│   └── config/
├── go.mod
├── go.sum
└── vercel.json
```

### D.2 — `frontend-customer` (struktur TIDAK berubah dari existing — ini acuan, bukan perintah membuat baru dari nol; sinkronkan 1:1 dengan monolith lama)
```
frontend-customer/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── apparel/page.tsx
│   │   ├── community/page.tsx
│   │   ├── join-marketer/page.tsx
│   │   ├── order/page.tsx
│   │   ├── portfolio/page.tsx
│   │   └── layout.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── track/[orderId]/page.tsx
│   ├── auth/callback/route.ts
│   ├── layout.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   ├── chatbot/          # dynamic import, ssr:false — WAJIB dipertahankan
│   ├── order/            # dynamic import — WAJIB dipertahankan
│   └── marketer/
├── lib/
│   ├── supabase/          # client + auth helper SAJA, bukan queries
│   ├── api/               # BARU — fetch wrapper ke backend-go
│   └── utils/
└── middleware.ts
```

### D.3 — `frontend-admin`
```
frontend-admin/
├── app/
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   ├── orders/[id]/page.tsx
│   │   ├── invoices/page.tsx
│   │   ├── invoices/new/page.tsx
│   │   ├── invoices/[id]/page.tsx
│   │   ├── services/page.tsx
│   │   ├── services/new/page.tsx
│   │   ├── services/[id]/edit/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── (auth)/login/page.tsx
│   ├── auth/callback/route.ts
│   ├── layout.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   └── admin/
├── lib/
│   ├── supabase/
│   ├── api/
│   └── utils/
└── middleware.ts    # BARU — proteksi edge untuk semua /admin/*
```

---

## E. ENVIRONMENT VARIABLES (jangan tambah/kurangi sendiri)

| Variable | backend-go | frontend-customer | frontend-admin |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | — | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | — | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | — | — |
| `SUPABASE_DB_POOLER_URL` | ✅ | — | — |
| `GROQ_API_KEY` | ✅ | — | — |
| `N8N_WEBHOOK_URL`, `N8N_DEAL_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET` | ✅ | — | — |
| `INTERNAL_API_SECRET` | ✅ | — | — |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `ADMIN_EMAIL` | ✅ | — | — |
| `NEXT_PUBLIC_APP_URL` | — | ✅ | ✅ |
| `NEXT_PUBLIC_API_URL` | — | ✅ | ✅ |
| `ALLOWED_ORIGINS` | ✅ | — | — |

---

## F. TEMUAN KEAMANAN YANG WAJIB DIPERBAIKI DI ARSITEKTUR BARU

1. `/admin/*` tidak diproteksi di edge (hanya redirect client-side) → wajib
   `middleware.ts` baru di `frontend-admin`.
2. `POST /api/orders` lama tidak verifikasi role → wajib middleware auth + role-check
   di Go untuk `/v1/admin/orders`.
3. `POST /api/notify` lama tidak ada auth sama sekali → wajib header
   `X-Internal-Secret` di `/v1/internal/notify`.
4. Duplikasi query logic (`queries.ts` vs `queries-server.ts`) → hilang karena semua
   data access pindah ke backend-go (lihat aturan khusus §A untuk cara migrasinya
   tanpa merusak tampilan).

---

## G. TUGAS UNTUK CLAUDE CODE — LANGKAH EKSEKUSI

1. Baca seluruh isi monolith lama (`ASHIRAHv2-main`) sebagai referensi read-only.
2. Buat 3 folder terpisah: `backend-go`, `frontend-customer`, `frontend-admin`,
   sesuai struktur di §D.
3. **`backend-go`**: inisialisasi go module dengan router **chi** (`github.com/go-chi/chi/v5`,
   lihat §B.5), setup router tunggal di `api/index.go`, koneksi Supabase Postgres via
   pooler (Transaction mode), skeleton middleware (auth JWT, role check, CORS,
   internal secret, rate limit), skeleton handler kosong untuk semua endpoint di §C
   (return placeholder JSON + TODO comment, belum perlu logic penuh).
4. **`frontend-customer`**: copy struktur & SEMUA isi komponen visual apa adanya dari
   monolith lama (lihat aturan wajib di §A — JANGAN ubah tampilan). Ganti hanya
   lapisan data-access (`queries.ts`/`queries-server.ts` → `lib/api/*`). Root
   `middleware.ts` HANYA session refresh, tanpa proteksi edge (§B.6). Cek dan laporkan
   soal halaman "Order Saya" sesuai §B.1.1. Untuk 4 komponen dengan inline
   fetch/Supabase (`Chatbot.tsx`, `order-form.tsx`, `header.tsx`, `admin-sidebar.tsx`),
   ikuti keputusan spesifik per komponen di **§B.7** — JANGAN pukul rata satu opsi
   untuk semua, tiap komponen punya perlakuan berbeda yang sudah ditentukan.
5. **`frontend-admin`**: buat struktur baru sesuai §D.3, boleh dirapikan dari versi
   lama (termasuk konversi `"use client"` yang tidak perlu). WAJIB buat
   `middleware.ts` proteksi edge yang sebelumnya tidak ada (redirect ke `/login` jika
   belum auth/role != admin, dicek sebelum render — lihat temuan keamanan §F poin 1).
6. Jangan copy dependency/file yang masuk daftar mati di §B.2.
7. Jika ada informasi yang dibutuhkan tapi tidak ditemukan atau ambigu — jangan
   menebak, tulis di `SCAFFOLD_REPORT.md` bagian "Perlu Keputusan Tambahan" dan
   lanjutkan ke bagian lain.
8. Setelah selesai, buat `SCAFFOLD_REPORT.md` berisi:
   - Apa saja yang sudah dibuat per repo
   - Daftar file yang di-skip/dead code yang tidak dicopy
   - Bagian "Perlu Keputusan Tambahan" (jika ada)
   - Langkah selanjutnya untuk mulai memindahkan logic penuh dari monolith lama ke
     `backend-go` (per domain: chat, negotiate, order, invoice, service, dashboard,
     webhook, notify, track)

Jangan sentuh atau ubah project monolith yang lama.
