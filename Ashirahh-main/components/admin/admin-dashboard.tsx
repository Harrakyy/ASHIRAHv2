"use client"

import { useState } from "react"
import Image from "next/image"
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  LogOut,
  FileText,
  ChevronDown,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminDashboardProps {
  onLogout: () => void
}

// Sample data - in production, this would come from a database
const sampleOrders = [
  {
    id: "ASH/K-2026-001",
    marketer: "Direct",
    client: "Budi Santoso",
    item: "Jersey Futsal",
    qty: 25,
    stage: "Cutting",
    total: "Rp 1.875.000",
  },
  {
    id: "ASH/K-2026-002",
    marketer: "Zafira",
    client: "HIMA Teknik IPB",
    item: "Varsity Jacket",
    qty: 50,
    stage: "Sewing",
    total: "Rp 9.000.000",
  },
  {
    id: "ASH/K-2026-003",
    marketer: "Direct",
    client: "PT. ABC",
    item: "Work Jacket",
    qty: 100,
    stage: "QC",
    total: "Rp 15.000.000",
  },
  {
    id: "ASH/K-2026-004",
    marketer: "Adithia",
    client: "Event Organizer",
    item: "T-Shirt Event",
    qty: 500,
    stage: "Shipping",
    total: "Rp 25.000.000",
  },
]

const stages = ["Cutting", "Sewing", "QC", "Shipping", "Completed"]

const monthlyRevenue = [
  { month: "Jan", revenue: 15000000 },
  { month: "Feb", revenue: 22000000 },
  { month: "Mar", revenue: 18000000 },
  { month: "Apr", revenue: 28000000 },
  { month: "May", revenue: 35000000 },
  { month: "Jun", revenue: 42000000 },
]

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [orders, setOrders] = useState(sampleOrders)
  const [activeTab, setActiveTab] = useState("orders")

  const handleStageChange = (orderId: string, newStage: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, stage: newStage } : order
    ))
  }

  const generateInvoice = (order: typeof sampleOrders[0]) => {
    // In production, this would generate a PDF
    const invoiceContent = `
INVOICE - ${order.id}
========================
ASHIRA'H.CO
PT. ASHIRA NIAGA INDONESIA
Grand Batavia Arcade, Tangerang

Client: ${order.client}
Item: ${order.item}
Quantity: ${order.qty} pcs
Total: ${order.total}

Status: ${order.stage}
------------------------
Email: ashira.hco@ashira.com
    `
    alert(invoiceContent)
  }

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue))

  return (
    <div className="min-h-screen bg-[#f0f7f7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1c2143] min-h-screen p-6 hidden lg:block">
        <div className="mb-8">
          <Image
            src="/images/ashira-corporate-logo.png"
            alt="ASHIRA"
            width={120}
            height={40}
            className="mb-2"
          />
          <p className="text-white/40 text-xs">Admin Dashboard</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
              activeTab === "orders" 
                ? "bg-[#D4AF37]/20 text-[#D4AF37]" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Package className="w-5 h-5" />
            Production Status
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
              activeTab === "finance" 
                ? "bg-[#D4AF37]/20 text-[#D4AF37]" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <DollarSign className="w-5 h-5" />
            Financial Overview
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
              activeTab === "inventory" 
                ? "bg-[#D4AF37]/20 text-[#D4AF37]" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Inventory Level
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif text-foreground">
              {activeTab === "orders" && "Production Status"}
              {activeTab === "finance" && "Financial Overview"}
              {activeTab === "inventory" && "Inventory Level"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your orders and track production
            </p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="lg:hidden"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1c2143]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Marketer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-mono text-[#D4AF37]">
                        {order.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {order.marketer}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {order.client}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {order.item}
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {order.qty} pcs
                      </td>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <select
                            value={order.stage}
                            onChange={(e) => handleStageChange(order.id, e.target.value)}
                            className="appearance-none bg-gray-100 border border-gray-200 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                          >
                            {stages.map(stage => (
                              <option key={stage} value={stage}>{stage}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-foreground">
                        {order.total}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => generateInvoice(order)}
                          className="flex items-center gap-1 text-[#1c2143] hover:text-[#D4AF37] text-sm transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="hidden md:inline">Generate</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Finance Tab */}
        {activeTab === "finance" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border p-6">
                <p className="text-muted-foreground text-sm mb-1">Total Revenue (YTD)</p>
                <p className="text-2xl font-serif text-foreground">Rp 160.000.000</p>
              </div>
              <div className="bg-white rounded-lg border p-6">
                <p className="text-muted-foreground text-sm mb-1">Pending Payments</p>
                <p className="text-2xl font-serif text-foreground">Rp 25.000.000</p>
              </div>
              <div className="bg-white rounded-lg border p-6">
                <p className="text-muted-foreground text-sm mb-1">Active Orders</p>
                <p className="text-2xl font-serif text-foreground">{orders.length}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-medium text-foreground mb-6">Monthly Revenue</h3>
              <div className="flex items-end gap-4 h-48">
                {monthlyRevenue.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-t transition-all hover:opacity-80"
                      style={{ 
                        height: `${(data.revenue / maxRevenue) * 100}%`,
                        background: 'linear-gradient(to top, #1c2143, #D4AF37)'
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Cotton 24s", stock: 500, unit: "meters" },
              { name: "Jersey Print", stock: 300, unit: "meters" },
              { name: "Canvas", stock: 200, unit: "meters" },
              { name: "Cotton Fleece", stock: 150, unit: "meters" },
              { name: "American Drill", stock: 400, unit: "meters" },
              { name: "Polyflex", stock: 50, unit: "rolls" },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg border p-6">
                <p className="text-foreground font-medium mb-2">{item.name}</p>
                <p className="text-3xl font-serif text-[#1c2143]">{item.stock}</p>
                <p className="text-muted-foreground text-sm">{item.unit}</p>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${Math.min(item.stock / 5, 100)}%`,
                      backgroundColor: item.stock > 200 ? '#2B7A78' : item.stock > 100 ? '#D4AF37' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
