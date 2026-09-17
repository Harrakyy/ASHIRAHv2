"use client"

import * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  name: string
  email: string
  whatsapp?: string
  role: "admin" | "customer"
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const supabase = createClient()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const mapProfile = (profile: any): User => ({
    id: profile.id,
    name: profile.full_name || profile.email?.split("@")[0] || "User",
    email: profile.email || "",
    whatsapp: profile.whatsapp || undefined,
    role: profile.role as "admin" | "customer",
  })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user)

          const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, email, whatsapp, role")
            .eq("id", session.user.id)
            .single()

          if (data) {
            const mapped = mapProfile(data)
            setUser(mapped)

            if (event === "SIGNED_IN") {
              router.push("/admin")
            }
          } else {
            console.error("Error fetching profile:", JSON.stringify(error), "code:", error?.code, "msg:", error?.message, "details:", error?.details)
          }
        } else {
          setUser(null)
          setSupabaseUser(null)
        }

        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setIsLoading(false)
      return { error: error.message }
    }

    return {}
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}