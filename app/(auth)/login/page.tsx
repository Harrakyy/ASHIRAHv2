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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1c2143' }}>
      <div className="w-full max-w-sm rounded-2xl p-8" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight" style={{ color: '#1c2143' }}>
            Ashira.co
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1c2143' }}>Selamat Datang</h1>
          <p className="mt-1" style={{ color: '#6b7280' }}>
            Masuk ke akun Ashira.co Anda
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
                style={{ borderColor: '#d1d5bb3' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
            className="w-full rounded-xl h-11 font-medium"
            style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
          >
            {isLoading ? <Spinner className="h-4 w-4" /> : "Masuk"}
          </Button>

          <div className="text-center">
            <Link href="#" className="text-sm" style={{ color: '#6b7280' }}>
              Lupa password?
            </Link>
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