"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"

type NavLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string }

/**
 * `next/link` biasa, tetapi bila tujuannya adalah halaman yang sedang dibuka (tanpa #hash),
 * halaman di-scroll halus ke atas. Bawaan Next.js tidak melakukan apa pun sehingga klik terasa "mati"
 * (mis. "Beranda" di footer saat sedang di beranda).
 */
export function NavLink({ href, onClick, ...props }: NavLinkProps) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e)
        if (href === pathname) {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      }}
      {...props}
    />
  )
}
