"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { WHATSAPP_URL } from "@/data/hero-slides"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = await login(email, password)
    if (result.error) {
      setError(result.error === "Invalid login credentials" 
        ? "Email atau password salah" 
        : result.error)
    }
  }

  return (
    <div className="ashira-dark-gradient min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-[28px] border border-white bg-white/95 p-8 shadow-[0_20px_48px_rgba(4,3,13,0.35)]">
        <div className="text-center mb-8">
          <Link
            href="/"
            aria-label="ASHIRA Group — Beranda"
            className="ashira-silver-gradient inline-flex items-center gap-1 rounded-full border border-ashira-navy/10 px-5 py-2 text-[13px] leading-none"
          >
            <span className="font-bold tracking-wide text-ashira-navy">ASHIRA</span>
            <span className="text-ashira-muted">Group</span>
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1c2143' }}>Selamat Datang</h1>
          <p className="mt-1" style={{ color: '#6b7280' }}>
            Masuk ke panel admin ASHIRA Group
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: '#1c2143' }}>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: '#1c2143' }}>Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl pr-10"
                style={{ borderColor: '#d1d5db' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#6b7280' }}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm font-normal" style={{ color: '#4b5563' }}>
              Ingat saya
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="ashira-dark-gradient w-full rounded-full h-11 font-semibold text-white"
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : "Masuk"}
          </Button>

          <div className="text-center">
            {/* Belum ada alur reset password — arahkan ke admin via WhatsApp agar link tidak mati */}
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent("Halo admin ASHIRA, saya lupa password panel admin.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              style={{ color: '#6b7280' }}
            >
              Lupa password? Hubungi admin
            </a>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: '#9ca3af' }}>
            Admin panel — hanya untuk staf ASHIRA
          </p>
        </div>
      </div>
    </div>
  )
}