"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { products } from "@/data/products";
import { pieces, sortNewest } from "@/lib/catalog";
import { SearchIcon } from "./Icons";
import { ProductGrid } from "./ProductCard";

const haystack = (p: (typeof products)[number]) =>
  `${p.title} ${p.code} ${p.category} ${p.era}`.toLowerCase();

/**
 * The header's search row. Live results open in a panel under the whole header, which is why
 * the rows below the field are passed in as children.
 */
export function HeaderSearch({ children }: { children?: ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const form = useRef<HTMLFormElement>(null);
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

  return (
    <div className="relative">
      <form
        ref={form}
        role="search"
        onSubmit={(e) => e.preventDefault()}
        // The fixed home seal hangs over the end of this row, so typing stops short of it.
        className={`flex h-(--search-h) items-center gap-2.5 border-b border-ink bg-paper px-(--gutter) focus-within:[box-shadow:inset_0_-1px_0_var(--ink)] ${pathname === "/" ? "pr-25 md:pr-35" : ""}`}
      >
        <SearchIcon />
        <label htmlFor="site-search" className="sr-only">
          Search by title, code, category or era
        </label>
        {/* 16px typed text: iOS zooms the page when focusing anything smaller. */}
        <input
          id="site-search"
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
          className="min-w-0 flex-1 bg-transparent text-[16px] placeholder:text-[13px] placeholder:tracking-[0.05em] placeholder:text-muted placeholder:uppercase focus:outline-none"
        />
      </form>

      {children}

      {visible ? (
        <div
          ref={panel}
          onClick={(e) => {
            if ((e.target as Element).closest("a")) setOpen(false);
          }}
          className="absolute inset-x-0 top-full z-35 max-h-[calc(100svh-var(--header-h)-var(--search-h)-var(--category-h))] overflow-y-auto overscroll-contain border-b border-ink bg-paper pb-8"
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
