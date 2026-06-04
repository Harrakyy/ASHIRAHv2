import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ApparelHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#0a0d1a]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(192,192,192,0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Silver gradient accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#C0C0C0]/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-[#1c2143]/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/images/logo.png"
                alt="ASHIRA'H.CO"
                width={200}
                height={70}
                className="object-contain"
              />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C0C0C0]/10 border border-[#C0C0C0]/20 mb-6">
              <Star className="w-4 h-4 text-[#C0C0C0]" />
              <span className="text-[#C0C0C0] text-sm font-medium tracking-wider">
                PREMIUM QUALITY
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Customable Premium{" "}
              <span className="text-[#C0C0C0]">Apparel</span>
            </h1>

            <p className="text-lg text-white/60 mb-4 leading-relaxed max-w-xl">
              High-quality custom clothing solutions for organizations, universities, and corporates.
            </p>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-[#D4AF37]" />
              <p className="text-[#D4AF37] font-medium">
                Negotiable Price & Exclusive Bonus
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-base font-medium transition-all hover:scale-105"
                style={{ backgroundColor: '#C0C0C0', color: '#0a0d1a' }}
              >
                <Link href="/order">
                  Request Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-base font-medium border-white/20 text-white hover:bg-white/10 transition-all hover:scale-105"
                style={{ backgroundColor: '#ffffff', color: '#1c2143' }}
              >
                <a href="#products">View Products</a>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              <div className="text-center">
                <p className="text-2xl font-serif text-[#C0C0C0] mb-1">Free</p>
                <p className="text-xs text-white/50">Sample Design</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif text-[#C0C0C0] mb-1">Fast</p>
                <p className="text-xs text-white/50">Production Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif text-[#C0C0C0] mb-1">Nationwide</p>
                <p className="text-xs text-white/50">Shipping Available</p>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block">
            <div className="aspect-square bg-gradient-to-br from-[#1c2143] to-[#0a0d1a] border border-[#C0C0C0]/20 flex items-center justify-center">
              <div className="text-center p-12">
                <p className="text-6xl font-serif text-[#C0C0C0]/20 mb-4">A&apos;H</p>
                <p className="text-sm text-white/30 tracking-[0.3em] uppercase">
                  Premium Apparel
                </p>
              </div>
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#C0C0C0]/10 -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
