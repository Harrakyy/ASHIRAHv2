import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Chatbot from "@/components/Chatbot"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'ASHIRA GROUP | Premium Custom Apparel Solutions',
  description: 'PT. ASHIRA NIAGA INDONESIA - Premium quality custom apparel vendor specializing in jerseys, t-shirts, varsity jackets, work jackets, and corporate uniforms. Trusted partner for organizations and businesses.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/iconAH-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/iconAHLG-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/iconAH.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Chatbot />
        <Analytics />
      </body>
    </html>
  )
}