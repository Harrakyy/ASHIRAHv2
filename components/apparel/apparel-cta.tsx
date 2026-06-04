import Link from "next/link"
import { ArrowRight, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ApparelCTA() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-[#1c2143] to-[#0a0d1a]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-8">
          <span className="text-[#D4AF37] text-sm font-medium tracking-wider">
            READY TO ORDER?
          </span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
          Let&apos;s Create Something{" "}
          <span className="text-[#C0C0C0]">Extraordinary</span>
        </h2>

        <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Get in touch with our team to discuss your custom apparel needs. 
          We offer negotiable pricing for bulk orders and special partnerships.
        </p>

        {/* Price highlight */}
        <div className="bg-[#0a0d1a]/50 border border-[#C0C0C0]/20 p-6 mb-10 max-w-xl mx-auto">
          <p className="text-[#D4AF37] text-sm font-medium tracking-wider mb-2">
            SPECIAL OFFER
          </p>
          <p className="text-white text-lg">
            Konveksi ramah kantong mahasiswa dengan kualitas premium
          </p>
          <p className="text-white/50 text-sm mt-2">
            Harga boleh nego untuk pemesanan dalam jumlah besar
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 text-base font-medium transition-all hover:scale-105 w-full sm:w-auto"
            style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
          >
            <Link href="/order">
              Request Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-6 text-base font-medium border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 transition-all hover:scale-105 w-full sm:w-auto"
          >
            <a
              href="https://wa.me/6285819993633?text=Halo%20ASHIRA%2C%20saya%20ingin%20bertanya%20tentang%20pemesanan%20custom%20apparel"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              WhatsApp Us
            </a>
          </Button>
        </div>

        {/* Contact info */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/50 text-sm">
          <a 
            href="mailto:ashira.hco@ashira.com"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4" />
            ashira.hco@ashira.com
          </a>
          <span className="hidden sm:inline">|</span>
          <a 
            href="https://instagram.com/ashira.hco"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            @ashira.hco
          </a>
        </div>
      </div>
    </section>
  )
}
