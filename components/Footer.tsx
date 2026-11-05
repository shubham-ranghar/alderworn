"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { DropList } from "./DropList";
import { StackLockup } from "./Lockups";
import { Seal } from "./Seal";

const COLUMNS: { href: string; label: string; external?: boolean }[][] = [
  [
    { href: "/women", label: "Women" },
    { href: "/men", label: "Men" },
    { href: "/archive", label: "Archive" },
  ],
  [{ href: "/info", label: "Orders & Returns" }],
  [
    { href: site.instagramUrl, label: "Instagram", external: true },
    { href: `https://wa.me/${site.whatsappNumber}`, label: "WhatsApp", external: true },
    { href: "/info#contact", label: "Contact" },
  ],
];

function scrollToTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
}

export function Footer() {
  /* The home page has its own fixed seal. */
  const showSeal = usePathname() !== "/";

  return (
    <footer className="mt-24 border-t border-ink md:mt-40">
      <div className="grid gap-y-6 px-(--gutter) pt-4 md:grid-cols-12">
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-4 gap-y-4 md:col-span-6 md:grid-cols-3">
          {COLUMNS.map((links, i) => (
            <ul key={i} className="flex flex-col gap-2">
              {links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="type-label link">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="type-label link">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </nav>

        <DropList className="md:col-span-4 md:col-start-9" />
      </div>

      <div className="mt-3 mb-3 flex flex-wrap items-center justify-between gap-4 px-(--gutter)">
        <StackLockup
          as="p"
          roman="Previously"
          italic="owned."
          caption="Est. 2026"
          align="left"
          size="type-h2 text-[clamp(3rem,6.75vw,6rem)]!"
        />
        {showSeal ? <Seal /> : null}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-line px-(--gutter) py-2">
        <p className="type-label">© 2026 ALDERWORN. All pieces pre-owned.</p>
        <button type="button" onClick={scrollToTop} className="type-label link ml-auto">
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
