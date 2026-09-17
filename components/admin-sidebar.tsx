"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Package,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function useAdminBadges() {
  const supabase = createClient()
  const [badges, setBadges] = useState({
    orders: 0,
    invoices: 0,
  })

  const fetchBadges = async () => {
    try {
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      const { count: invoicesCount } = await supabase
        .from("invoices")
        .select("*", { count: "exact", head: true })
        .eq("status", "unpaid")

      setBadges({
        orders: ordersCount || 0,
        invoices: invoicesCount || 0,
      })
    } catch (error) {
      console.error("Error fetching badges:", error)
    }
  }

  useEffect(() => {
    fetchBadges()

    const channel = supabase
      .channel("admin-badges")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetchBadges)
      .on("postgres_changes", { event: "*", schema: "public", table: "invoices" }, fetchBadges)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return badges
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: ShoppingBag, label: "Pesanan", href: "/admin/orders", badge: "orders" },
  { icon: FileText, label: "Invoice", href: "/admin/invoices", badge: "invoices" },
  { icon: Package, label: "Layanan", href: "/admin/services" },
  { icon: BarChart2, label: "Laporan", href: "/admin/reports" },
  { icon: Settings, label: "Pengaturan", href: "/admin/settings" },
]

function AdminSidebarInner() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const badges = useAdminBadges()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const getBadgeCount = (badgeKey: string) => {
    if (badgeKey === "orders") return badges.orders
    if (badgeKey === "invoices") return badges.invoices
    return 0
  }

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">Ashira.co.</span>
          <span className="text-xs bg-[#BEFF47] text-black px-2 py-0.5 rounded-full">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          const badgeCount = item.badge ? getBadgeCount(item.badge) : 0

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[#BEFF47] text-black"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="bg-yellow-400 text-gray-900 text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] text-center font-bold">
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#BEFF47] text-black">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar
        </Button>
      </div>
    </>
  )
}

export function AdminSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-slate-100 hidden md:flex flex-col",
        className
      )}
    >
      <AdminSidebarInner />
    </aside>
  )
}

export function AdminSidebarSheetContent({ className }: { className?: string }) {
  return (
    <div className={cn("h-full w-full bg-slate-900 text-slate-100 flex flex-col", className)}>
      <AdminSidebarInner />
    </div>
  )
}
