"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/config/site";
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

const MENU_ID = "site-menu";

/** Position in the menu's fade-in sequence, 40ms apart. */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

/** Only the first row is sticky, so it must stay a direct child of the page, not of a wrapper. */
export function Header() {
  const pathname = usePathname();
  const { count, openDrawer } = useBag();
  const { count: savedCount } = useSaved();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const listing = listingAt(pathname);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Runs after the dialog has closed (child effects run first), so MENU is no longer inert.
  useEffect(() => {
    if (wasOpen.current && !menuOpen) menuButton.current?.focus();
    wasOpen.current = menuOpen;
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const current = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`) ? "true" : undefined;

  return (
    <>
      <header className="sticky top-0 z-40 grid h-(--header-h) grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-ink bg-paper px-(--gutter)">
        <div className="flex items-center">
          <button
            ref={menuButton}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={() => setMenuOpen(true)}
            className="type-label link py-2 lg:hidden"
          >
            Menu
          </button>
          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={current(n.href)} className="type-label link py-2">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        <Wordmark />

        <div className="flex items-center justify-end gap-7">
          <Link
            href={ORDERS.href}
            aria-current={current(ORDERS.href)}
            className="type-label link hidden py-2 whitespace-nowrap lg:block"
          >
            {ORDERS.label}
          </Link>
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/saved"
              aria-label={`Saved, ${savedCount} ${savedCount === 1 ? "piece" : "pieces"}`}
              aria-current={current("/saved")}
              className="type-label link flex! items-center gap-1.5 py-2"
            >
              <HeartIcon />
              {savedCount}
            </Link>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
              onClick={openDrawer}
              className="type-label link flex! items-center gap-1.5 py-2"
            >
              <BagIcon />
              {count}
            </button>
          </div>
        </div>
      </header>

      {/* Below 1024px the search row carries the section links. 15px padding: 44px+ to tap. */}
      <HeaderSearch
        links={NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={current(n.href)}
            className="type-label link shrink-0 py-3.75 whitespace-nowrap"
          >
            {n.label}
          </Link>
        ))}
      >
        {listing ? <CategoryBar {...listing} /> : null}
      </HeaderSearch>

      <Sheet open={menuOpen} onClose={closeMenu} label="Menu" variant="full" id={MENU_ID} trapFocus>
        {/* Any link tapped inside closes the menu, including search results and the current page. */}
        <div
          className="contents"
          onClick={(e) => {
            if ((e.target as Element).closest("a")) closeMenu();
          }}
        >
          <SheetBar
            closeSide="left"
            onClose={closeMenu}
            title={
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
                onClick={() => {
                  closeMenu();
                  openDrawer();
                }}
                className="type-label link py-3.75"
              >
                Bag ({count})
              </button>
            }
          />
          <HeaderSearch inputId="menu-search" inMenu />
          {/* my-auto centres the links when they fit and lets them scroll from the top when they don't. */}
          <nav aria-label="Menu" className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-(--gutter)">
            <div className="my-auto flex flex-col py-3">
              {MENU.map((n, i) => {
                const here = current(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={here}
                    style={step(i)}
                    // h1 at a size of its own, so all four links fit any phone screen.
                    className="menu-in group type-h1 flex min-h-11 items-baseline [--link-thickness:2px] [--type-size:min(14.5vw,13svh)]"
                  >
                    {here ? <span aria-hidden="true">→&nbsp;</span> : null}
                    <span className="link-reveal">{n.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          <ul className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 border-t border-ink px-(--gutter)">
            <li className="menu-in" style={step(MENU.length)}>
              <Link
                href="/saved"
                aria-current={current("/saved")}
                className="type-label group flex min-h-11 items-center"
              >
                {current("/saved") ? <span aria-hidden="true">→&nbsp;</span> : null}
                <span className="link-reveal">Wishlist ({savedCount})</span>
              </Link>
            </li>
            <li className="menu-in" style={step(MENU.length + 1)}>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-label group flex min-h-11 items-center"
              >
                <span className="link-reveal">Instagram</span>
              </a>
            </li>
            <li className="menu-in" style={step(MENU.length + 2)}>
              <a
                href={`https://wa.me/${site.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="type-label group flex min-h-11 items-center"
              >
                <span className="link-reveal">WhatsApp</span>
              </a>
            </li>
          </ul>
          <div className="flex shrink-0 items-center justify-end border-t border-ink px-(--gutter) py-3">
            <p className="type-label py-2">Previously owned.</p>
          </div>
        </div>
      </Sheet>
    </>
  );
}
