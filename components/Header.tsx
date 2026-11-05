"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBag } from "./BagProvider";
import { CategoryBar, listingAt } from "./CategoryBar";
import { HeaderSearch } from "./HeaderSearch";
import { BagIcon, HeartIcon } from "./Icons";
import { Sheet, SheetBar } from "./Sheet";
import { useSaved } from "./useSaved";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/women", label: "Women" },
  { href: "/men", label: "Men" },
  { href: "/archive", label: "Archive" },
];

const ORDERS = { href: "/info", label: "Orders & Returns" };

const MENU = [...NAV, ORDERS];

/** Only the first row is sticky, so it must stay a direct child of the page, not of a wrapper. */
export function Header() {
  const pathname = usePathname();
  const { count, openDrawer } = useBag();
  const { count: savedCount } = useSaved();
  const [menuOpen, setMenuOpen] = useState(false);
  const listing = listingAt(pathname);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const current = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`) ? "true" : undefined;

  return (
    <>
      <header className="sticky top-0 z-40 grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-ink bg-paper px-(--gutter)">
        <div className="flex items-center">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
            className="type-nav link py-2 lg:hidden"
          >
            Menu
          </button>
          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={current(n.href)} className="type-nav link py-2">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <Wordmark className="text-[1.0625rem] md:text-[1.5rem]" />

        <div className="flex items-center justify-end gap-7">
          <Link
            href={ORDERS.href}
            aria-current={current(ORDERS.href)}
            className="type-nav link hidden py-2 whitespace-nowrap lg:block"
          >
            {ORDERS.label}
          </Link>
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/saved"
              aria-label={`Saved, ${savedCount} ${savedCount === 1 ? "piece" : "pieces"}`}
              aria-current={current("/saved")}
              className="type-nav link flex! items-center gap-1.5 py-2"
            >
              <HeartIcon />
              {savedCount}
            </Link>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
              onClick={openDrawer}
              className="type-nav link flex! items-center gap-1.5 py-2"
            >
              <BagIcon />
              {count}
            </button>
          </div>
        </div>
      </header>

      <HeaderSearch>{listing ? <CategoryBar {...listing} /> : null}</HeaderSearch>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu" variant="full">
        <SheetBar closeSide="left" title={`Bag (${count})`} onClose={() => setMenuOpen(false)} />
        <nav aria-label="Menu" className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-(--gutter)">
          {MENU.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              aria-current={current(n.href)}
              className="link font-kalnia text-[14.5vw] leading-[1.02] font-semibold tracking-[-0.03em] [--link-thickness:2px]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center justify-end border-t border-ink px-(--gutter) py-3">
          <p className="type-label py-2">Previously owned.</p>
        </div>
      </Sheet>
    </>
  );
}
