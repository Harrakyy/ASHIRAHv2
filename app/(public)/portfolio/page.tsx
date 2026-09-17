import { Metadata } from "next"
import { PortfolioContent } from "@/components/portfolio/portfolio-content"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingIcons } from "@/components/floating-icons"

export const metadata: Metadata = {
  title: "Portfolio | ASHIRA'H.CO",
  description: "View our portfolio of custom apparel projects. Jerseys, varsity jackets, work jackets, and more for organizations across Indonesia.",
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PortfolioContent />
      <Footer />
      <FloatingIcons />
    </main>
  )
}
