/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: '/portfolio', destination: '/apparel', permanent: false },
      { source: '/join-marketer', destination: '/', permanent: false },
      { source: '/community', destination: '/', permanent: false },
      // Redirect all order and tracking routes to Canvas
      { source: '/order', destination: process.env.NEXT_PUBLIC_CANVAS_URL || 'https://canvas.ashiragroup.id/ashira-apparel', permanent: false },
      { source: '/track/:path*', destination: process.env.NEXT_PUBLIC_CANVAS_URL || 'https://canvas.ashiragroup.id/ashira-apparel', permanent: false },
      // Old routes cleanup
      { source: '/admin/:path*', destination: '/', permanent: false },
      { source: '/dashboard/:path*', destination: '/', permanent: false },
      { source: '/login', destination: '/', permanent: false },
    ]
  },
}

export default nextConfig
