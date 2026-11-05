import Link from "next/link";
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
  [
    { href: "/about", label: "The House" },
    { href: "/info", label: "Orders & Returns" },
  ],
  [
    { href: site.instagramUrl, label: "Instagram", external: true },
    { href: `https://wa.me/${site.whatsappNumber}`, label: "WhatsApp", external: true },
    { href: "/info#contact", label: "Contact" },
  ],
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink md:mt-40">
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 px-(--gutter) pt-5 pb-12 md:grid-cols-12 md:pb-20">
        <nav aria-label="Footer" className="col-span-2 grid grid-cols-3 gap-4 md:col-span-5">
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

        <DropList className="col-span-2 md:col-span-4 md:col-start-9" />

        <Seal className="h-28 w-28 md:col-span-2 md:mt-16 md:h-36 md:w-36" />

        <StackLockup
          as="p"
          roman="Previously"
          italic="owned."
          caption="Est. 2026"
          className="self-end md:col-span-4 md:col-start-6"
        />
      </div>

      <div className="border-t border-line px-(--gutter) py-3">
        <p className="type-label">© 2026 ALDERWORN. All pieces pre-owned.</p>
      </div>
    </footer>
  );
}
