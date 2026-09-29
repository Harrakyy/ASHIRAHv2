/**
 * Logo mitra kolaborasi — Figma "REVISI TESTIMONI, LOGO › Mitra Kolaborasi".
 * Logo diekspor dari Figma ke public/images/partners/. Nama yang belum pasti ditulis
 * generik ("Mitra …") — mohon lengkapi bila nama resminya sudah dikonfirmasi.
 */

export type PartnerCategory = "universitas" | "organization" | "events"

export interface PartnerGroup {
  id: PartnerCategory
  label: string
  /** Ikon kategori di public/images/icons/. */
  icon: string
  logos: { name: string; src: string }[]
}

const logo = (file: string, name: string) => ({ name, src: `/images/partners/${file}.webp` })

export const partnerGroups: PartnerGroup[] = [
  {
    id: "universitas",
    label: "Universitas",
    icon: "/images/icons/graduation.svg",
    logos: [
      logo("univ_1", "Universitas Indonesia"),
      logo("univ_2", "IPB University"),
      logo("univ_3", "Universitas Andalas"),
      logo("univ_4", "SMA IT Darel Iman Sumatera Barat"),
      logo("univ_5", "Provinsi Banten"),
      logo("univ_6", "Kementerian PUPR"),
      logo("univ_7", "UIN Syarif Hidayatullah Jakarta"),
      logo("univ_8", "UIN Sunan Gunung Djati Bandung"),
      logo("univ2_1", "Kabupaten Tangerang"),
      logo("univ2_2", "Mitra universitas"),
      logo("univ2_3", "ISLS 2026"),
      logo("univ2_4", "Telkom University"),
    ],
  },
  {
    id: "organization",
    label: "Organization",
    icon: "/images/icons/organization.svg",
    logos: [
      logo("org_1", "IKABA FIB UI"),
      logo("org_2", "Mitra organisasi"),
      logo("org_3", "Syababus Sunnah"),
      logo("org_4", "Mitra organisasi"),
      logo("org_5", "Beasiswa IMAMI 9301"),
      logo("org_6", "NAMA Foundation"),
      logo("org_7", "Mitra organisasi"),
      logo("org_8", "ASHIRA Community — Aksi Sosial & Humaniora"),
      logo("org2_1", "Mitra organisasi"),
      logo("org2_2", "DEIPICT"),
    ],
  },
  {
    id: "events",
    label: "Events",
    icon: "/images/icons/events.svg",
    logos: [
      logo("event_1", "Mitra event"),
      logo("event_2", "Mitra event"),
      logo("event_3", "PORSTAT 2025"),
      logo("event_4", "KKN Nagari Campago"),
    ],
  },
]
