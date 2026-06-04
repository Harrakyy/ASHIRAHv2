import { User, Mail, Phone } from "lucide-react"

const teamMembers = [
  {
    name: "Aisya Rahma",
    role: "CEO",
    company: "ASHIRA Community",
    bio: "Passionate about social impact and youth empowerment.",
  },
  {
    name: "Muhammad Dewanditto Legowo",
    role: "COO",
    company: "ASHIRA Community",
    bio: "Experienced in operations and community development.",
  },
  {
    name: "Aulia Hasanah",
    role: "CMO",
    company: "ASHIRA Community",
    bio: "Creative strategist with a heart for social causes.",
  },
]

export function CommunityTeam() {
  return (
    <section id="team" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#2B7A78]" />
            <span className="text-[#2B7A78] text-sm font-medium tracking-[0.2em] uppercase">
              Our Team
            </span>
            <div className="h-px w-12 bg-[#2B7A78]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
            Meet the Team Behind ASHIRA Community
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dedicated individuals working together to create positive change in society.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group text-center p-8 bg-[#f0f7f7] hover:bg-gradient-to-br hover:from-[#2B7A78] hover:to-[#3aafa9] rounded-xl transition-all duration-500"
            >
              {/* Avatar */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white flex items-center justify-center border-4 border-[#2B7A78]/20 group-hover:border-white/30 transition-colors">
                <User className="w-12 h-12 text-[#2B7A78] group-hover:text-[#2B7A78]" />
              </div>

              {/* Info */}
              <p className="text-xs tracking-wider uppercase mb-1 text-[#2B7A78] group-hover:text-white/80 transition-colors">
                {member.role}
              </p>
              <h3 className="font-serif text-xl text-foreground group-hover:text-white mb-2 transition-colors">
                {member.name}
              </h3>
              <p className="text-sm text-muted-foreground group-hover:text-white/70 transition-colors">
                {member.bio}
              </p>

              {/* Contact */}
              <div className="flex justify-center gap-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href="mailto:ashira.community@ashira.com"
                  className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a 
                  href="https://wa.me/6285819993633"
                  className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-20 text-center p-8 bg-gradient-to-r from-[#2B7A78]/5 to-[#3aafa9]/5 rounded-xl">
          <h3 className="font-serif text-2xl text-foreground mb-4">
            Get In Touch
          </h3>
          <p className="text-muted-foreground mb-6">
            Interested in joining or partnering with ASHIRA Community?
          </p>
          <a
            href="mailto:ashira.community@ashira.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B7A78] text-white rounded-full hover:bg-[#3aafa9] transition-colors"
          >
            <Mail className="w-4 h-4" />
            ashira.community@ashira.com
          </a>
        </div>
      </div>
    </section>
  )
}
