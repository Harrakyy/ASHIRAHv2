"use client"

import { useState } from "react"
import Image from "next/image"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AdminLoginProps {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - in production, use proper authentication
    if (password === "ashira2024") {
      onLogin()
    } else {
      setError("Invalid password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c2143] px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Image
            src="/images/ashira-corporate-logo.png"
            alt="ASHIRA GROUP"
            width={150}
            height={50}
            className="mx-auto mb-6"
          />
          <h1 className="font-serif text-2xl text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/60 text-sm">Enter password to access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError("") }}
              placeholder="Enter password"
              className="bg-[#0a0d1a] border-[#C0C0C0]/20 text-white pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full rounded-full"
            style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
          >
            Access Dashboard
          </Button>
        </form>
      </div>
    </div>
  )
}
