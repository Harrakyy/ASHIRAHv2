"use client"

import { Shirt, Crown, Briefcase, Award, BadgeCheck, Layers } from "lucide-react"

const products = [
  {
    icon: Shirt,
    title: "Jersey Custom",
    materials: "Jersey Print, Jersey Sablon",
    options: "Full Print, Sablon Polyflex, DTF, Manual",
    description: "High-performance sports jerseys with premium printing quality.",
  },
  {
    icon: Layers,
    title: "T-Shirt Custom",
    materials: "PE, 18s, 24s, 30s, Jersey, Biowash",
    options: "Full Print, Sablon Polyflex, DTF, Manual",
    description: "Versatile custom t-shirts for any occasion or event.",
  },
  {
    icon: Crown,
    title: "Varsity Custom",
    materials: "Cotton Fleece, Canvas, etc.",
    options: "Full Print, Bordir Timbul, Bordir Biasa",
    description: "Classic varsity jackets with premium embroidery options.",
  },
  {
    icon: Briefcase,
    title: "Work Jacket",
    materials: "Canvas, Corduroy, Harrington, American Drill",
    options: "Bordir Timbul, Bordir Biasa, Full Print",
    description: "Professional work jackets built for durability and style.",
  },
  {
    icon: Award,
    title: "Almamater",
    materials: "American Drill, Hightwist",
    options: "Bordir Biasa, Bordir Timbul",
    description: "Prestigious alma mater jackets for educational institutions.",
  },
  {
    icon: BadgeCheck,
    title: "Polo & Kemeja",
    materials: "POLO, American Drill, Ribstop, Jersey",
    options: "Bordir Timbul, Bordir Biasa, Sablon",
    description: "Professional polo shirts and dress shirts for corporate needs.",
  },
]

export function ProductsSection() {
  return (
    <section id="products" className="py-24 lg:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-teal" />
            <span className="text-teal text-sm font-medium tracking-[0.2em] uppercase">
              Our Products
            </span>
            <div className="h-px w-12 bg-teal" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6 text-balance">
            Premium Custom Apparel Solutions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From sports jerseys to corporate uniforms, we deliver exceptional quality 
            with flexible customization options for every need.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="group bg-card p-8 border border-border hover:border-teal/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-navy/5 flex items-center justify-center mb-6 group-hover:bg-teal/10 transition-colors">
                <product.icon className="w-6 h-6 text-navy group-hover:text-teal transition-colors" />
              </div>

              <h3 className="font-serif text-xl text-foreground mb-3">
                {product.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-2 pt-4 border-t border-border">
                <div>
                  <span className="text-xs text-teal font-medium tracking-wide uppercase">
                    Materials
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.materials}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-teal font-medium tracking-wide uppercase">
                    Options
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.options}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Products Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Also available: <span className="text-foreground">PDL/Field Jackets</span>, 
            <span className="text-foreground"> Vest/Rompi</span>, 
            <span className="text-foreground"> Lanyard & ID Card</span>
          </p>
        </div>
      </div>
    </section>
  )
}
