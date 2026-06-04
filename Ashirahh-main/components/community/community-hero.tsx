import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, Users, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CommunityHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1a5f5a 0%, #2B7A78 30%, #3aafa9 60%, #5cc4bf 100%)',
        }}
      />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            {/* Logo */}
            <div className="mb-8 bg-white/10 backdrop-blur-sm p-4 inline-block rounded-lg">
              <Image
                src="/images/ashira-community-logo.png"
                alt="ASHIRA Community"
                width={250}
                height={100}
                className="object-contain"
              />
            </div>

            {/* Tagline */}
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-5 h-5 text-white" />
              <span className="text-white/90 text-sm font-medium tracking-[0.15em] uppercase">
                Aksi Sosial & Humaniora
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Impact for{" "}
              <span className="text-white/80">Social Humanity</span>
            </h1>

            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
              Empowering communities through education, public speaking, and social empowerment programs. 
              Together, we create meaningful change.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-base font-medium bg-white text-[#2B7A78] hover:bg-white/90 transition-all hover:scale-105"
              >
                <Link href="#programs">
                  Our Programs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-base font-medium border-white/30 text-white hover:bg-white/10 transition-all hover:scale-105"
                style={{ backgroundColor: '#ffffff', color: '#1a5f5a' }}
              >
                <Link href="#team">Meet The Team</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-white/60" />
                <div>
                  <p className="text-2xl font-serif text-white">500+</p>
                  <p className="text-xs text-white/60">Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-white/60" />
                <div>
                  <p className="text-2xl font-serif text-white">25+</p>
                  <p className="text-xs text-white/60">Programs</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-white/60" />
                <div>
                  <p className="text-2xl font-serif text-white">10+</p>
                  <p className="text-xs text-white/60">Cities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Heart className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white/80 text-lg font-medium">
                    Building a Better Tomorrow
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    Through Community Action
                  </p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
