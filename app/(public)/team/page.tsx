import type { Metadata } from "next"
import Image from "next/image"
import { ArrowDown } from "lucide-react"
import { Footer } from "@/components/footer"
import { boards, ceo, ceoOffice, heads, incubator, partners, staff, type TeamMember } from "@/data/team"

export const metadata: Metadata = {
  title: "Tim | ASHIRA Group",
  description: "Struktur organisasi dan tim di balik ASHIRA Group.",
}

/* ------------------------------------------------------------------ */
/* Kartu anggota — Figma "Prototype / 3 · Team" (290 × 205)           */
/* ------------------------------------------------------------------ */

/** Ikon grup (Figma: "ganti sama icon grup / banyak avatar"). */
function GroupIcon() {
  return (
    <svg viewBox="0 0 120 72" className="h-16 w-auto" aria-hidden>
      <defs>
        <linearGradient id="team-group" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C2143" />
          <stop offset="100%" stopColor="#2B2996" />
        </linearGradient>
      </defs>
      <g fill="url(#team-group)">
        <circle cx="26" cy="18" r="12" />
        <circle cx="94" cy="18" r="12" />
        <circle cx="60" cy="16" r="14" />
        <path d="M4 62c0-13 10-22 22-22 6 0 11 2 15 6-5 5-8 11-8 18v2H4v-4z" />
        <path d="M116 62c0-13-10-22-22-22-6 0-11 2-15 6 5 5 8 11 8 18v2h29v-4z" />
        <path d="M32 66c0-15 12-26 28-26s28 11 28 26v4H32v-4z" />
      </g>
    </svg>
  )
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    // Bingkai 3px bergradien hitam → royal
    <div className="h-full rounded-[24px] bg-[linear-gradient(180deg,#04030D_0%,#2B2996_100%)] p-[3px] shadow-[0_6px_16px_rgba(10,18,51,0.12)]">
      <div className="relative flex h-full flex-col items-center justify-end overflow-hidden rounded-[21px] bg-[linear-gradient(135deg,#FFFFFF_0%,#F3F3F5_55%,#E4E4E8_100%)] px-2 pb-3 text-center">
        <div className="absolute inset-x-0 top-2 bottom-[34%] flex items-end justify-center">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              width={220}
              height={150}
              className="h-full w-auto object-contain object-bottom mix-blend-multiply [mask-image:radial-gradient(ellipse_62%_78%_at_50%_42%,#000_58%,transparent_100%)]"
            />
          ) : member.logo ? (
            <Image src={member.logo} alt={member.name} width={200} height={60} className="mb-4 h-auto w-[62%] object-contain mix-blend-multiply" />
          ) : member.group ? (
            <span className="mb-3">
              <GroupIcon />
            </span>
          ) : null}
        </div>
        <p className="relative text-[12px] leading-tight text-ashira-royal xl:text-[15px]">{member.role}</p>
        <p className="relative mt-0.5 text-[14px] font-bold leading-tight text-ashira-navy xl:text-[19px]">{member.name}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Bagan desktop — posisi persis dari Figma (kanvas 1250 × 1187 px)    */
/* ------------------------------------------------------------------ */

const W = 1250
const H = 1187
const CW = 290 // lebar kartu
const CH = 205 // tinggi kartu
const col = [0, 322, 638, 955] // x kolom baris kepala divisi & staf
const rowY = { boards: 0, ceo: 257, heads: 521, staff1: 756, staff2: 982 }

type Placed = { m: TeamMember; x: number; y: number }
const placed: Placed[] = [
  { m: boards[0], x: 230, y: rowY.boards },
  { m: boards[1], x: 730, y: rowY.boards },
  { m: incubator, x: 0, y: rowY.ceo },
  { m: ceo, x: 482, y: rowY.ceo },
  { m: ceoOffice, x: 960, y: rowY.ceo },
  ...heads.map((m, i) => ({ m, x: col[i], y: rowY.heads })),
  ...staff.slice(0, 4).map((m, i) => ({ m, x: col[i], y: rowY.staff1 })),
  ...staff.slice(4, 8).map((m, i) => ({ m, x: col[i], y: rowY.staff2 })),
]

const mid = (y: number) => y + CH / 2
const cx = (x: number) => x + CW / 2
/** Garis penghubung: [x1, y1, x2, y2] — horizontal atau vertikal. */
const lines: [number, number, number, number][] = [
  [520, mid(0), 730, mid(0)], // Pengawas — Komisaris
  [625, mid(0), 625, rowY.ceo], // turun ke CEO
  [290, mid(rowY.ceo), 482, mid(rowY.ceo)], // Inkubator — CEO
  [772, mid(rowY.ceo), 960, mid(rowY.ceo)], // CEO — Assistant
  [625, rowY.ceo + CH, 625, 506], // CEO turun ke bar kepala divisi
  [cx(col[0]), 506, cx(col[3]), 506], // bar kepala divisi
  ...col.map((x) => [cx(x), 506, cx(x), rowY.heads] as [number, number, number, number]),
  [CW, mid(rowY.heads), col[1], mid(rowY.heads)], // Finance — CTO
  [col[2] + CW, mid(rowY.heads), col[3], mid(rowY.heads)], // CSO — Marcomm
  [cx(col[0]), rowY.heads + CH, cx(col[0]), rowY.staff1], // Finance → General & Legal
  [cx(col[1]), rowY.heads + CH, cx(col[1]), rowY.staff1], // CTO → Divisi Tech
  [cx(col[1]), rowY.staff1 + CH, cx(col[1]), rowY.staff2], // Divisi Tech → Divisi Tech
  [cx(col[3]), rowY.heads + CH, cx(col[3]), rowY.staff1], // Marcomm → Content
  [col[2] + CW, mid(rowY.staff1), col[3], mid(rowY.staff1)], // Designer — Content
  [CW, mid(rowY.staff2), col[1], mid(rowY.staff2)], // Divisi Tech — Divisi Tech
]

const pctX = (v: number) => `${(v / W) * 100}%`
const pctY = (v: number) => `${(v / H) * 100}%`

function OrgChartDesktop() {
  return (
    <div className="relative mx-auto hidden w-full max-w-[1250px] lg:block" style={{ aspectRatio: `${W} / ${H}` }}>
      {lines.map(([x1, y1, x2, y2], i) => (
        <span
          key={i}
          aria-hidden
          className="absolute bg-ashira-ink"
          style={
            y1 === y2
              ? { left: pctX(Math.min(x1, x2)), width: pctX(Math.abs(x2 - x1)), top: pctY(y1), height: 3, marginTop: -1.5 }
              : { top: pctY(Math.min(y1, y2)), height: pctY(Math.abs(y2 - y1)), left: pctX(x1), width: 3, marginLeft: -1.5 }
          }
        />
      ))}
      {placed.map(({ m, x, y }) => (
        <div
          key={`${m.name}-${m.role}`}
          className="absolute"
          style={{ left: pctX(x), top: pctY(y), width: pctX(CW), height: pctY(CH) }}
        >
          <MemberCard member={m} />
        </div>
      ))}
    </div>
  )
}

/** < 1024px: Figma tidak punya versi mobile — kartu yang sama disusun berurutan tanpa garis. */
function OrgChartMobile() {
  const all = [...boards, incubator, ceo, ceoOffice, ...heads, ...staff]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:hidden">
      {all.map((m) => (
        <div key={`${m.name}-${m.role}`} className="aspect-[290/205]">
          <MemberCard member={m} />
        </div>
      ))}
    </div>
  )
}

export default function TeamPage() {
  return (
    <main className="ashira-page-gradient min-h-screen">
      {/* Hero — foto gedung + gradien gelap ke royal (Figma) */}
      <section className="relative isolate flex min-h-[640px] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center lg:min-h-[810px] lg:pt-[88px]">
        <div aria-hidden className="absolute inset-0 -z-20 bg-[url('/images/decor/building.webp')] bg-cover bg-center" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(4,3,13,0.97)_0%,rgba(28,33,67,0.9)_45%,rgba(43,41,150,0.88)_100%)]"
        />
        <div
          aria-hidden
          className="absolute -right-40 -top-40 -z-10 h-[520px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(184,153,203,0.45)_0%,rgba(43,41,150,0)_70%)]"
        />
        <p className="text-sm text-white sm:text-base">Struktur Organisasi</p>
        <h1 className="ashira-silver-text mt-6 text-[48px] font-bold leading-[1] tracking-[-0.05em] sm:text-[80px] lg:text-[96px]">
          Tim dibalik
          <br />
          ASHIRA Group
        </h1>
        <p className="mt-10 max-w-[760px] text-base leading-[1.3] text-white sm:text-[20px]">
          Suatu karya hebat selalu lahir dari insan yang percaya bahwa setiap kolaborasi adalah sebuah kunci untuk
          mencapai tujuan bersama
        </p>
        <a
          href="#struktur"
          aria-label="Lihat struktur organisasi"
          className="mt-14 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ashira-ink transition-transform hover:translate-y-0.5"
        >
          <ArrowDown className="h-6 w-6" strokeWidth={2.2} />
        </a>
      </section>

      {/* Bagan organisasi */}
      <section id="struktur" className="relative isolate scroll-mt-24 overflow-hidden px-4 pb-24 pt-16 sm:px-8">
        <div aria-hidden className="ashira-grid-pattern absolute inset-0 -z-20" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[url('/images/decor/building.webp')] bg-cover bg-bottom opacity-[0.1] blur-[3px] grayscale"
        />
        <OrgChartDesktop />
        <OrgChartMobile />

        <h2 className="mt-20 text-center text-2xl font-bold tracking-[0.01em] text-ashira-ink sm:text-[40px]">
          Supporting Team &amp; Partners
        </h2>
        <div className="mx-auto mt-10 w-[250px] sm:w-[290px]" style={{ aspectRatio: `${CW} / ${CH}` }}>
          <MemberCard member={partners[0]} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
