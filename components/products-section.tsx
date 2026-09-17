"use client"

import Image from "next/image"

const products = [
  {
    image: "https://images.unsplash.com/photo-1551479460-5e76c686816a?w=640&q=80&auto=format&fit=crop",
    title: "Jersey Custom",
    materials: "Jersey Print, Jersey Sablon",
    options: "Full Print, Sablon Polyflex, DTF, Manual",
    reviews: "4k Reviews",
  },
  {
    image: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=640&q=80&auto=format&fit=crop",
    title: "T-Shirt Custom",
    materials: "PE, 18s, 24s, 30s, Jersey, Biowash",
    options: "Full Print, Sablon Polyflex, DTF, Manual",
    reviews: "6k Reviews",
  },
  {
    image: "https://images.unsplash.com/photo-1535325019257-3f8a7994a3f3?w=640&q=80&auto=format&fit=crop",
    title: "Varsity Custom",
    materials: "Cotton Fleece, Canvas, etc.",
    options: "Full Print, Bordir Timbul, Bordir Biasa",
    reviews: "2k Reviews",
  },
  {
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=640&q=80&auto=format&fit=crop",
    title: "Work Jacket",
    materials: "Canvas, Corduroy, Harrington, American Drill",
    options: "Bordir Timbul, Bordir Biasa, Full Print",
    reviews: "3k Reviews",
  },
  {
    image: "https://images.unsplash.com/photo-1770757587875-18505e8c4054?w=640&q=80&auto=format&fit=crop",
    title: "Almamater",
    materials: "American Drill, Hightwist",
    options: "Bordir Biasa, Bordir Timbul",
    reviews: "1k Reviews",
  },
  {
    image: "https://images.unsplash.com/photo-1608034809014-73e7d72f25b4?w=640&q=80&auto=format&fit=crop",
    title: "Polo & Kemeja",
    materials: "POLO, American Drill, Ribstop, Jersey",
    options: "Bordir Timbul, Bordir Biasa, Sablon",
    reviews: "5k Reviews",
  },
]

export function ProductsSection() {
  return (
    <section id="products" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-7" style={{ backgroundColor: '#D4AF37' }} />
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
                Our Products
              </span>
            </div>
            <h2
               className="text-gray-900 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600 }}
            >
              Premium Custom<br />Apparel
            </h2>
          </div>
          <button className="bg-gray-900 text-white text-xs font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors tracking-wide whitespace-nowrap mb-1">
            See All →
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div
              key={index}
               className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden shrink-0">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                {/* Title */}
                <h3
                   className="text-gray-900 mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "20px", fontWeight: 600 }}
                >
                  {product.title}
                </h3>

                {/* Stars + Reviews */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-amber-400 text-xs tracking-widest">★★★★★</span>
                  <span className="text-gray-500 text-[11px]">{product.reviews}</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-4" />

                {/* Materials & Options */}
                <div className="flex flex-col gap-2.5 mb-5 flex-1">
                  <div>
                    <span className="text-[10px] text-[#1c2143] font-medium tracking-[0.18em] uppercase block mb-1">
                      Materials
                    </span>
                    <p className="text-[12px] text-gray-600 leading-relaxed">
                      {product.materials}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#1c2143] font-medium tracking-[0.18em] uppercase block mb-1">
                      Options
                    </span>
                    <p className="text-[12px] text-gray-600 leading-relaxed">
                      {product.options}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full py-2.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[#1c2143] border border-[#1c2143]/40 rounded-lg hover:bg-[#1c2143] hover:text-white transition-all duration-200">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-[11px] text-gray-400 tracking-wide">
            Also available:{" "}
            <span className="text-gray-600">PDL/Field Jackets</span>
            {" · "}
            <span className="text-gray-600">Vest/Rompi</span>
            {" · "}
            <span className="text-gray-600">Lanyard & ID Card</span>
          </p>
        </div>
      </div>
    </section>
  )
}
