/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Admin redirects (Indonesian → English)
      { source: '/admin/pelanggan', destination: '/admin/customers', permanent: true },
      { source: '/admin/pesanan', destination: '/admin/orders', permanent: true },
      { source: '/admin/layanan', destination: '/admin/services', permanent: true },
      { source: '/admin/pesan', destination: '/admin/messages', permanent: true },
      { source: '/admin/laporan', destination: '/admin/reports', permanent: true },
      // Halaman yang dihapus di redesign v2
      { source: '/portfolio', destination: '/apparel', permanent: false },
      { source: '/join-marketer', destination: '/', permanent: false },
      { source: '/community', destination: '/', permanent: false },
      // Customer redirects
      { source: '/dashboard/pesan', destination: '/dashboard/messages', permanent: true },
    ]
  },
}

export default nextConfig
