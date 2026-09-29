import { HeroCarousel } from "@/components/landing/hero/HeroCarousel"
import { BusinessSection } from "@/components/landing/sections/BusinessSection"
import { MissionSection } from "@/components/landing/sections/MissionSection"
import { TestimonialSection } from "@/components/landing/sections/TestimonialSection"
import { ContactCards } from "@/components/landing/sections/ContactCards"
import { PartnersSection } from "@/components/landing/sections/PartnersSection"
import { Footer } from "@/components/footer"

/** Beranda — urutan section mengikuti Figma "REVISI TESTIMONI, LOGO". */
export default function HomePage() {
  return (
    <main className="ashira-page-gradient min-h-screen">
      <HeroCarousel />
      <div className="relative isolate overflow-hidden">
        {/* Latar foto gedung hitam-putih yang samar (Figma) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1800px] bg-[url('/images/decor/building.webp')] bg-cover bg-top opacity-[0.07] blur-[2px] grayscale"
        />
        <div className="ashira-grid-pattern">
          <BusinessSection />
          <MissionSection />
          <TestimonialSection />
          <ContactCards />
          <PartnersSection />
        </div>
      </div>
      <Footer />
    </main>
  )
}
