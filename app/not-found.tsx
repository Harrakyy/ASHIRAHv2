"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1c2143' }}>
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-3xl font-bold" style={{ color: '#D4AF37' }}>Ashira.co</span>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-[150px] font-bold leading-none select-none" style={{ color: 'rgba(212,175,55,0.15)' }}>
            404
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>
          Halaman tidak ditemukan
        </h1>
        <p className="mb-8" style={{ color: '#9ca3af' }}>
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" className="gap-2" onClick={() => router.back()} style={{ borderColor: '#D4AF37', color: '#D4AF37' }}>
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <Button asChild className="gap-2" style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}>
            <Link href="/">
              <Home className="h-4 w-4" />
              Ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
