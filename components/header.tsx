"use client"

import { useState, useEffect, useRef, createContext, useContext } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { NavLink } from "@/components/nav-link"
import { OrderTrigger } from "@/components/order-modal"
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
    team: "Team",
    divisions: "Divisions",
    contact: "Contact",
    orderNow: "Order Now",
    groupSub: "Holding company",
    apparelSub: "Garment & custom apparel",
    techSub: "Software, SaaS & AI",
    dashboard: "Dashboard",
    logout: "Logout",
    login: "Login",
  },
  id: {
    home: "Beranda",
    about: "Tentang",
    team: "Tim",
    divisions: "Divisi",
    contact: "Kontak",
    orderNow: "Pesan Sekarang",
    groupSub: "Holding company",
    apparelSub: "Garmen & apparel custom",
    techSub: "Software, SaaS & AI",
    dashboard: "Dashboard",
    logout: "Keluar",
    login: "Masuk",
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

type NavLink = { label: string; href: string }
type NavItem = NavLink & { submenu?: (NavLink & { description: string })[] }

/** Logo pill "ASHIRA Group" — sama seperti di Figma. */
function LogoPill() {
  return (
    <span className="ashira-silver-gradient inline-flex items-center gap-1 rounded-full px-5 py-2 text-[13px] leading-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
      <span className="font-bold tracking-wide text-ashira-navy">ASHIRA</span>
      <span className="text-ashira-muted">Group</span>
    </span>
  )
}

const iconButton =
  "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-white transition-colors hover:bg-white/10"
const menuItem =
  "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ashira-navy hover:bg-[#EEF0FA]"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [divisionsOpen, setDivisionsOpen] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const divisionsRef = useRef<HTMLDivElement>(null)
  const t = (key: string) => translations[language][key as keyof typeof translations.en] || key

  const navItems: NavItem[] = [
    { label: t("home"), href: "/" },
    { label: t("about"), href: "/about" },
    // Team ada di navbar Figma Redesign v2 (keputusan user, menggantikan susunan HANDOVER)
    { label: t("team"), href: "/team" },
    {
      label: t("divisions"),
      href: "#",
      submenu: [
        { label: "ASHIRA Group", href: "/", description: t("groupSub") },
        { label: "ASHIRA Apparel", href: "/apparel", description: t("apparelSub") },
        { label: "ASHIRATECH", href: "/#tech", description: t("techSub") },
      ],
    },
    { label: t("contact"), href: "/#contact" },
  ]


  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (divisionsRef.current && !divisionsRef.current.contains(target)) setDivisionsOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDivisionsOpen(false)
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  // Kunci scroll halaman selama drawer mobile terbuka; tutup drawer bila layar melebar ke desktop.
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = "hidden"
    const desktop = window.matchMedia("(min-width: 1024px)")
    const onChange = () => desktop.matches && setIsMobileMenuOpen(false)
    desktop.addEventListener("change", onChange)
    return () => {
      root.style.overflow = prevOverflow
      desktop.removeEventListener("change", onChange)
    }
  }, [isMobileMenuOpen])

  const toggleLanguage = () => setLanguage(language === "en" ? "id" : "en")
  const closeMobile = () => setIsMobileMenuOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="ashira-dark-gradient shadow-[0_8px_24px_rgba(4,3,13,0.25)]">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:h-[88px] lg:px-[72px]">
          {/* Kiri: logo + menu */}
          <div className="flex items-center gap-14">
            <NavLink href="/" aria-label="ASHIRA Group — Beranda" className="shrink-0">
              <LogoPill />
            </NavLink>

            <nav className="hidden items-center gap-10 lg:flex" aria-label="Navigasi utama">
              {navItems.map((item) =>
                item.submenu ? (
                  <div
                    key={item.label}
                    ref={divisionsRef}
                    className="relative"
                    onMouseEnter={() => setDivisionsOpen(true)}
                    onMouseLeave={() => setDivisionsOpen(false)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setDivisionsOpen(false)
                    }}
                  >
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={divisionsOpen}
                      // Klik mouse (detail > 0) selalu membuka — menu sudah terbuka oleh hover, jadi
                      // toggle akan langsung menutupnya. Enter/Space (detail 0) tetap toggle.
                      onClick={(e) => setDivisionsOpen((v) => (e.detail > 0 ? true : !v))}
                      className="flex items-center gap-1.5 font-display text-sm font-medium text-white/85 transition-colors hover:text-white"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${divisionsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {divisionsOpen && (
                      <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4">
                        <div
                          role="menu"
                          className="w-[280px] rounded-2xl bg-white p-2 shadow-[0_16px_40px_rgba(10,18,51,0.18)]"
                        >
                          {item.submenu.map((sub) => (
                            <NavLink
                              key={sub.label}
                              href={sub.href}
                              role="menuitem"
                              onClick={() => setDivisionsOpen(false)}
                              className="block rounded-xl px-4 py-3 transition-colors hover:bg-[#EEF0FA]"
                            >
                              <span className="block text-[15px] font-semibold text-ashira-navy">{sub.label}</span>
                              <span className="block text-[13px] text-ashira-muted">{sub.description}</span>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.label}
                    href={item.href}
                    className="font-display text-sm font-medium text-white/85 transition-colors hover:text-white"
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
            </nav>
          </div>

          {/* Kanan: bahasa, Order Now, akun */}
          <div className="hidden items-center gap-6 lg:flex">
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={language === "en" ? "Ganti ke Bahasa Indonesia" : "Switch to English"}
              className="font-display text-sm font-medium uppercase text-white/85 transition-colors hover:text-white"
            >
              {language}
            </button>

            <OrderTrigger className="ashira-silver-gradient rounded-full px-[22px] py-[11px] font-display text-sm font-extrabold text-ashira-navy shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.03]">
              {t("orderNow")}
            </OrderTrigger>

          </div>

          {/* Tombol menu mobile */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Drawer mobile — isi menu sama dengan desktop */}
      {isMobileMenuOpen && (
        <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain rounded-b-3xl bg-[#0B1233] px-6 pb-7 pt-3 shadow-[0_20px_40px_rgba(4,3,13,0.35)] lg:hidden">
          <nav className="flex flex-col" aria-label="Navigasi mobile">
            {navItems.map((item) =>
              item.submenu ? (
                <div key={item.label} className="py-2">
                  <p className="pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.08em] text-ashira-lilac">
                    {item.label}
                  </p>
                  {item.submenu.map((sub) => (
                    <NavLink
                      key={sub.label}
                      href={sub.href}
                      onClick={closeMobile}
                      className="block py-2.5 pl-3.5 font-display text-[15px] text-[#D9D9D9] hover:text-white"
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  href={item.href}
                  onClick={closeMobile}
                  className="py-3.5 font-display text-[17px] font-medium text-white"
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="mt-3 flex items-center gap-4 border-t border-white/15 pt-5">
            <button
              type="button"
              onClick={toggleLanguage}
              className="font-display text-[15px] font-medium uppercase text-white"
            >
              {language}
            </button>
            <OrderTrigger
              onClick={closeMobile}
              className="ashira-silver-gradient flex-1 rounded-full py-3.5 text-center font-display text-[15px] font-extrabold text-ashira-navy"
            >
              {t("orderNow")}
            </OrderTrigger>
          </div>
        </div>
      )}
    </header>
  )
}
