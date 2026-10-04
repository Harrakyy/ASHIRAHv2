import Link from "next/link"
import { CANVAS_URL } from "@/lib/utils"

export function OrderModalProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function OrderTrigger({
  className,
  children,
  onClick,
}: {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={CANVAS_URL}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
