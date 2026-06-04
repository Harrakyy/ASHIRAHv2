import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

const navigation = {
  company: [
    { name: "About", href: "/#about" },
    { name: "Team", href: "/#team" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Company Profile", href: "/#holdings" },
  ],
  products: [
    { name: "Custom Jersey", href: "/apparel#products" },
    { name: "Varsity Jackets", href: "/apparel#products" },
    { name: "Work Jackets", href: "/apparel#products" },
    { name: "Corporate Uniforms", href: "/apparel#products" },
  ],
  partnership: [
    { name: "Join Our Marketer", href: "/join-marketer" },
    { name: "Bulk Orders", href: "/order" },
    { name: "Event Partnership", href: "/order" },
    { name: "Reseller Program", href: "/join-marketer" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#1c2143] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/images/ashira-corporate-logo.png"
              alt="ASHIRA GROUP"
              width={150}
              height={50}
              className="mb-6"
            />
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              PT. ASHIRA NIAGA INDONESIA - Premium quality custom apparel vendor specializing in 
              jerseys, t-shirts, varsity jackets, work jackets, and corporate uniforms.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="mailto:ashira.hco@ashira.com"
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                ashira.hco@ashira.com
              </a>
              <a 
                href="https://wa.me/6285819993633"
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                +62 858-1999-3633
              </a>
              <div className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                <span>Grand Batavia Arcade, Tangerang, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium text-sm tracking-[0.1em] uppercase mb-4 text-[#D4AF37]">
              Company
            </h4>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm tracking-[0.1em] uppercase mb-4 text-[#D4AF37]">
              Products
            </h4>
            <ul className="space-y-3">
              {navigation.products.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-sm tracking-[0.1em] uppercase mb-4 text-[#D4AF37]">
              Partnership
            </h4>
            <ul className="space-y-3">
              {navigation.partnership.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} PT. ASHIRA NIAGA INDONESIA. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
