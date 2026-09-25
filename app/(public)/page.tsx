import { HeroContainer } from "@/components/landing/hero/HeroContainer"
import { AboutSection } from "@/components/about-section"
import { ProductsSection } from "@/components/products-section"
import { HoldingCards } from "@/components/holding-cards"
import { TeamSection } from "@/components/team-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { FloatingIcons } from "@/components/floating-icons"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <HeroContainer />
      <AboutSection />
      <HoldingCards />
      <ProductsSection />
      <TeamSection />
      <ContactSection />
      <Footer />
      <FloatingIcons />
    </main>
  )
}
