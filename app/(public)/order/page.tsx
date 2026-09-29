import { Metadata } from "next"
import { OrderForm } from "@/components/order/order-form"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Pesan Apparel Custom | ASHIRA Apparel",
  description: "Kirim pesanan apparel custom: jersey, kaos, jaket varsity, dan lainnya dengan kualitas premium dan harga yang bisa dinegosiasikan.",
}

export default function OrderPage() {
  return (
    <main className="ashira-page-gradient min-h-screen">
      <OrderForm />
      <Footer />
    </main>
  )
}
