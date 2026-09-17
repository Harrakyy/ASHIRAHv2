"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getServices, updateService, deleteService, type Service } from "@/lib/supabase/queries"
import { ArrowLeft, Edit, Trash2, Plus, Loader2, Check, X } from "lucide-react"
import { toast } from "sonner"

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices()
        setServices(data)
      } catch (error) {
        console.error("Error loading services:", error)
        toast.error("Gagal memuat data layanan")
      } finally {
        setIsLoading(false)
      }
    }
    loadServices()
  }, [])

  const handleToggleActive = async (service: Service) => {
    try {
      const updated = await updateService(service.id, { is_active: !service.is_active })
      setServices(prev => prev.map(s => s.id === service.id ? updated : s))
      toast.success(`Layanan ${updated.is_active ? 'diaktifkan' : 'dinonaktifkan'}`)
    } catch (error: any) {
      console.error("Error updating service:", error)
      toast.error(error.message || "Gagal memperbarui status")
    }
  }

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return
    setDeletingId(serviceToDelete.id)
    try {
      await deleteService(serviceToDelete.id)
      setServices(prev => prev.filter(s => s.id !== serviceToDelete.id))
      toast.success("Layanan berhasil dihapus")
    } catch (error: any) {
      console.error("Error deleting service:", error)
      toast.error(error.message || "Gagal menghapus layanan")
    } finally {
      setDeletingId(null)
      setShowDeleteDialog(false)
      setServiceToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div>
              <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1c2143' }}>Layanan</h1>
            <p className="text-muted-foreground">Kelola layanan yang tersedia</p>
          </div>
        </div>
        <Link href="/admin/services/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Layanan Baru
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <div className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Belum ada layanan</p>
          </div>
        ) : (
          services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{service.nama}</CardTitle>
                  <Badge className={service.is_active ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}>
                    {service.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{service.deskripsi || "Tidak ada deskripsi"}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Harga</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Rp {(service.harga || 0).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Estimasi</span>
                  <span className="text-gray-900 dark:text-gray-100">{service.estimasi || "–"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Slots</span>
                  <span className="text-gray-900 dark:text-gray-100">{service.current_slots}/{service.max_slots}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/admin/services/${service.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleActive(service)}
                  >
                    {service.is_active ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Nonaktifkan
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Aktifkan
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(service)}
                    disabled={deletingId === service.id}
                  >
                    {deletingId === service.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Yakin hapus layanan ini?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Layanan <strong>{serviceToDelete.nama}</strong> akan dihapus permanen. Aksi tidak bisa dibatalkan.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDeleteDialog(false)
                  setServiceToDelete(null)
                }}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDeleteConfirm}
                disabled={deletingId === serviceToDelete.id}
              >
                {deletingId === serviceToDelete.id ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
