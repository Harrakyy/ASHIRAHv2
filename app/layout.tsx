import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Outfit, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Chatbot from "@/components/Chatbot"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800']
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit'
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
        url: '/iconAHLG.png',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} ${outfit.variable} ${playfair.variable} font-sans antialiased bg-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Chatbot />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}