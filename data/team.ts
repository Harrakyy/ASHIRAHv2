/**
 * Data struktur organisasi — mengikuti Figma "Redesign v2 › Prototype / 3 · Team".
 * `photo` = foto orang; `logo` = logo lembaga (ditampilkan contain di kartu);
 * tanpa keduanya tampil inisial, atau ikon grup bila `group` true.
 */

export interface TeamMember {
  name: string
  role: string
  photo?: string
  logo?: string
  /** Kartu kolektif (mis. tim produksi mitra) → ikon grup, bukan foto. */
  group?: boolean
}

export const boards: TeamMember[] = [
  { name: "Dewan Pengawas", role: "Independent Supervisor", photo: "/images/team/dewan-pengawas.webp" },
  { name: "Dewan Komisaris", role: "Shareholders", photo: "/images/team/dewan-komisaris.webp" },
]

export const incubator: TeamMember = {
  name: "UI INCUBATE",
  role: "Inkubator Bisnis",
  logo: "/images/team/ui-incubate.webp",
}

export const ceo: TeamMember = {
  name: "Hawari Muttaqin Mafaza",
  role: "Chief Executive Officer",
  photo: "/images/FOTO HAWARI.png",
}

export const ceoOffice: TeamMember = {
  name: "Aisya Rahma",
  role: "Assistant to CEO",
  photo: "/images/team/aisya-rahma.webp",
}

export const heads: TeamMember[] = [
  { name: "Safitri Az Zahra", role: "Head of Finance", photo: "/images/FOTO SAFI.png" },
  { name: "Muhammad Rahadian Dzaki", role: "Chief Technology Officer", photo: "/images/FOTO DZAKI.png" },
  { name: "Adithia Maulana", role: "Chief Strategic Officer", photo: "/images/FOTO ADIT.png" },
  { name: "Resky Amalia Putri", role: "Head of Marcomm", photo: "/images/FOTO AMEL.png" },
]

export const staff: TeamMember[] = [
  { name: "Bilqiis Putri Syatin", role: "General & Legal Support", photo: "/images/team/bilqiis-putri-syatin.webp" },
  { name: "Keisha Ramadhani", role: "Divisi Tech", photo: "/images/team/keisha-ramadhani.webp" },
  { name: "Savero Indrawan", role: "Company Designer", photo: "/images/team/savero-indrawan.webp" },
  { name: "Amira Hasna", role: "Content Specialist", photo: "/images/team/amira-hasna.webp" },
  { name: "Margaretha Eka", role: "Divisi Tech", photo: "/images/team/margaretha-eka.webp" },
  { name: "Rahmah Aisyah", role: "Divisi Tech", photo: "/images/team/rahmah-aisyah.webp" },
  {
    name: "Muhammad Dewanditto L.",
    role: "PIC Marketing of ASHIRA Apparel",
    photo: "/images/team/muhammad-dewanditto.webp",
  },
  {
    name: "Fairuzy Andine Hafiz",
    role: "PIC Operational of ASHIRA Apparel",
    photo: "/images/team/fairuzy-andine-hafiz.webp",
  },
]

export const partners: TeamMember[] = [{ name: "CV SBS & Partners", role: "Strategic Partnership", group: true }]
