import { GraduationCap, Mic2, Heart, Users } from "lucide-react"

const services = [
  {
    icon: GraduationCap,
    title: "Education",
    description: "Providing educational resources and mentorship programs for underprivileged communities. We believe education is the foundation for positive change.",
    color: "#2B7A78",
  },
  {
    icon: Mic2,
    title: "Public Speaking",
    description: "Empowering youth through public speaking workshops and competitions. Building confidence and communication skills for the next generation.",
    color: "#3aafa9",
  },
  {
    icon: Heart,
    title: "Social Empowerment",
    description: "Community development programs focused on economic empowerment, health awareness, and social welfare initiatives.",
    color: "#5cc4bf",
  },
  {
    icon: Users,
    title: "Youth Development",
    description: "Creating platforms for young leaders to grow, connect, and make meaningful contributions to society.",
    color: "#17252a",
  },
]

export function CommunityServices() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#2B7A78]" />
            <span className="text-[#2B7A78] text-sm font-medium tracking-[0.2em] uppercase">
              What We Do
            </span>
            <div className="h-px w-12 bg-[#2B7A78]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
            Our Focus Areas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ASHIRA Community focuses on three main pillars to create lasting positive impact in society.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 bg-[#f0f7f7] hover:bg-white border border-transparent hover:border-[#2B7A78]/20 hover:shadow-lg transition-all duration-300 rounded-lg"
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${service.color}15` }}
              >
                <service.icon className="w-7 h-7" style={{ color: service.color }} />
              </div>

              <h3 className="font-serif text-xl text-foreground mb-3">
                {service.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Follow our journey and get involved
          </p>
          <a
            href="https://instagram.com/ashira.community"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#2B7A78] font-medium hover:underline"
          >
            @ashira.community
          </a>
        </div>
      </div>
    </section>
  )
}
