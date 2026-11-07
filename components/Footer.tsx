"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/config/site";
import { DropList } from "./DropList";
import { StackLockup } from "./Lockups";
import { Seal } from "./Seal";

type FooterLink = { href: string; label: string; external?: boolean };

const SHOP: FooterLink[] = [
  { href: "/women", label: "Women" },
  { href: "/men", label: "Men" },
  { href: "/archive", label: "Archive" },
];
const INSTAGRAM: FooterLink = { href: site.instagramUrl, label: "Instagram", external: true };
const WHATSAPP: FooterLink = {
  href: `https://wa.me/${site.whatsappNumber}`,
  label: "WhatsApp",
  external: true,
};
const ORDERS: FooterLink = { href: "/info", label: "Orders & Returns" };
const CONTACT: FooterLink = { href: "/info#contact", label: "Contact" };

function FooterLink({ link, className = "" }: { link: FooterLink; className?: string }) {
  const cls = `type-label link ${className}`;
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {link.label}
    </a>
  ) : (
    <Link href={link.href} className={cls}>
      {link.label}
    </Link>
  );
}

/*
 * The same groups at every width. Each link gets 11px of padding above and below, so
 * it is about 36px tall. The list's top margin leaves 12px between the heading and the
 * first link, and its negative bottom margin takes the last link's padding back out, so
 * the groups still sit 32px apart. Below 640px "Follow" runs as a row across both columns.
 */
function FooterGroup({ title, links, row = false }: { title: string; links: FooterLink[]; row?: boolean }) {
  return (
    <div className={row ? "max-sm:col-span-2" : ""}>
      <h2 className="type-label text-muted">{title}</h2>
      <ul className={`mt-px -mb-[11px] flex ${row ? "flex-wrap gap-x-8 sm:flex-col" : "flex-col"}`}>
        {links.map((l) => (
          <li key={l.label}>
            <FooterLink link={l} className="py-[11px]" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  /* The home page has its own seal. */
  const showSeal = usePathname() !== "/";

  return (
    <footer className="mt-24 border-t border-ink md:mt-40">
      {/* From 640px: a 12-column grid, the link columns on the left half and the drop list on the right. */}
      <div className="grid gap-y-8 px-(--gutter) pt-6 sm:grid-cols-12 sm:gap-x-8">
        {/* Between 640px and 1023px "Help" sizes to "Orders & Returns" so that link stays on one line. */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:col-span-7 sm:grid-cols-[1fr_auto_1fr] sm:gap-x-6 md:col-span-6 lg:grid-cols-3"
        >
          <FooterGroup title="Shop" links={SHOP} />
          <FooterGroup title="Help" links={[ORDERS, CONTACT]} />
          <FooterGroup title="Follow" links={[INSTAGRAM, WHATSAPP]} row />
        </nav>

        <DropList className="sm:col-span-5 md:col-span-6" />
      </div>

      <div className="mt-8 mb-3 flex flex-wrap items-center justify-between gap-4 px-(--gutter) max-sm:mb-8">
        <StackLockup
          as="p"
          first="Previously"
          second="owned."
          caption="Est. 2026"
          align="left"
          size="type-h2 [--type-size:clamp(3rem,6.75vw,6rem)]"
        />
        {showSeal ? <Seal /> : null}
      </div>

      <div className="border-t border-line px-(--gutter) py-2 max-sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <p className="type-label">© 2026 ALDERWORN. All pieces pre-owned.</p>
      </div>
    </footer>
  );
}
