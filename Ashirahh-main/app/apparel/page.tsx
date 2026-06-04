import { Metadata } from "next"
import { ApparelHero } from "@/components/apparel/apparel-hero"
import { ApparelProducts } from "@/components/apparel/apparel-products"
import { FabricShowcase } from "@/components/apparel/fabric-showcase"
import { ApparelCTA } from "@/components/apparel/apparel-cta"
import { CustomerReviews } from "@/components/apparel/customer-reviews"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingIcons } from "@/components/floating-icons"

export const metadata: Metadata = {
  title: "ASHIRA'H.CO | Premium Custom Apparel",
  description: "Customable Premium Apparel with Negotiable Price. Jersey, T-Shirt, Varsity, Work Jacket, dan lainnya. Konveksi Premium Jakarta, Custom Varsity Jacket Indonesia.",
}

export default function ApparelPage() {
  return (
    <main className="min-h-screen bg-[#0a0d1a]">
      <Header />
      <ApparelHero />
      <ApparelProducts />
      <FabricShowcase />
      <CustomerReviews />
      <ApparelCTA />
      <Footer />
      <FloatingIcons />
    </main>
  )
}
