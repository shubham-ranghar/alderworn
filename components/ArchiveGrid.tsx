"use client";

import { useState } from "react";
import type { Product, Section } from "@/data/products";
import { pieces } from "@/lib/catalog";
import { ProductGrid } from "./ProductCard";

const OPTIONS: { value: Section | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
];

export function ArchiveGrid({ products }: { products: Product[] }) {
  const [section, setSection] = useState<Section | "all">("all");
  const shown = section === "all" ? products : products.filter((p) => p.section === section);

  return (
    <>
      <div className="flex items-baseline justify-between border-b border-ink px-(--gutter) py-3">
        <div role="group" aria-label="Show sold pieces from" className="flex gap-4">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={section === o.value}
              onClick={() => setSection(o.value)}
              className="type-label link btn-text py-1"
            >
              {o.label}
            </button>
          ))}
        </div>
        <p role="status" className="type-data">
          {pieces(shown.length)}
        </p>
      </div>
      <h2 className="sr-only">Sold pieces</h2>
      {shown.length > 0 ? (
        <div className="-mt-px">
          <ProductGrid products={shown} />
        </div>
      ) : (
        <p className="type-title px-(--gutter) py-20">Nothing here yet. It won&apos;t last.</p>
      )}
    </>
  );
}
