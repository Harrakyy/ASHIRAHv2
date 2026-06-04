import Link from "next/link"
import { Mail, Phone, MapPin, MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="py-24 lg:py-32" style={{ backgroundColor: '#1c2143' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12" style={{ backgroundColor: '#D4AF37' }} />
              <span className="text-sm font-medium tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
                Get In Touch
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
              Ready to Start Your Project?
            </h2>

            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Contact us today for a custom quote. We offer negotiable pricing for bulk orders, 
              events, and organization partnerships.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-10">
              <a 
                href="mailto:ashira.hco@ashira.com"
                className="flex items-center gap-4 text-white/70 hover:text-white transition-colors"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Email</p>
                  <p className="font-medium">ashira.hco@ashira.com</p>
                </div>
              </a>
              
              <a 
                href="https://wa.me/6285819993633"
                className="flex items-center gap-4 text-white/70 hover:text-white transition-colors"
              >
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm text-white/50">WhatsApp</p>
                  <p className="font-medium">+62 858-1999-3633</p>
                </div>
              </a>
              
              <div className="flex items-center gap-4 text-white/70">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Location</p>
                  <p className="font-medium">Grand Batavia Arcade, Tangerang, Indonesia</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6"
                style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
              >
                <Link href="/order">
                  Order Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 bg-[#25D366] hover:bg-[#20bd5a] text-white"
              >
                <a
                  href="https://wa.me/6285819993633?text=Halo%20ASHIRA%2C%20saya%20tertarik%20dengan%20produk%20custom%20apparel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Order Info */}
          <div className="bg-white/5 border border-white/10 p-8 lg:p-10">
            <h3 className="font-serif text-xl text-white mb-6">Quick Order Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/70">Minimum Order</span>
                <span className="text-white font-medium">12 pcs</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/70">Production Time</span>
                <span className="text-white font-medium">7-14 days</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/70">Shipping</span>
                <span className="text-white font-medium">Nationwide</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-white/70">Payment</span>
                <span className="text-white font-medium">DP 50%</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-white/70">Revision</span>
                <span className="text-white font-medium">Free (up to 3x)</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              <p className="text-[#D4AF37] text-sm font-medium mb-1">Special Offer</p>
              <p className="text-white/70 text-sm">
                Konveksi kustom untuk mahasiswa - Harga boleh nego!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
