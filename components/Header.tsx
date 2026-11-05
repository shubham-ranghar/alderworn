"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBag } from "./BagProvider";
import { SearchOverlay } from "./SearchOverlay";
import { Sheet, SheetBar } from "./Sheet";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/women", label: "Women" },
  { href: "/men", label: "Men" },
  { href: "/archive", label: "Archive" },
];

const MENU = [
  ...NAV,
  { href: "/about", label: "The House" },
  { href: "/info", label: "Orders & Returns" },
];

export function Header() {
  const pathname = usePathname();
  const { count, openDrawer } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const current = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`) ? "true" : undefined;

  const bagButton = (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={openDrawer}
      className="type-label link py-2 whitespace-nowrap"
    >
      Bag ({count})
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-40 grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-ink bg-paper px-(--gutter)">
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(true)}
            className="type-label link py-2 md:hidden"
          >
            Menu
          </button>
          <nav aria-label="Main" className="hidden items-center gap-5 md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={current(n.href)} className="type-label link py-2">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <Wordmark className="text-[1.0625rem] md:text-[1.5rem]" />

        <div className="flex items-center justify-end gap-5">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setSearchOpen(true)}
            className="type-label link hidden py-2 md:block"
          >
            Search
          </button>
          {bagButton}
        </div>
      </header>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu" variant="full">
        <SheetBar closeSide="left" title={`Bag (${count})`} onClose={() => setMenuOpen(false)} />
        <nav aria-label="Menu" className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-(--gutter)">
          {MENU.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              aria-current={current(n.href)}
              className="link font-kalnia text-[14.5vw] leading-[1.02] font-semibold tracking-[-0.03em] decoration-2"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center justify-between border-t border-ink px-(--gutter) py-3">
          <button
            type="button"
            className="type-label link py-2"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            Search
          </button>
          <p className="type-label">Previously owned.</p>
        </div>
      </Sheet>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
