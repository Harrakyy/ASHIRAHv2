/** Footer — Figma Redesign v2: satu baris brand di atas gradien. */
export function Footer() {
  return (
    <footer className="rounded-t-[32px] bg-[linear-gradient(180deg,#2B2996_0%,#04030D_100%)] text-white lg:rounded-t-[44px]">
      <div className="mx-auto flex min-h-[220px] max-w-[1440px] items-center justify-center px-6 py-16 text-center lg:min-h-[252px]">
        <p className="text-base">
          ASHIRA Group ·{" "}
          <a href="https://ashiragroup.id" className="underline-offset-4 hover:underline">
            ashiragroup.id
          </a>
        </p>
      </div>
    </footer>
  )
}
