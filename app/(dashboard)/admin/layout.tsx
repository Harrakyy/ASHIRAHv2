"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AdminSidebar, AdminSidebarSheetContent } from "@/components/admin-sidebar"
import { AdminNotifications } from "@/components/admin-notifications"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && typeof window !== "undefined") {
      if (!user) {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1c2143' }}>
        <div style={{ color: '#D4AF37' }}>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1c2143' }}>
        <div style={{ color: '#D4AF37' }}>Checking access...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c2143', color: '#ffffff' }}>
      <AdminSidebar />

      <header className="fixed top-0 left-0 md:left-64 right-0 z-30 h-16 flex items-center justify-between md:justify-end gap-2 px-4 md:px-6" style={{ backgroundColor: '#1c2143', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="md:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open admin menu" style={{ color: '#ffffff' }}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Admin Menu</SheetTitle>
              </SheetHeader>
              <AdminSidebarSheetContent />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ color: '#D4AF37' }}
          >
            <Sun className="h-5 w-5" />
            <Moon className="absolute h-5 w-5" style={{ display: theme === 'dark' ? 'block' : 'none' }} />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <AdminNotifications />
        </div>
      </header>

      <main className="ml-0 md:ml-64 pt-16 min-h-screen" style={{ backgroundColor: '#f0f7f7' }}>
        {children}
      </main>

      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          classNames: {
            success: "bg-green-50 border-green-200 text-green-800",
            error: "bg-red-50 border-red-200 text-red-800",
            info: "bg-blue-50 border-blue-200 text-blue-800",
          }
        }}
      />
    </div>
  )
}