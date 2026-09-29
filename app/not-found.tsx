"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="ashira-dark-gradient flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <Link
          href="/"
          aria-label="ASHIRA Group — Beranda"
          className="ashira-silver-gradient inline-flex items-center gap-1 rounded-full px-5 py-2 text-[13px] leading-none"
        >
          <span className="font-bold tracking-wide text-ashira-navy">ASHIRA</span>
          <span className="text-ashira-muted">Group</span>
        </Link>

        <p className="ashira-silver-text mt-10 select-none text-[120px] font-bold leading-none tracking-[-0.04em] sm:text-[150px]">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-white">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-[#D9D9D9]">Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
          <Link
            href="/"
            className="ashira-silver-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-ashira-navy"
          >
            <Home className="h-4 w-4" /> Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
