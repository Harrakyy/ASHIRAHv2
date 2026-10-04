import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="rounded-t-[32px] bg-[#12113a] text-white text-sm leading-[1.7] lg:rounded-t-[44px] overflow-hidden flex flex-col">
      {/* CTA Section */}
      <section className="bg-[linear-gradient(100deg,#2d2c8f,#12113a_70%)] border-b border-white/15">
        <div className="max-w-[1160px] mx-auto px-6 flex flex-wrap gap-5 items-center justify-between py-9">
          <div>
            <h2 className="m-0 text-[clamp(24px,3.4vw,34px)] leading-[1.2] font-bold max-w-[18ch]">
              Book an Appointment With Us!
            </h2>
            <p className="mt-1.5 text-[#b9bce0] max-w-[44ch]">
              Diskusikan kebutuhan apparel dan teknologi Anda langsung dengan tim kami.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="mailto:corporate@ashiragroup.id"
              className="px-5.5 py-3 rounded-full font-semibold border-[1.5px] border-white bg-white text-[#12113a] hover:bg-[#b9bce0] transition-colors duration-200"
            >
              Buat janji temu
            </a>
            <a
              href="https://wa.me/628194445006"
              className="px-5.5 py-3 rounded-full font-semibold border-[1.5px] border-white hover:bg-white/10 transition-colors duration-200"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-[1160px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1.5fr] gap-8 lg:gap-10 pt-10 lg:pt-14 pb-12 w-full">
        {/* Brand */}
        <div className="brand">
          <b className="text-[22px] font-bold tracking-wide">
            ASHIRA <span className="font-normal">Group</span>
          </b>
          <p className="text-[#b9bce0] mt-3 mb-4.5 max-w-[34ch]">
            Holding company yang menaungi bisnis apparel dan teknologi, berbasis di Science Techno Park Universitas Indonesia.
          </p>
          <div className="italic text-white text-[13px] max-w-[30ch]">
            Do <strong className="font-bold">Progressive</strong>, Think <strong className="font-bold">Transformative</strong>, Act <strong className="font-bold">Collaborative</strong>
          </div>
        </div>

        {/* Jelajahi */}
        <nav aria-label="Navigasi">
          <h3 className="m-0 mb-3.5 text-[15px] font-semibold">Jelajahi</h3>
          <ul className="m-0 p-0 list-none space-y-2">
            <li><Link href="/" className="text-[#b9bce0] hover:text-white transition-colors duration-200">Beranda</Link></li>
            <li><Link href="/#about" className="text-[#b9bce0] hover:text-white transition-colors duration-200">Tentang Kami</Link></li>
            <li><Link href="/#services" className="text-[#b9bce0] hover:text-white transition-colors duration-200">Layanan</Link></li>
            <li><Link href="/#news" className="text-[#b9bce0] hover:text-white transition-colors duration-200">Berita &amp; Kegiatan</Link></li>
            <li><Link href="/#careers" className="text-[#b9bce0] hover:text-white transition-colors duration-200">Karier</Link></li>
            <li><Link href="/#contact" className="text-[#b9bce0] hover:text-white transition-colors duration-200">Hubungi Kami</Link></li>
          </ul>
        </nav>

        {/* Unit bisnis */}
        <nav aria-label="Unit bisnis">
          <h3 className="m-0 mb-3.5 text-[15px] font-semibold">Unit bisnis</h3>
          <ul className="m-0 p-0 list-none space-y-2">
            <li>
              <Link href="/apparel" className="text-[#b9bce0] hover:text-white transition-colors duration-200 group">
                PT Ashira Swarna Apparel
                <small className="block text-[#b9bce0] opacity-75 text-xs leading-[1.4] mt-0.5 group-hover:text-white group-hover:opacity-100 transition-colors">Produksi dan layanan apparel</small>
              </Link>
            </li>
            <li>
              <Link href="/#tech" className="text-[#b9bce0] hover:text-white transition-colors duration-200 group">
                PT Ashira Technology
                <small className="block text-[#b9bce0] opacity-75 text-xs leading-[1.4] mt-0.5 group-hover:text-white group-hover:opacity-100 transition-colors">Solusi teknologi dan digital</small>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact */}
        <div className="contact">
          <h3 className="m-0 mb-3.5 text-[15px] font-semibold">Hubungi kami</h3>
          <dl className="m-0">
            <dt className="font-semibold mt-3">Alamat</dt>
            <dd className="m-0 text-[#b9bce0]">Science Techno Park Universitas Indonesia Building Office, Kampus UI, Depok, Jawa Barat, Indonesia</dd>
            
            <dt className="font-semibold mt-3">Telepon / WhatsApp</dt>
            <dd className="m-0 text-[#b9bce0] flex flex-col sm:flex-row sm:items-center">
              <span className="inline-block min-w-[118px]">ASHIRA Group</span>
              <a href="tel:+628194445006" className="hover:text-white transition-colors duration-200">+62 819 4445 5006</a>
            </dd>
            <dd className="m-0 text-[#b9bce0] flex flex-col sm:flex-row sm:items-center">
              <span className="inline-block min-w-[118px]">Ashira Swarna Apparel</span>
              <a href="tel:+628118880557" className="hover:text-white transition-colors duration-200">+62 811 8880 557</a>
            </dd>
            <dd className="m-0 text-[#b9bce0] flex flex-col sm:flex-row sm:items-center">
              <span className="inline-block min-w-[118px]">ASHIRATECH</span>
              <a href="tel:+6288200064080856" className="hover:text-white transition-colors duration-200">+62 882 0064 80856</a>
            </dd>
            
            <dt className="font-semibold mt-3">Email</dt>
            <dd className="m-0 text-[#b9bce0]">
              <a href="mailto:corporate@ashiragroup.id" className="hover:text-white transition-colors duration-200 block">corporate@ashiragroup.id</a>
              <a href="mailto:ashira.hmco@gmail.com" className="hover:text-white transition-colors duration-200 block mt-0.5">ashira.hmco@gmail.com</a>
            </dd>
          </dl>
          
          <div className="flex gap-3.5 items-center mt-4.5">
            <div className="w-[76px] h-[76px] bg-white rounded-lg p-1.5 flex items-center justify-center text-[#12113a]">
              <Image 
                src="/images/kodeqr_ASHIRAGroup.png" 
                alt="QR Code Tautan ASHIRA Group" 
                width={64} 
                height={64} 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="m-0 text-[#b9bce0] text-xs">
              Semua tautan kami<br />
              <a href="https://linktr.ee/ashira.group" className="text-white font-semibold hover:underline" target="_blank" rel="noreferrer">linktr.ee/ashira.group</a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/15 w-full mt-auto">
        <div className="max-w-[1160px] mx-auto px-6 flex flex-wrap gap-y-3 gap-x-7 justify-between py-5 lg:pb-6 text-[#b9bce0] text-[13px]">
          <span>&copy; {new Date().getFullYear()} ASHIRA Group. Seluruh hak cipta dilindungi.</span>
          <nav aria-label="Legal" className="flex gap-5.5 flex-wrap">
            <Link href="/privacy" className="hover:text-white transition-colors duration-200">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-200">Syarat &amp; Ketentuan</Link>
            <Link href="https://ashiragroup.id" className="hover:text-white transition-colors duration-200">ashiragroup.id</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
