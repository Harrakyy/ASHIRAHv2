import { Calendar, Mic2, Heart, Clock } from "lucide-react"

const projects = [
  {
    title: "Youth Public Speaking",
    subtitle: "Talks and Competition",
    description: "An annual public speaking competition for young talents to showcase their communication skills and inspire others.",
    status: "Coming Soon",
    date: "May 2026",
    icon: Mic2,
    highlight: true,
  },
  {
    title: "Bakti Sosial",
    subtitle: "Community Service Program",
    description: "Regular social service activities including food distribution, health checkups, and educational support for underprivileged communities.",
    status: "Coming Soon",
    date: "June 2026",
    icon: Heart,
    highlight: false,
  },
  {
    title: "Mentorship Program",
    subtitle: "Youth Development",
    description: "Connecting experienced professionals with young individuals to provide guidance, support, and career development opportunities.",
    status: "Ongoing",
    date: "Year-round",
    icon: Calendar,
    highlight: false,
  },
]

export function CommunityProjects() {
  return (
    <section id="programs" className="py-24 lg:py-32 bg-[#f0f7f7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-[#2B7A78]" />
            <span className="text-[#2B7A78] text-sm font-medium tracking-[0.2em] uppercase">
              Our Programs
            </span>
            <div className="h-px w-12 bg-[#2B7A78]" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-6">
            Upcoming Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join us in our upcoming initiatives and be part of the positive change we&apos;re creating.
          </p>
        </div>

        {/* Projects */}
        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl ${
                project.highlight 
                  ? 'bg-gradient-to-br from-[#2B7A78] to-[#3aafa9] text-white' 
                  : 'bg-white border border-[#2B7A78]/10'
              }`}
            >
              {/* Status badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full ${
                project.highlight 
                  ? 'bg-white/20 text-white' 
                  : project.status === 'Ongoing' 
                    ? 'bg-[#2B7A78]/10 text-[#2B7A78]' 
                    : 'bg-[#f0f7f7] text-muted-foreground'
              }`}>
                {project.status}
              </div>

              <div className="p-8">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${
                  project.highlight ? 'bg-white/20' : 'bg-[#2B7A78]/10'
                }`}>
                  <project.icon className={`w-7 h-7 ${
                    project.highlight ? 'text-white' : 'text-[#2B7A78]'
                  }`} />
                </div>

                {/* Content */}
                <p className={`text-xs tracking-wider uppercase mb-2 ${
                  project.highlight ? 'text-white/70' : 'text-[#2B7A78]'
                }`}>
                  {project.subtitle}
                </p>
                <h3 className={`font-serif text-2xl mb-3 ${
                  project.highlight ? 'text-white' : 'text-foreground'
                }`}>
                  {project.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-6 ${
                  project.highlight ? 'text-white/80' : 'text-muted-foreground'
                }`}>
                  {project.description}
                </p>

                {/* Date */}
                <div className={`flex items-center gap-2 pt-4 border-t ${
                  project.highlight ? 'border-white/20' : 'border-[#2B7A78]/10'
                }`}>
                  <Clock className={`w-4 h-4 ${
                    project.highlight ? 'text-white/60' : 'text-muted-foreground'
                  }`} />
                  <span className={`text-sm ${
                    project.highlight ? 'text-white/60' : 'text-muted-foreground'
                  }`}>
                    {project.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-full border border-[#2B7A78]/20">
            <span className="text-foreground font-medium">Interested in collaborating?</span>
            <a
              href="mailto:ashira.community@ashira.com"
              className="text-[#2B7A78] font-medium hover:underline"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
