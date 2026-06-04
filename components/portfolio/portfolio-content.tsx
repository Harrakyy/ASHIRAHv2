"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Download, Star, ArrowRight, Shirt, Crown, Briefcase, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

const pastClients = [
  { name: "Universitas Indonesia", short: "UI" },
  { name: "IPB University", short: "IPB" },
  { name: "IKABA FIB UI", short: "IKABA" },
  { name: "Syabaab Ussunnah", short: "SS" },
  { name: "BEM FEB UI", short: "BEM" },
  { name: "HIMA Teknik IPB", short: "HIMA" },
  { name: "Komunitas Futsal Jakarta", short: "KFJ" },
  { name: "Corporate Partners", short: "CORP" },
]

const projectCategories = [
  { id: "all", label: "All Projects" },
  { id: "jersey", label: "Jersey" },
  { id: "varsity", label: "Varsity" },
  { id: "workjacket", label: "Work Jacket" },
  { id: "tshirt", label: "T-Shirt" },
]

const projects = [
  { id: 1, category: "jersey", title: "Jersey Futsal BEM UI", client: "BEM FEB UI", qty: 50 },
  { id: 2, category: "varsity", title: "Varsity Jacket Wisuda", client: "HIMA Teknik IPB", qty: 100 },
  { id: 3, category: "workjacket", title: "Work Jacket Corporate", client: "PT. ABC Indonesia", qty: 200 },
  { id: 4, category: "tshirt", title: "T-Shirt Event Music", client: "Event Organizer", qty: 500 },
  { id: 5, category: "jersey", title: "Jersey Basketball Club", client: "Basketball Community", qty: 30 },
  { id: 6, category: "varsity", title: "Varsity Angkatan 2023", client: "Universitas Indonesia", qty: 150 },
]

const reviews = [
  { name: "Budi Santoso", org: "BEM FEB UI", rating: 5, review: "Kualitas jersey sangat bagus, printing tajam dan bahan adem." },
  { name: "Putri Rahayu", org: "HIMA Teknik IPB", rating: 5, review: "Varsity jacket untuk wisuda kami hasilnya luar biasa." },
  { name: "Ahmad Fauzi", org: "Komunitas Futsal", rating: 5, review: "Sudah 3x order disini. Konsisten berkualitas." },
  { name: "Dewi Lestari", org: "Event Organizer", rating: 5, review: "500 pcs selesai tepat waktu dengan kualitas prima." },
  { name: "Rizky Pratama", org: "OSIS SMA Negeri 1", rating: 5, review: "Almamater angkatan kami sangat bagus." },
  { name: "Siti Nurhaliza", org: "Startup Tech", rating: 5, review: "Work jacket tim kantor kami tampil profesional." },
  { name: "Andi Wijaya", org: "Alumni FIB UI", rating: 5, review: "Polo shirt reuni alumni sangat memuaskan." },
  { name: "Maya Indira", org: "Dance Community", rating: 5, review: "Kostum dance full print hasilnya keren banget!" },
  { name: "Fajar Hidayat", org: "Komunitas Basket", rating: 5, review: "Jersey basket custom dengan nomor punggung. Berkualitas tinggi." },
  { name: "Lina Marlina", org: "NGO Foundation", rating: 5, review: "Kaos program sosial kami dibuat dengan penuh dedikasi." },
]

export function PortfolioContent() {
  const [activeCategory, setActiveCategory] = useState("all")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll for client logos
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0

    const scroll = () => {
      scrollPosition += 0.5
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationId)
  }, [])

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "jersey": return Shirt
      case "varsity": return Crown
      case "workjacket": return Briefcase
      case "tshirt": return Shirt
      default: return Award
    }
  }

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="py-16 bg-[#1c2143]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Our Portfolio
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Explore our completed projects and see the quality of our custom apparel solutions.
          </p>
          
          {/* Download Portfolio Button */}
          <Button
            asChild
            size="lg"
            className="rounded-full px-8"
            style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
          >
            <a href="/CP.pdf" download>
              <Download className="mr-2 w-5 h-5" />
              Download Full Portfolio (PDF)
            </a>
          </Button>
        </div>
      </section>

      {/* Client Logo Carousel */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by Leading Organizations
          </p>
          
          <div 
            ref={scrollRef}
            className="overflow-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-8 w-max">
              {[...pastClients, ...pastClients].map((client, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-center px-6 py-3 bg-secondary border border-border hover:border-[#D4AF37]/50 transition-all min-w-[140px] grayscale hover:grayscale-0"
                >
                  <div className="text-center">
                    <p className="text-xl font-serif text-muted-foreground group-hover:text-foreground transition-colors">
                      {client.short}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {client.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-8">
            Featured Projects
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {projectCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#1c2143] text-white'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const Icon = getCategoryIcon(project.category)
              return (
                <div
                  key={project.id}
                  className="group bg-card border border-border hover:border-[#D4AF37]/50 transition-all p-6"
                >
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-serif text-lg text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Client: {project.client}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {project.qty} pcs
                    </span>
                    <span className="text-xs text-[#D4AF37] capitalize">
                      {project.category}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-10">
            Customer Reviews
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-card border border-border p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  &ldquo;{review.review}&rdquo;
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-foreground font-medium text-sm">{review.name}</p>
                  <p className="text-muted-foreground text-xs">{review.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join our growing list of satisfied clients. Get premium custom apparel with competitive pricing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8"
              style={{ backgroundColor: '#D4AF37', color: '#1c2143' }}
            >
              <Link href="/order">
                Start Your Order
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8"
            >
              <Link href="/join-marketer">
                Join Our Partnership
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
