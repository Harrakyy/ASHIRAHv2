"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1c2143' }}>
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-3xl font-bold" style={{ color: '#D4AF37' }}>Ashira.co</span>
        </div>

        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212,175,55,0.15)' }}>
            <AlertTriangle className="w-12 h-12" style={{ color: '#D4AF37' }} />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#ffffff' }}>
          Terjadi Kesalahan
        </h1>
        <p className="mb-8" style={{ color: '#9ca3af' }}>
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau kembali ke beranda.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={() => router.back()}
            style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={reset}
            style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
          >
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
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