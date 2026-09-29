import { Star, Quote } from "lucide-react"
import { SectionBadge } from "@/components/landing/sections/BusinessSection"

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
    <section className="px-3 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-[1376px]">
        <div className="flex flex-col items-center text-center">
          <SectionBadge>Testimoni</SectionBadge>
          <h2 className="mt-5 text-[32px] font-bold tracking-[-0.02em] text-ashira-navy sm:text-[44px]">
            Kata Pelanggan Kami
          </h2>
          <p className="mt-3 max-w-[560px] text-base leading-[1.6] text-ashira-muted sm:text-lg">
            Dipercaya organisasi, kampus, dan komunitas di seluruh Indonesia.
          </p>
        </div>

        {/* flex-wrap + justify-center: kartu sisa di baris terakhir berada di tengah */}
        <div className="mt-10 flex flex-wrap justify-center gap-5 lg:gap-6">
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="w-full rounded-[24px] border border-white bg-white/90 p-6 shadow-[0_12px_32px_rgba(10,18,51,0.08)] md:w-[calc(50%-10px)] lg:w-[calc((100%-48px)/3)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5" aria-label={`Rating ${review.rating} dari 5`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-ashira-royal text-ashira-royal" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-ashira-navy/10" />
              </div>
              <blockquote className="mt-4 text-[15px] leading-[1.6] text-ashira-navy/85">
                &ldquo;{review.review}&rdquo;
              </blockquote>
              <figcaption className="mt-5 border-t border-ashira-navy/10 pt-4">
                <p className="font-semibold text-ashira-navy">{review.name}</p>
                <p className="text-sm text-ashira-muted">{review.organization}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
