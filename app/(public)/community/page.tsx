import { Metadata } from "next"
import Image from "next/image"
import { CommunityHero } from "@/components/community/community-hero"
import { CommunityServices } from "@/components/community/community-services"
import { CommunityProjects } from "@/components/community/community-projects"
import { CommunityTeam } from "@/components/community/community-team"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingIcons } from "@/components/floating-icons"

export const metadata: Metadata = {
  title: "ASHIRA Community | Aksi Sosial & Humaniora",
  description: "Impact for Social Humanity. Education, Public Speaking, and Social Empowerment programs by ASHIRA Community.",
}

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f0f7f7] to-white">
      <Header />
      <CommunityHero />
      <CommunityServices />
      <CommunityProjects />
      <CommunityTeam />
      <Footer />
      <FloatingIcons />
    </main>
  )
}
