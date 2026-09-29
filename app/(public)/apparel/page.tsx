import { Metadata } from "next"
import { ApparelHero } from "@/components/apparel/apparel-hero"
import { ApparelProducts } from "@/components/apparel/apparel-products"
import { FabricShowcase } from "@/components/apparel/fabric-showcase"
import { ApparelCTA } from "@/components/apparel/apparel-cta"
import { CustomerReviews } from "@/components/apparel/customer-reviews"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "ASHIRA Apparel | Produksi Garmen & Apparel Custom",
  description: "ASHIRA Apparel (PT Ashira Swarna Apparel) — produksi garmen dan apparel custom: jersey, t-shirt, varsity, work jacket, almamater, polo & kemeja. Harga bisa dinegosiasi.",
}

export default function ApparelPage() {
  return (
    <main className="ashira-page-gradient min-h-screen">
      <ApparelHero />
      <div className="ashira-grid-pattern">
        <ApparelProducts />
        <FabricShowcase />
        <CustomerReviews />
        <ApparelCTA />
      </div>
      <Footer />
    </main>
  )
}
