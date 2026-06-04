import Image from "next/image"
import Link from "next/link"
import { ArrowRight, TrendingUp, Users, Package, Award } from "lucide-react"

const holdings = [
  {
    name: "ASHIRA'H.CO",
    subtitle: "Premium Apparel Division",
    description: "Custom apparel solutions for organizations, universities, and corporates. Premium quality with negotiable pricing.",
    logo: "/images/ashira-corporate-logo.png",
    href: "/apparel",
    theme: "dark",
    stats: [
      { label: "Products Delivered", value: "50K+", icon: Package },
      { label: "Partner Organizations", value: "100+", icon: Award },
    ],
  },
  {
    name: "ASHIRA Community",
    subtitle: "Aksi Sosial & Humaniora",
    description: "Social impact through education, public speaking, and community empowerment programs.",
    logo: "/images/ashira-community-logo.png",
    href: "/community",
    theme: "light",
    stats: [
      { label: "Community Members", value: "500+", icon: Users },
      { label: "Programs Launched", value: "25+", icon: TrendingUp },
    ],
  },
]

export function HoldingCards() {
  return (
    <section id="holdings" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12" style={{ backgroundColor: '#D4AF37' }} />
            <span className="text-sm font-medium tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
              Our Divisions
            </span>
            <div className="h-px w-12" style={{ backgroundColor: '#D4AF37' }} />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6 text-balance">
            ASHIRA GROUP Holding Operations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Two divisions united by commitment to excellence and positive impact.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {holdings.map((holding, index) => (
            <Link
              key={index}
              href={holding.href}
              className={`group relative overflow-hidden border transition-all duration-500 hover:scale-[1.02] ${
                holding.theme === 'dark' 
                  ? 'bg-[#1c2143] border-[#1c2143] hover:border-[#D4AF37]' 
                  : 'bg-card border-border hover:border-[#2B7A78]'
              }`}
            >
              <div className="p-8 lg:p-10">
                {/* Logo */}
                <div className={`mb-6 h-16 flex items-center ${holding.theme === 'dark' ? '' : 'grayscale group-hover:grayscale-0 transition-all'}`}>
                  <Image
                    src={holding.logo}
                    alt={holding.name}
                    width={160}
                    height={64}
                    className="object-contain object-left"
                    style={{ width: 'auto', height: 'auto', maxHeight: '64px' }}
                  />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className={`text-xs tracking-[0.15em] uppercase mb-2 ${
                    holding.theme === 'dark' ? 'text-[#D4AF37]' : 'text-[#2B7A78]'
                  }`}>
                    {holding.subtitle}
                  </p>
                  <h3 className={`font-serif text-2xl mb-3 ${
                    holding.theme === 'dark' ? 'text-white' : 'text-foreground'
                  }`}>
                    {holding.name}
                  </h3>
                  <p className={`leading-relaxed ${
                    holding.theme === 'dark' ? 'text-white/70' : 'text-muted-foreground'
                  }`}>
                    {holding.description}
                  </p>
                </div>

                {/* Stats */}
                <div className={`grid grid-cols-2 gap-4 py-6 border-t ${
                  holding.theme === 'dark' ? 'border-white/10' : 'border-border'
                }`}>
                  {holding.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        holding.theme === 'dark' 
                          ? 'bg-[#D4AF37]/10' 
                          : 'bg-[#2B7A78]/10'
                      }`}>
                        <stat.icon className={`w-5 h-5 ${
                          holding.theme === 'dark' ? 'text-[#D4AF37]' : 'text-[#2B7A78]'
                        }`} />
                      </div>
                      <div>
                        <p className={`text-xl font-serif ${
                          holding.theme === 'dark' ? 'text-white' : 'text-foreground'
                        }`}>
                          {stat.value}
                        </p>
                        <p className={`text-xs ${
                          holding.theme === 'dark' ? 'text-white/50' : 'text-muted-foreground'
                        }`}>
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  holding.theme === 'dark' ? 'text-[#D4AF37]' : 'text-[#2B7A78]'
                } group-hover:gap-4 transition-all`}>
                  Explore {holding.name.split(' ')[0]}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
