import { Metadata } from "next"
import { JoinMarketerForm } from "@/components/marketer/join-marketer-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingIcons } from "@/components/floating-icons"

export const metadata: Metadata = {
  title: "Join Our Marketer | ASHIRA GROUP",
  description: "Become a part of ASHIRA GROUP marketing team. Earn commission, get exclusive catalog access, and marketing support.",
}

export default function JoinMarketerPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <JoinMarketerForm />
      <Footer />
      <FloatingIcons />
    </main>
  )
}
