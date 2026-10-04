import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import Chatbot from "@/components/Chatbot"

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
  title: 'ASHIRA Group | Holding Company Teknologi & Fashion',
  description: 'ASHIRA Group (PT Ashira Niaga Indonesia) adalah holding company yang membawahi ASHIRATECH — software, SaaS & AI — dan ASHIRA Apparel — produksi garmen dan apparel custom.',
  icons: {
    icon: [
      { url: '/iconAH.png', media: '(prefers-color-scheme: light)' },
      { url: '/iconAHLG.png', media: '(prefers-color-scheme: dark)' },
      { url: '/iconAH.svg', type: 'image/svg+xml' },
    ],
    apple: '/iconAH.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} ${outfit.variable} ${playfair.variable} font-sans antialiased bg-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  )
}