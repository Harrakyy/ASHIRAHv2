"use client"

import { useState } from "react"
import { Droplets, Leaf, Shield } from "lucide-react"

const fabricFeatures = [
  {
    id: 1,
    icon: Droplets,
    title: "Moisture Wicking",
    description: "Advanced fabric technology that draws sweat away from the body, keeping you dry and comfortable during intense activities.",
    position: { top: "20%", left: "25%" },
  },
  {
    id: 2,
    icon: Shield,
    title: "Premium 24s Aerocool",
    description: "Our signature cotton blend with enhanced breathability and softness. Perfect for everyday wear with superior comfort.",
    position: { top: "50%", left: "70%" },
  },
  {
    id: 3,
    icon: Leaf,
    title: "Sustainable Cotton",
    description: "Eco-friendly sourced cotton materials that are gentle on the environment while maintaining premium quality standards.",
    position: { top: "75%", left: "35%" },
  },
]

export function FabricShowcase() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  return (
    <section className="py-24 lg:py-32 bg-[#1c2143]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#C0C0C0]" />
            <span className="text-[#C0C0C0] text-sm font-medium tracking-[0.2em] uppercase">
              Fabric Technology
            </span>
            <div className="h-px w-12 bg-[#C0C0C0]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Premium Materials, Superior Quality
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
            Hover over the indicators to explore our fabric technologies and understand 
            what makes our apparel stand out.
          </p>
        </div>

        {/* Fabric visualization */}
        <div className="relative max-w-4xl mx-auto">
          {/* Fabric texture background */}
          <div className="aspect-[16/9] bg-gradient-to-br from-[#0a0d1a] to-[#1c2143] border border-[#C0C0C0]/20 relative overflow-hidden">
            {/* Texture pattern */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2px,
                  rgba(192,192,192,0.1) 2px,
                  rgba(192,192,192,0.1) 4px
                )`,
              }}
            />

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl md:text-7xl font-serif text-[#C0C0C0]/10">
                  FABRIC
                </p>
                <p className="text-sm text-white/20 tracking-[0.5em] uppercase mt-2">
                  Technology Showcase
                </p>
              </div>
            </div>

            {/* Interactive hotspots */}
            {fabricFeatures.map((feature) => (
              <div
                key={feature.id}
                className="absolute"
                style={{ top: feature.position.top, left: feature.position.left }}
                onMouseEnter={() => setActiveFeature(feature.id)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                {/* Pulsing circle */}
                <div className="relative cursor-pointer">
                  <div className="w-8 h-8 bg-[#C0C0C0]/20 rounded-full flex items-center justify-center border border-[#C0C0C0]/40 hover:bg-[#C0C0C0]/30 transition-all">
                    <feature.icon className="w-4 h-4 text-[#C0C0C0]" />
                  </div>
                  {/* Pulse animation */}
                  <div className="absolute inset-0 rounded-full bg-[#C0C0C0]/30 animate-ping" />

                  {/* Tooltip */}
                  {activeFeature === feature.id && (
                    <div className="absolute z-20 w-64 p-4 bg-[#0a0d1a] border border-[#C0C0C0]/30 shadow-xl -translate-x-1/2 left-1/2 mt-4">
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <feature.icon className="w-4 h-4 text-[#D4AF37]" />
                        {feature.title}
                      </h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {fabricFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`p-6 border transition-all duration-300 ${
                activeFeature === feature.id
                  ? "bg-[#C0C0C0]/10 border-[#C0C0C0]/40"
                  : "bg-[#0a0d1a]/50 border-[#C0C0C0]/10 hover:border-[#C0C0C0]/30"
              }`}
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <feature.icon className={`w-8 h-8 mb-4 transition-colors ${
                activeFeature === feature.id ? "text-[#D4AF37]" : "text-[#C0C0C0]/60"
              }`} />
              <h4 className="text-white font-medium mb-2">{feature.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
