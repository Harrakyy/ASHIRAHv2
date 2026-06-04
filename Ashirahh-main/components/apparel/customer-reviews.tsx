"use client"

import { Star, Quote } from "lucide-react"

const reviews = [
  {
    name: "Budi Santoso",
    organization: "BEM FEB UI",
    rating: 5,
    review: "Kualitas jersey sangat bagus, printing tajam dan bahan adem. Tim sangat responsif dan profesional.",
  },
  {
    name: "Putri Rahayu",
    organization: "HIMA Teknik IPB",
    rating: 5,
    review: "Varsity jacket untuk wisuda kami hasilnya luar biasa. Detail bordir sangat rapi dan presisi.",
  },
  {
    name: "Ahmad Fauzi",
    organization: "Komunitas Futsal Jakarta",
    rating: 5,
    review: "Sudah 3x order jersey futsal disini. Konsisten berkualitas dan harga sangat bersahabat.",
  },
  {
    name: "Dewi Lestari",
    organization: "Event Organizer",
    rating: 5,
    review: "Kaos event 500 pcs selesai tepat waktu dengan kualitas prima. Recommended banget!",
  },
  {
    name: "Rizky Pratama",
    organization: "OSIS SMA Negeri 1",
    rating: 5,
    review: "Almamater untuk angkatan kami sangat bagus. Proses konsultasi desain sangat membantu.",
  },
  {
    name: "Siti Nurhaliza",
    organization: "Startup Tech Company",
    rating: 5,
    review: "Work jacket untuk tim kantor kami tampil profesional. Bahan canvas sangat awet.",
  },
  {
    name: "Andi Wijaya",
    organization: "Ikatan Alumni FIB UI",
    rating: 5,
    review: "Polo shirt untuk reuni alumni sangat memuaskan. Sablon tidak luntur setelah dicuci berkali-kali.",
  },
  {
    name: "Maya Indira",
    organization: "Dance Community",
    rating: 5,
    review: "Kostum dance full print hasilnya keren banget! Warna vibrant dan detail sempurna.",
  },
  {
    name: "Fajar Hidayat",
    organization: "Komunitas Basket",
    rating: 5,
    review: "Jersey basket custom dengan nomor punggung. Hasil printing berkualitas tinggi.",
  },
  {
    name: "Lina Marlina",
    organization: "NGO Foundation",
    rating: 5,
    review: "Kaos untuk program sosial kami dibuat dengan penuh dedikasi. Sangat menghargai kerja sama ini.",
  },
]

export function CustomerReviews() {
  return (
    <section className="py-24 lg:py-32 bg-[#0a0d1a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm font-medium tracking-[0.2em] uppercase">
              Testimonials
            </span>
            <div className="h-px w-12 bg-[#D4AF37]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6">
            What Our Customers Say
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
            Trusted by organizations, universities, and communities across Indonesia.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group p-6 bg-[#1c2143]/50 border border-[#C0C0C0]/10 hover:border-[#D4AF37]/30 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-[#D4AF37]/20 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                &ldquo;{review.review}&rdquo;
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-[#C0C0C0]/10">
                <p className="text-white font-medium">{review.name}</p>
                <p className="text-white/50 text-sm">{review.organization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
