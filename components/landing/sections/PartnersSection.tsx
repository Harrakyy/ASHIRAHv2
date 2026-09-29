import Image from "next/image"
import { partnerGroups, type PartnerGroup } from "@/data/partners"
import { SectionBadge } from "./BusinessSection"

const card =
  "rounded-[28px] border border-white bg-[linear-gradient(90deg,#FFFFFF_0%,#F5F5FE_100%)] shadow-[0_8px_16px_rgba(10,18,51,0.14)]"

function LogoTile({ name, src }: { name: string; src: string }) {
  return (
    <li className="flex h-[92px] w-[78px] items-center justify-center rounded-lg bg-white p-2 shadow-[0_2px_8px_rgba(10,18,51,0.06)] sm:h-[122px] sm:w-[102px] sm:p-3">
      <Image src={src} alt={name} title={name} width={160} height={160} className="max-h-full w-auto object-contain" />
    </li>
  )
}

function CategoryLabel({ group }: { group: PartnerGroup }) {
  return (
    <p className="flex items-center gap-3 text-[18px] font-semibold text-ashira-royal lg:w-[180px] lg:shrink-0">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-[0_2px_6px_rgba(10,18,51,0.15)]">
        <Image src={group.icon} alt="" width={20} height={20} className="h-5 w-5" />
      </span>
      {group.label}
    </p>
  )
}

function Group({ group }: { group: PartnerGroup }) {
  return (
    <div className={`${card} flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:gap-6 lg:px-8 lg:py-4`}>
      <CategoryLabel group={group} />
      <ul className="flex flex-wrap justify-center gap-3 lg:justify-start lg:gap-5" aria-label={`Mitra ${group.label}`}>
        {group.logos.map((l, i) => (
          <LogoTile key={`${l.src}-${i}`} {...l} />
        ))}
      </ul>
    </div>
  )
}

/** "Mitra Kolaborasi — Dipercaya oleh Berbagai Institusi" (Figma REVISI TESTIMONI, LOGO). */
export function PartnersSection() {
  return (
    <section className="px-3 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="mx-auto flex max-w-[1376px] flex-col items-center text-center">
        <SectionBadge>Mitra Kolaborasi</SectionBadge>
        <h2 className="mt-5 text-[32px] font-bold tracking-[-0.02em] text-ashira-navy sm:text-[44px]">
          Dipercaya oleh Berbagai Institusi
        </h2>
        <p className="mt-3 max-w-[640px] text-base leading-[1.6] text-ashira-muted sm:text-lg">
          Kami telah bekerja sama dengan berbagai universitas, korporasi, instansi pemerintah, organisasi, dan berbagai
          event dalam menghadirkan solusi yang relevan dan berdampak.
        </p>

        <div className="mt-10 w-full space-y-5 text-left lg:max-w-[1252px]">
          {partnerGroups.map((g) => (
            <Group key={g.id} group={g} />
          ))}
        </div>
      </div>
    </section>
  )
}
