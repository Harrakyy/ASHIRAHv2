import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, User, Bell, Shield } from "lucide-react"

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pengaturan</h1>
          <p className="text-muted-foreground">Konfigurasi sistem dan akun</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <CardTitle className="text-gray-900 dark:text-white">Akun Admin</CardTitle>
            </div>
            <CardDescription>Kelola informasi akun admin</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/profile">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                Edit Profil
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <CardTitle className="text-gray-900 dark:text-white">Notifikasi</CardTitle>
            </div>
            <CardDescription>Kelola pengaturan notifikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/notifications">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                Lihat Notifikasi
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <CardTitle className="text-gray-900 dark:text-white">Keamanan</CardTitle>
            </div>
            <CardDescription>Pengaturan keamanan akun</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" disabled>
              Segera Hadir
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <CardTitle className="text-gray-900 dark:text-white">General</CardTitle>
            </div>
            <CardDescription>Pengaturan umum sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300" disabled>
              Segera Hadir
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}