import { Header } from "@/components/header"
import { OrderModalProvider } from "@/components/order-modal"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OrderModalProvider>
      <Header />
      {children}
    </OrderModalProvider>
  )
}
