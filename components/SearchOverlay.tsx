"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { pieces, sortNewest } from "@/lib/catalog";
import { ProductGrid } from "./ProductCard";
import { Sheet, SheetBar } from "./Sheet";

const HINTS = ["Knitwear", "Camel", "1980s", "AW-W-0142"];

const haystack = (p: (typeof products)[number]) =>
  `${p.title} ${p.code} ${p.category} ${p.era}`.toLowerCase();

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return sortNewest(products.filter((p) => words.every((w) => haystack(p).includes(w))));
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <Sheet open={open} onClose={onClose} label="Search" variant="full">
      <SheetBar title="Search" onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="px-(--gutter) pt-8 pb-4">
          <label htmlFor="site-search" className="sr-only">
            Search by title, code, category or era
          </label>
          <input
            id="site-search"
            type="search"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="type-h1 w-full border-b border-ink pb-2 font-extralight! placeholder:text-muted focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-baseline justify-between gap-3 px-(--gutter) pb-4">
          {hasQuery ? (
            <p role="status" className="type-data">
              {pieces(results.length)}
            </p>
          ) : (
            <p className="type-label flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-muted">Try</span>
              {HINTS.map((h) => (
                <button key={h} type="button" className="link-on uppercase" onClick={() => setQuery(h)}>
                  {h}
                </button>
              ))}
            </p>
          )}
        </div>

        {results.length > 0 ? <ProductGrid products={results} /> : null}
        {hasQuery && results.length === 0 ? (
          <p className="type-title px-(--gutter) pt-8">Nothing by that name.</p>
        ) : null}
      </div>
    </Sheet>
  );
}
