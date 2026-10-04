import Link from "next/link"
import { ArrowRight, AtSign, Mail, MessageCircle } from "lucide-react"

export function ApparelCTA() {
  return (
    <section className="px-3 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-28">
      <div className="ashira-dark-gradient mx-auto max-w-[1376px] rounded-[32px] px-6 py-14 text-center shadow-[0_20px_48px_rgba(10,18,51,0.2)] sm:px-10 lg:rounded-[44px] lg:py-20">
        <span className="rounded-full border border-white/55 px-4 py-1.5 text-[13px] font-medium text-white">
          Siap Order?
        </span>

        <h2 className="ashira-silver-text mx-auto mt-6 max-w-[760px] text-[32px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[48px]">
          Mari Wujudkan Apparel Terbaikmu
        </h2>

        <p className="mx-auto mt-5 max-w-[640px] text-base leading-[1.6] text-[#D9D9D9] sm:text-lg">
          Hubungi tim kami untuk mendiskusikan kebutuhan apparel custom-mu. Harga bisa dinegosiasikan untuk pesanan
          dalam jumlah besar dan kemitraan khusus.
        </p>

        <div className="mx-auto mt-8 max-w-[560px] rounded-[24px] border border-white/15 bg-white/[0.07] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ashira-lilac">Penawaran Khusus</p>
          <p className="mt-2 text-lg font-semibold text-white">Konveksi ramah kantong mahasiswa dengan kualitas premium</p>
          <p className="mt-1 text-sm text-white/60">Harga boleh nego untuk pemesanan dalam jumlah besar</p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={process.env.NEXT_PUBLIC_CANVAS_URL || "https://canvas.ashiragroup.id/ashira-apparel"}
            className="ashira-silver-gradient inline-flex w-full items-center justify-center gap-2.5 rounded-full px-[26px] py-4 text-base font-semibold text-ashira-navy shadow-[0_8px_24px_rgba(4,3,13,0.3)] transition-transform hover:scale-[1.02] sm:w-auto"
          >
            Minta Penawaran <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://wa.me/6285819993633?text=Halo%20ASHIRA%2C%20saya%20ingin%20bertanya%20tentang%20pemesanan%20custom%20apparel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/50 px-[26px] py-4 text-base font-medium text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" /> Chat WhatsApp
          </a>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 text-sm text-white/60 sm:flex-row sm:gap-6">
          <a href="mailto:ashira.hco@ashira.com" className="flex items-center gap-2 transition-colors hover:text-white">
            <Mail className="h-4 w-4" /> ashira.hco@ashira.com
          </a>
          <span className="hidden text-white/25 sm:inline">|</span>
          <a
            href="https://instagram.com/ashira.hco"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-white"
          >
            <AtSign className="h-4 w-4" /> @ashira.hco
          </a>
        </div>
      </div>
    </section>
  )
}
