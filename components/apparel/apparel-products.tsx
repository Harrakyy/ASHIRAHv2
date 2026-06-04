"use client"

import { Shirt, Crown, Briefcase, Award, BadgeCheck, Layers, Wind, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const products = [
  {
    icon: Shirt,
    title: "Jersey Custom",
    materials: ["Jersey Print", "Jersey Sablon"],
    options: ["Full Print", "Sablon Polyflex", "DTF", "Manual"],
    description: "High-performance sports jerseys with premium printing quality for teams and organizations.",
    price: "Starting from Rp 75.000",
    specs: [
      { icon: Wind, label: "High Breathability" },
      { icon: Shield, label: "Durable Print" },
    ],
  },
  {
    icon: Layers,
    title: "T-Shirt Custom",
    materials: ["PE", "18s", "24s", "30s", "Jersey", "Biowash"],
    options: ["Full Print", "Sablon Polyflex", "DTF", "Manual"],
    description: "Versatile custom t-shirts with premium fabric options for any occasion or event.",
    price: "Starting from Rp 50.000",
    specs: [
      { icon: Zap, label: "Premium Cotton" },
      { icon: Wind, label: "Comfortable Fit" },
    ],
  },
  {
    icon: Crown,
    title: "Varsity Jacket",
    materials: ["Cotton Fleece", "Canvas", "Wool Blend"],
    options: ["Full Print", "Bordir Timbul", "Bordir Biasa"],
    description: "Classic varsity jackets with premium embroidery options for schools and organizations.",
    price: "Starting from Rp 180.000",
    specs: [
      { icon: Shield, label: "Premium Materials" },
      { icon: Award, label: "Custom Patches" },
    ],
  },
  {
    icon: Briefcase,
    title: "Work Jacket",
    materials: ["Canvas", "Corduroy", "Harrington", "American Drill"],
    options: ["Bordir Timbul", "Bordir Biasa", "Full Print"],
    description: "Professional work jackets built for durability, style, and corporate identity.",
    price: "Starting from Rp 150.000",
    specs: [
      { icon: Shield, label: "Heavy Duty" },
      { icon: Wind, label: "All Weather" },
    ],
  },
  {
    icon: Award,
    title: "Almamater",
    materials: ["American Drill", "Hightwist"],
    options: ["Bordir Biasa", "Bordir Timbul"],
    description: "Prestigious alma mater jackets for educational institutions with professional finishing.",
    price: "Starting from Rp 200.000",
    specs: [
      { icon: Award, label: "Official Grade" },
      { icon: Shield, label: "Long Lasting" },
    ],
  },
  {
    icon: BadgeCheck,
    title: "Polo & Kemeja",
    materials: ["POLO", "American Drill", "Ribstop", "Jersey"],
    options: ["Bordir Timbul", "Bordir Biasa", "Sablon"],
    description: "Professional polo shirts and dress shirts for corporate uniforms and events.",
    price: "Starting from Rp 85.000",
    specs: [
      { icon: BadgeCheck, label: "Corporate Grade" },
      { icon: Wind, label: "Easy Care" },
    ],
  },
]

const additionalProducts = [
  "PDL/Field Jackets",
  "Vest/Rompi",
  "Lanyard & ID Card",
  "Topi Custom",
  "Goodie Bag",
  "Masker Custom",
]

export function ApparelProducts() {
  return (
    <section id="products" className="py-24 lg:py-32 bg-[#0a0d1a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#C0C0C0]" />
            <span className="text-[#C0C0C0] text-sm font-medium tracking-[0.2em] uppercase">
              Product Catalog
            </span>
            <div className="h-px w-12 bg-[#C0C0C0]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
            Premium Custom Apparel
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
            Konveksi kustom untuk mahasiswa dengan harga yang bisa dinegosiasi. 
            Clothing event dan produksi seragam berkualitas tinggi.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative bg-[#1c2143]/50 border border-[#C0C0C0]/10 hover:border-[#C0C0C0]/30 transition-all duration-500 overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#C0C0C0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-8">
                {/* Icon */}
                <div className="w-14 h-14 bg-[#C0C0C0]/10 flex items-center justify-center mb-6 group-hover:bg-[#C0C0C0]/20 transition-colors">
                  <product.icon className="w-7 h-7 text-[#C0C0C0]" />
                </div>

                {/* Title & Price */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-xl text-white">
                    {product.title}
                  </h3>
                </div>
                <p className="text-[#D4AF37] text-sm font-medium mb-4">
                  {product.price}
                </p>

                {/* Description */}
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Specs */}
                <div className="flex gap-4 mb-6">
                  {product.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex items-center gap-2">
                      <spec.icon className="w-4 h-4 text-[#C0C0C0]/60" />
                      <span className="text-xs text-white/40">{spec.label}</span>
                    </div>
                  ))}
                </div>

                {/* Materials & Options */}
                <div className="space-y-3 pt-4 border-t border-[#C0C0C0]/10">
                  <div>
                    <span className="text-xs text-[#C0C0C0] font-medium tracking-wide uppercase">
                      Materials
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.materials.map((material, mIndex) => (
                        <span key={mIndex} className="text-xs text-white/40 bg-white/5 px-2 py-1">
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-[#C0C0C0] font-medium tracking-wide uppercase">
                      Print Options
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.options.map((option, oIndex) => (
                        <span key={oIndex} className="text-xs text-white/40 bg-white/5 px-2 py-1">
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Products */}
        <div className="mt-12 p-8 bg-[#1c2143]/30 border border-[#C0C0C0]/10">
          <p className="text-center text-sm text-white/50 mb-4">
            Also Available:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {additionalProducts.map((product, index) => (
              <span key={index} className="text-white/70 text-sm px-4 py-2 border border-[#C0C0C0]/20 hover:border-[#C0C0C0]/40 transition-colors">
                {product}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-10 py-6 text-base font-medium transition-all hover:scale-105"
            style={{ backgroundColor: '#C0C0C0', color: '#0a0d1a' }}
          >
            <Link href="/order">
              Request Custom Quote
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
