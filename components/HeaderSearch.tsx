"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { products } from "@/data/products";
import { pieces, sortNewest } from "@/lib/catalog";
import { SearchIcon } from "./Icons";
import { ProductGrid } from "./ProductCard";

const haystack = (p: (typeof products)[number]) =>
  `${p.title} ${p.code} ${p.category} ${p.era}`.toLowerCase();

/**
 * The header's search row. Live results open in a panel under the whole header, which is why
 * the rows below the field are passed in as children. Below 1024px the row shows the section
 * links (`links`) and SEARCH, which expands the field across the row with CLOSE; CLOSE or Esc
 * brings the links back.
 */
export function HeaderSearch({
  children,
  links,
  inputId = "site-search",
  inMenu = false,
}: {
  children?: ReactNode;
  /** Section links shown in the row below 1024px, with SEARCH opening the field. */
  links?: ReactNode;
  inputId?: string;
  /** The copy inside the mobile menu: no seal to clear, and results fill the menu below the field. */
  inMenu?: boolean;
}) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return sortNewest(products.filter((p) => words.every((w) => haystack(p).includes(w))));
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const visible = open && hasQuery;

  useEffect(() => {
    setQuery("");
    setOpen(false);
    setExpanded(false);
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!form.current?.contains(target) && !panel.current?.contains(target)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Stops the browser clearing the field as well, so the same search can be reopened.
      e.preventDefault();
      setOpen(false);
      form.current?.querySelector("input")?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [visible]);

  // Below 1024px the row holds the section links and a SEARCH button; the field takes over the
  // row only while `expanded`. From 1024px (and in the menu) the field is always shown.
  const small = !inMenu && links !== undefined;
  const showField = !small || expanded;

  const expand = () => {
    // Synchronous, so the field is on screen and focusable within the tap: iOS only opens the
    // keyboard for a focus made during the tap itself.
    flushSync(() => setExpanded(true));
    input.current?.focus();
  };

  const collapse = () => {
    setExpanded(false);
    setOpen(false);
    toggle.current?.focus();
  };

  return (
    <div className="relative">
      <div
        onKeyDown={(e) => {
          if (e.key !== "Escape" || !expanded) return;
          // Handled here, so the results' own Esc handler doesn't put focus back in the field.
          e.preventDefault();
          e.stopPropagation();
          collapse();
        }}
        // The fixed home seal hangs over the end of this row, so the row stops short of it: 64px
        // seal + 16px gutter + 8px below 640px, where every pixel counts for the links.
        className={`flex h-(--search-h) items-center gap-3 border-b border-ink bg-paper px-(--gutter) has-[input:focus]:[box-shadow:inset_0_-1px_0_var(--ink)] ${pathname === "/" && !inMenu ? "pr-25 max-sm:pr-22 md:pr-35" : ""}`}
      >
        {small && !expanded ? (
          <nav aria-label="Sections" className="flex min-w-0 flex-1 items-center gap-5 lg:hidden">
            {links}
          </nav>
        ) : null}
        <form
          ref={form}
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className={`min-w-0 flex-1 items-center gap-2.5 self-stretch ${showField ? "flex" : "hidden lg:flex"}`}
        >
          <SearchIcon />
          <label htmlFor={inputId} className="sr-only">
            Search by title, code, category or era
          </label>
          {/* 16px typed text: iOS zooms the page when focusing anything smaller. */}
          <input
            ref={input}
            id={inputId}
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            className={`type-field min-w-0 flex-1 self-stretch bg-transparent placeholder:type-label placeholder:text-muted focus:outline-none`}
          />
        </form>
        {small ? (
          <button
            ref={toggle}
            type="button"
            aria-expanded={expanded}
            aria-controls={inputId}
            onClick={expanded ? collapse : expand}
            className="type-label link shrink-0 py-3.75 lg:hidden"
          >
            {expanded ? "Close" : "Search"}
          </button>
        ) : null}
      </div>

      {children}

      {visible ? (
        <div
          ref={panel}
          onClick={(e) => {
            if ((e.target as Element).closest("a")) setOpen(false);
          }}
          className={`absolute inset-x-0 top-full z-35 overflow-y-auto overscroll-contain border-b border-ink bg-paper pb-8 ${
            inMenu
              ? "max-h-[calc(100dvh-var(--header-h)-var(--search-h))]"
              : "max-h-[calc(100svh-var(--header-h)-var(--search-h)-var(--category-h))]"
          }`}
        >
          <p role="status" className="type-data px-(--gutter) py-4">
            {pieces(results.length)}
          </p>
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <p className="type-title px-(--gutter) pt-4">Nothing by that name.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
