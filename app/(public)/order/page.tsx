import { Metadata } from "next"
import { OrderForm } from "@/components/order/order-form"
import { Header } from "@/components/header"
import { FloatingIcons } from "@/components/floating-icons"

export const metadata: Metadata = {
  title: "Order Custom Apparel | ASHIRA'H.CO",
  description: "Submit your custom apparel order. Premium quality jerseys, t-shirts, varsity jackets, and more with negotiable pricing.",
}

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-[#0a0d1a]">
      <Header />
      <OrderForm />
      <FloatingIcons />
    </main>
  )
}
