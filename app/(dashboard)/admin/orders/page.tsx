"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrders, type Order } from "@/lib/supabase/queries"
import { ArrowLeft, Eye, MapPin, Loader2 } from "lucide-react"

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:     { label: "Menunggu",  color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  in_progress: { label: "Dikerjakan", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  review:      { label: "Review",    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  revision:    { label: "Revisi",    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" },
  completed:   { label: "Selesai",   color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  cancelled:   { label: "Dibatalkan", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
}

const filterOptions = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "Dikonfirmasi" },
  { value: "review", label: "Produksi" },
  { value: "completed", label: "Pengiriman" },
  { value: "cancelled", label: "Selesai" },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders()
        setOrders(data as Order[])
        setFilteredOrders(data as Order[])
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadOrders()
  }, [])

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(o => o.status === activeFilter))
    }
  }, [activeFilter, orders])

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1c2143' }}>Semua Pesanan</h1>
          <p className="text-muted-foreground">Kelola semua pesanan dari pelanggan</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === opt.value
                ? "bg-[#1c2143] text-white"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {activeFilter === "all" ? "Belum ada pesanan" : "Tidak ada pesanan dengan status ini"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">No. Pesanan</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Pelanggan</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Layanan</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Harga</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="text-left p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900">
                    <td className="p-4 font-mono text-sm text-gray-900 dark:text-gray-100">{order.order_number}</td>
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100">{order.customer?.full_name || order.customer?.email || "–"}</td>
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100">{order.service?.nama || "–"}</td>
                    <td className="p-4 text-sm text-gray-900 dark:text-gray-100">Rp {(order.price || 0).toLocaleString("id-ID")}</td>
                    <td className="p-4">
                      <Badge className={statusConfig[order.status]?.color}>
                        {statusConfig[order.status]?.label || order.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                        </Link>
                        <Link href={`/track/${order.order_number}`}>
                          <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                            <MapPin className="h-4 w-4 mr-1" />
                            Lacak
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
