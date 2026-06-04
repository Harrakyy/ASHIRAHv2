"use client"

import { useState, useEffect, createContext, useContext } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

// Language context for bilingual support
type Language = "en" | "id"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    home: "Home",
    about: "About",
    divisions: "Divisions",
    portfolio: "Portfolio",
    joinMarketer: "Join Marketer",
    contact: "Contact",
    orderNow: "Order Now",
    ashiraGroup: "ASHIRA GROUP",
    apparelDiv: "ASHIRA'H.CO (Apparel)",
    communityDiv: "ASHIRA Community",
  },
  id: {
    home: "Beranda",
    about: "Tentang Kami",
    divisions: "Divisi",
    portfolio: "Portofolio",
    joinMarketer: "Gabung Marketer",
    contact: "Kontak",
    orderNow: "Pesan Sekarang",
    ashiraGroup: "ASHIRA GROUP",
    apparelDiv: "ASHIRA'H.CO (Pakaian)",
    communityDiv: "ASHIRA Community",
  },
}

export const LanguageContext = createContext<LanguageContextType | null>(null)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string) => translations.en[key as keyof typeof translations.en] || key,
    }
  }
  return context
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [language, setLanguage] = useState<Language>("en")
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/#about" },
    { 
      label: t("divisions"), 
      href: "#",
      submenu: [
        { label: t("ashiraGroup"), href: "/" },
        { label: t("apparelDiv"), href: "/apparel" },
        { label: t("communityDiv"), href: "/community" },
      ]
    },
    { label: t("portfolio"), href: "/portfolio" },
    { label: t("joinMarketer"), href: "/join-marketer" },
    { label: t("contact"), href: "/#contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar with company name */}
      <div 
        className="hidden md:block py-2 text-center text-xs tracking-wider"
        style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
      >
        <span className="font-medium">ASHIRA GROUP</span>
        <span className="mx-2">|</span>
        <span>PT ASHIRA NIAGA INDONESIA</span>
      </div>

      {/* Main header */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md border-b shadow-sm"
            : ""
        }`}
        style={{ 
          backgroundColor: isScrolled ? 'rgba(28, 33, 67, 0.97)' : '#1c2143',
          borderColor: isScrolled ? 'rgba(212, 175, 55, 0.2)' : 'transparent'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo and Company Name */}
            <Link href="/" className="flex items-center gap-4">
              <div className="relative w-28 lg:w-32 h-10 lg:h-20">
                <Image
                  src="/images/logo.png"
                  alt="ASHIRA'H"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block border-l border-white/20 pl-4">
                <p className="text-white text-xs font-medium tracking-wide">ASHIRA GROUP</p>
                <p className="text-white/60 text-[10px] tracking-wide">PT ASHIRA NIAGA INDONESIA</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-5">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.submenu && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.submenu ? (
                    <>
                      <button className="flex items-center gap-1 text-sm font-medium transition-colors tracking-wide text-white/80 hover:text-white">
                        {item.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {openDropdown === item.label && (
                        <div className="absolute top-full left-0 pt-2">
                          <div className="bg-[#1c2143] border border-[#D4AF37]/20 shadow-lg py-2 min-w-[200px]">
                            {item.submenu.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm font-medium transition-colors tracking-wide text-white/80 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side - Language + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher */}
              <div 
                className="relative"
                onMouseEnter={() => setLangMenuOpen(true)}
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase text-xs font-medium">{language}</span>
                </button>
                {langMenuOpen && (
                  <div className="absolute top-full right-0 pt-2">
                    <div className="bg-[#1c2143] border border-[#D4AF37]/20 shadow-lg py-1 min-w-[120px]">
                      <button
                        onClick={() => { setLanguage("en"); setLangMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === "en" ? "text-[#D4AF37]" : "text-white/70 hover:text-white hover:bg-white/5"}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => { setLanguage("id"); setLangMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === "id" ? "text-[#D4AF37]" : "text-white/70 hover:text-white hover:bg-white/5"}`}
                      >
                        Indonesia
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full px-4 border-navy/30 text-white hover:bg-white/10"
                style={{ backgroundColor: '#ffffff', color: '#1c2143' }}
              >
                <Link href="/order">
                  {t("orderNow")}
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full px-4 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
              >
                <a
                  href="https://wa.me/6285819993633"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-white/10" style={{ backgroundColor: '#1c2143' }}>
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-center gap-4 pb-4 mb-4 border-b border-white/10">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${language === "en" ? "bg-[#D4AF37] text-[#1c2143]" : "text-white/70 border border-white/20"}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("id")}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${language === "id" ? "bg-[#D4AF37] text-[#1c2143]" : "text-white/70 border border-white/20"}`}
                >
                  Indonesia
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.submenu ? (
                      <div>
                        <p className="text-sm font-medium text-white py-2 px-2">
                          {item.label}
                        </p>
                        <div className="pl-4">
                          {item.submenu.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="block text-sm text-white/70 hover:text-white py-2 px-2"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block text-sm font-medium text-white/80 hover:text-white py-2 px-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-white/30 text-white hover:bg-white/10"
                  >
                    <Link href="/order">
                      {t("orderNow")}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="rounded-full"
                    style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
                  >
                    <a
                      href="https://wa.me/6285819993633"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
