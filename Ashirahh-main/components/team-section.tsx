import { User, Mail, Phone } from "lucide-react"

const teamMembers = [
  {
    name: "Hawari Muttaqin Mafaza",
    role: "CEO",
    company: "ASHIRA GROUP",
    quote: "Quality is not an act, it is a habit.",
    featured: true,
  },
  {
    name: "Adithia Maulana",
    role: "CFO",
    company: "ASHIRA GROUP",
    featured: false,
  },
  {
    name: "Muhammad Rahadian Dzaki",
    role: "CTO",
    company: "ASHIRA GROUP",
    featured: false,
  },
  {
    name: "Safitri Az Zahra",
    role: "Corporate Secretary",
    company: "ASHIRA GROUP",
    featured: false,
  },
]

export function TeamSection() {
  const ceo = teamMembers.find(m => m.featured)
  const others = teamMembers.filter(m => !m.featured)

  return (
    <section id="team" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12" style={{ backgroundColor: '#D4AF37' }} />
            <span className="text-sm font-medium tracking-[0.2em] uppercase" style={{ color: '#D4AF37' }}>
              Leadership
            </span>
            <div className="h-px w-12" style={{ backgroundColor: '#D4AF37' }} />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6 text-balance">
            Meet Our Executive Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Driven by passion and commitment to excellence in every stitch.
          </p>
        </div>

        {/* CEO Featured Card */}
        {ceo && (
          <div className="mb-12">
            <div className="max-w-3xl mx-auto p-8 lg:p-12 border-2 relative" style={{ borderColor: '#D4AF37', backgroundColor: '#1c2143' }}>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Avatar placeholder */}
                <div className="w-32 h-32 rounded-full flex items-center justify-center border-4" style={{ borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
                  <User className="w-16 h-16 text-white/50" />
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <p className="text-sm tracking-[0.2em] uppercase mb-2" style={{ color: '#D4AF37' }}>
                    {ceo.role} - {ceo.company}
                  </p>
                  <h3 className="font-serif text-2xl lg:text-3xl text-white mb-4">
                    {ceo.name}
                  </h3>
                  <blockquote className="border-l-2 pl-4" style={{ borderColor: '#D4AF37' }}>
                    <p className="text-white/70 italic text-lg">
                      &ldquo;{ceo.quote}&rdquo;
                    </p>
                  </blockquote>
                </div>
              </div>

              {/* Contact buttons */}
              <div className="flex justify-center lg:justify-end gap-4 mt-6">
                <a 
                  href="mailto:ashira.hco@ashira.com"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
                <a 
                  href="https://wa.me/6285819993633"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Other team members */}
        <div className="grid md:grid-cols-3 gap-6">
          {others.map((member, index) => (
            <div
              key={index}
              className="group p-6 bg-card border border-border hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-secondary border border-border group-hover:border-[#D4AF37]/50 transition-colors">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>

              <div className="text-center">
                <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: '#D4AF37' }}>
                  {member.role}
                </p>
                <h3 className="font-serif text-lg text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {member.company}
                </p>
              </div>

              {/* Hover contact */}
              <div className="flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href="mailto:ashira.hco@ashira.com"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a 
                  href="https://wa.me/6285819993633"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
