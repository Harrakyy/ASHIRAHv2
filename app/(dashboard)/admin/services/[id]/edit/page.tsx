"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getServiceById, updateService, type Service } from "@/lib/supabase/queries"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const kategoriOptions = [
  "Website",
  "Mobile App",
  "UI/UX Design",
  "E-Commerce",
  "Landing Page",
  "Other",
]

export default function EditServicePage() {
  const params = useParams()
  const serviceId = params.id as string

  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: 0,
    estimasi: "",
    max_slots: 5,
    current_slots: 0,
    is_active: true,
    kategori: "Website",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadService() {
      try {
        const data = await getServiceById(serviceId)
        setFormData({
          nama: data.nama || "",
          deskripsi: data.deskripsi || "",
          harga: data.harga || 0,
          estimasi: data.estimasi || "",
          max_slots: data.max_slots || 5,
          current_slots: data.current_slots || 0,
          is_active: data.is_active ?? true,
          kategori: (data as any).kategori || "Website",
        })
      } catch (error) {
        console.error("Error loading service:", error)
        toast.error("Gagal memuat data layanan")
      } finally {
        setIsLoading(false)
      }
    }
    if (serviceId) loadService()
  }, [serviceId])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nama.trim()) {
      toast.error("Nama layanan wajib diisi")
      return
    }

    setIsSaving(true)
    try {
      await updateService(serviceId, formData)
      toast.success("Layanan berhasil diperbarui!")
      window.location.href = '/admin/services'
    } catch (error: any) {
      console.error("Error updating service:", error)
      toast.error(error.message || "Gagal memperbarui layanan")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/services">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Layanan
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Perbarui informasi layanan
          </p>
        </div>
      </div>

      <Card className="max-w-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Form Edit Layanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Layanan */}
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Layanan *</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                placeholder="Contoh: Website Company Profile"
                required
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Select
                value={formData.kategori}
                onValueChange={(value) => handleChange('kategori', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriOptions.map((kat) => (
                    <SelectItem key={kat} value={kat}>{kat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) => handleChange('deskripsi', e.target.value)}
                placeholder="Deskripsi layanan..."
                rows={4}
              />
            </div>

            {/* Harga */}
            <div className="space-y-2">
              <Label htmlFor="harga">Harga Dasar (Rp)</Label>
              <Input
                id="harga"
                type="number"
                value={formData.harga || ''}
                onChange={(e) => handleChange('harga', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            {/* Estimasi */}
            <div className="space-y-2">
              <Label htmlFor="estimasi">Estimasi Pengerjaan</Label>
              <Input
                id="estimasi"
                value={formData.estimasi}
                onChange={(e) => handleChange('estimasi', e.target.value)}
                placeholder="Contoh: 2-4 minggu"
              />
            </div>

            {/* Slots */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_slots">Slot Terisi</Label>
                <Input
                  id="current_slots"
                  type="number"
                  value={formData.current_slots}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_slots">Maksimal Slot</Label>
                <Input
                  id="max_slots"
                  type="number"
                  value={formData.max_slots}
                  onChange={(e) => handleChange('max_slots', parseInt(e.target.value) || 1)}
                  min={1}
                />
              </div>
            </div>

            {/* Status Aktif */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Status Aktif</Label>
                <p className="text-xs text-gray-500">
                  Layanan aktif akan tampil di halaman customer
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange('is_active', checked)}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                asChild
              >
                <Link href="/admin/services">Batal</Link>
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
