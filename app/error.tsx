"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react"

const outlineButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/50 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:border-white hover:bg-white/10"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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

        <div className="mx-auto mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          <AlertTriangle className="h-10 w-10 text-white" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white">Terjadi Kesalahan</h1>
        <p className="mt-3 text-[#D9D9D9]">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau kembali ke beranda.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => router.back()} className={outlineButton}>
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>
          <button type="button" onClick={reset} className={outlineButton}>
            <RefreshCw className="h-4 w-4" /> Coba Lagi
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
