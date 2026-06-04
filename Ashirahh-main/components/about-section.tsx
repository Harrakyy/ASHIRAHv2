import Image from "next/image"
import { MapPin, Building } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12" style={{ backgroundColor: '#D4AF37' }} />
              <span className="text-sm font-medium tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
                About Us
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-8 text-balance">
              Built on Dedication to{" "}
              <span style={{ color: '#1c2143' }}>Quality Excellence</span>
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">ASHIRA&apos;H.CO (PT. ASHIRA NIAGA INDONESIA)</strong> is a 
                custom apparel vendor company focused on providing high-quality custom clothing solutions.
              </p>
              <p>
                Founded with a spirit of dedication to quality, we believe that every piece of clothing 
                is not just fabric sewn together—it&apos;s a representation of identity, professionalism, 
                and pride for the wearer.
              </p>
              <p>
                From corporate uniforms to organization merchandise, we deliver excellence in every stitch.
              </p>
            </div>

            {/* Location Info */}
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">Grand Batavia Arcade, Tangerang</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Coverage</p>
                  <p className="text-sm text-muted-foreground">Nationwide Indonesia</p>
                </div>
              </div>
            </div>

            {/* Owner signature */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Best regards,</p>
              <p className="font-serif text-xl text-foreground">Hawari Muttaqin Mafaza</p>
              <p className="text-sm text-muted-foreground">Owner & Founder, ASHIRA GROUP</p>
            </div>
          </div>

          {/* Logo showcase */}
          <div className="relative">
            <div className="aspect-square rounded-sm flex items-center justify-center p-12" style={{ backgroundColor: '#1c2143' }}>
              <Image
                src="/images/ashira-corporate-logo.png"
                alt="ASHIRA'H Corporate"
                width={400}
                height={200}
                className="object-contain"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border rounded-sm -z-10" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
