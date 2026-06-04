import Image from "next/image"
import { Mail, Phone } from "lucide-react"

const teamMembers = [
  {
    name: "Hawari Muttaqin Mafaza",
    role: "CEO",
    company: "ASHIRA GROUP",
    quote: "Quality is not an act, it is a habit.",
    image: "/images/FOTO HAWARI.png",
    email: "ashira.hco@ashira.com",
    whatsapp: "6285819993633",
  },
  {
    name: "Muhammad Rahadian Dzaki",
    role: "CTO",
    company: "ASHIRA GROUP",
    image: "/images/FOTO DZAKI.png",
    email: "ashira.hco@ashira.com",
    whatsapp: "6285819993633",
  },
  {
    name: "Adithia Maulana",
    role: "CFO",
    company: "ASHIRA GROUP",
    image: "/images/FOTO ADIT.png",
    email: "ashira.hco@ashira.com",
    whatsapp: "6285819993633",
  },
  {
    name: "Amel",
    role: "CMO",
    company: "ASHIRA GROUP",
    image: "/images/FOTO AMEL.png",
    email: "ashira.hco@ashira.com",
    whatsapp: "6285819993633",
  },
  {
    name: "Safitri Az Zahra",
    role: "Corporate Secretary",
    company: "ASHIRA GROUP",
    image: "/images/FOTO SAFI.png",
    email: "ashira.hco@ashira.com",
    whatsapp: "6285819993633",
  },
]

const bulletPoints: Record<string, string[]> = {
  CEO: [
    "CEO & Pendiri Ashira Group",
    "Pemimpin strategis di bidang tekstil dan fashion",
    "Berpengalaman dalam pengembangan bisnis dan investasi",
  ],
  CTO: [
    "Chief Technology Officer Ashira Group",
    "Memimpin transformasi digital dan infrastruktur teknologi",
    "[Tambahkan keahlian teknologi / bidang spesialisasi]",
    "[Tambahkan latar belakang pendidikan atau pengalaman]",
  ],
  CFO: [
    "Chief Financial Officer Ashira Group",
    "Bertanggung jawab atas strategi keuangan perusahaan",
    "[Tambahkan keahlian / prestasi CFO]",
    "[Tambahkan latar belakang pendidikan atau pengalaman]",
  ],
  CMO: [
    "Chief Marketing Officer Ashira Group",
    "Memimpin strategi pemasaran dan pengembangan merek",
    "[Tambahkan keahlian / bidang spesialisasi CMO]",
    "[Tambahkan latar belakang pendidikan atau pengalaman]",
  ],
  "Corporate Secretary": [
    "Corporate Secretary Ashira Group",
    "Mengelola tata kelola perusahaan dan hubungan pemangku kepentingan",
    "[Tambahkan keahlian / spesialisasi Corporate Secretary]",
    "[Tambahkan latar belakang pendidikan atau pengalaman]",
  ],
}

export function TeamSection() {
  return (
    <section id="team" className="py-24 lg:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12" style={{ backgroundColor: "#D4AF37" }} />
            <span
              className="text-sm font-medium tracking-[0.2em] uppercase"
              style={{ color: "#D4AF37" }}
            >
              Kepemimpinan
            </span>
            <div className="h-px w-12" style={{ backgroundColor: "#D4AF37" }} />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-black leading-tight mb-4">
            Kenali Tim Eksekutif Kami
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Didorong oleh semangat dan komitmen terhadap keunggulan di setiap langkah.
          </p>
        </div>

        {/* Member rows */}
        <div className="flex flex-col gap-4">
          {teamMembers.map((member, index) => {
            const isReverse = index % 2 !== 0
            const bullets = bulletPoints[member.role] ?? []

            return (
              <div
                key={index}
                className={`flex overflow-hidden rounded-2xl shadow-xl ${isReverse ? "flex-row-reverse" : "flex-row"}`}
                style={{ backgroundColor: "#1c2143", minHeight: "180px" }}
              >
                {/* Photo */}
                <div
                  className="flex-none w-48 relative"
                  style={{
                    backgroundColor: "white",
                    boxShadow: isReverse
                      ? "-8px 0 24px rgba(0,0,0,0.45)"
                      : "8px 0 24px rgba(0,0,0,0.45)",
                  }}
                >
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: "center 20%" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)" }}
                      >
                        <span style={{ color: "#D4AF37", fontSize: "28px", opacity: 0.6 }}>?</span>
                      </div>
                      <span className="text-xs text-center px-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                        [Foto {member.role}]
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-center px-8 py-6">
                  {/* Role badge */}
                  <div className="mb-3">
                    <span
                      className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-sm"
                      style={{ backgroundColor: "#D4AF37", color: "#1c2143" }}
                    >
                      {member.role} — {member.company}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="font-serif text-2xl text-white mb-2">{member.name}</h3>

                  {/* Quote (CEO only) */}
                  {member.quote && (
                    <p className="text-sm italic mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                      &ldquo;{member.quote}&rdquo;
                    </p>
                  )}

                  {/* Bullet points */}
                  <ul className="mb-4 space-y-1">
                    {bullets.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                        <span style={{ color: "#D4AF37", fontSize: "14px", lineHeight: "1.1", flexShrink: 0 }}>·</span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Contact buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "#D4AF37", color: "#1c2143" }}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                    <a
                      href={`https://wa.me/${member.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full transition-opacity hover:opacity-80"
                      style={{ border: "1px solid #D4AF37", color: "#D4AF37" }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
