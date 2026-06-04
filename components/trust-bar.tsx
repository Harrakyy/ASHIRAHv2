"use client"

const clients = [
  { name: "Universitas Indonesia", short: "UI" },
  { name: "IPB University", short: "IPB" },
  { name: "IKABA FIB UI", short: "IKABA" },
  { name: "Syabaab Ussunnah", short: "SS" },
  { name: "Corporate Partners", short: "CORP" },
  { name: "Local Brands", short: "LOCAL" },
  { name: "Student Organizations", short: "ORMAWA" },
  { name: "Government Agencies", short: "GOV" },
]

export function TrustBar() {
  return (
    <section className="py-16 bg-navy">
      <style>
        {`
          @keyframes marquee-rtl {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            animation: marquee-rtl 30s linear infinite;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-2" style={{ color: '#D4AF37' }}>
            Trusted By
          </p>
          <h3 className="text-lg text-white">
            Partnering with Visionary Organizations Across Universities & Corporates in Indonesia
          </h3>
        </div>

        {/* Scrolling logos */}
        <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
          <div className="marquee-track flex gap-12 w-max">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={index}
                className="group flex items-center justify-center px-8 py-4 bg-white border border-gray-200 hover:border-[#D4AF37]/50 transition-all duration-300 min-w-[180px]"
              >
                <div className="text-center">
                  <p className="text-2xl font-serif text-black">
                    {client.short}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {client.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Keywords */}
        <div className="mt-10 text-center">
          <p className="text-xs text-white max-w-3xl mx-auto">
            Premium Apparel Manufacturer based in Tangerang, Serving Nationwide | 
            Konveksi Premium Jakarta | Custom Varsity Jacket Indonesia | 
            Pengiriman Seluruh Indonesia | Produksi Seragam Berkualitas
          </p>
        </div>
      </div>
    </section>
  )
}
