import { Droplets, Leaf, Shield } from "lucide-react"

const fabricFeatures = [
  {
    icon: Droplets,
    title: "Moisture Wicking",
    description: "Teknologi kain yang menarik keringat dari tubuh sehingga tetap kering dan nyaman saat beraktivitas intens.",
  },
  {
    icon: Shield,
    title: "Premium 24s Aerocool",
    description: "Campuran katun andalan kami yang lebih adem dan lembut, cocok dipakai sehari-hari.",
  },
  {
    icon: Leaf,
    title: "Katun Berkelanjutan",
    description: "Bahan katun ramah lingkungan yang tetap memenuhi standar kualitas premium.",
  },
]

export function FabricShowcase() {
  return (
    <section className="px-3 py-8 sm:px-6 lg:px-8">
      <div className="ashira-dark-gradient mx-auto max-w-[1376px] rounded-[32px] px-6 py-12 shadow-[0_20px_48px_rgba(10,18,51,0.2)] sm:px-10 lg:rounded-[44px] lg:px-16 lg:py-16">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-white/55 px-4 py-1.5 text-[13px] font-medium text-white">
            Fabric Technology
          </span>
          <h2 className="ashira-silver-text mt-5 text-[30px] font-bold tracking-[-0.02em] sm:text-[42px]">
            Bahan Premium, Kualitas Unggul
          </h2>
          <p className="mt-3 max-w-[600px] text-base leading-[1.6] text-[#D9D9D9]">
            Bahan pilihan yang membuat apparel kami nyaman dipakai dan tahan lama.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {fabricFeatures.map((feature) => (
            <div key={feature.title} className="rounded-[24px] border border-white/15 bg-white/[0.07] p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ashira-royal">
                <feature.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-[#C9CAD9]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
