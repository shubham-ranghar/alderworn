"use client";

import Link from "next/link";
import { pieces } from "@/lib/catalog";
import { ProductGrid } from "./ProductCard";
import { useSaved } from "./useSaved";

export function SavedPieces() {
  const { products, count, ready } = useSaved();

  return (
    <>
      <h1 className="type-h1 px-(--gutter) py-12 text-center text-balance md:py-22">
        Saved
      </h1>

      {!ready ? null : count > 0 ? (
        <>
          <p role="status" className="type-data px-(--gutter) py-3">
            {pieces(count)}
          </p>
          <ProductGrid products={products} />
        </>
      ) : (
        <div className="px-(--gutter) py-10 text-center">
          <p className="type-title">Nothing saved yet.</p>
          <p className="type-label mt-6 flex justify-center gap-5">
            <Link href="/women" className="link-on">
              Women
            </Link>
            <Link href="/men" className="link-on">
              Men
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
