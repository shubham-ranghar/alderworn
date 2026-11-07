"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { formatPrice, isPlaceholder, productHref, statusOf } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";
import { SaveButton } from "./SaveButton";

const GRID_SIZES = "(min-width: 768px) 25vw, 50vw";

/**
 * The first photo, and on devices with a mouse or trackpad the second photo fading in on
 * hover and keyboard focus (.card-photo-alt in globals.css). Photos never swipe inside a card.
 * The second photo is lazy and hidden with display: none elsewhere, so only those devices
 * load it, as the card nears the screen. Placeholder cards show the placeholder only.
 *
 * `look`:
 * - "tile" (default): the photo inset on a cream tile, name and price centred.
 * - "cover": the photo fills a 4:5 frame edge to edge, the plain cream placeholder, and
 *   the name and price left-aligned under it (listing pages and the home carousel).
 */
export function ProductCard({
  product,
  sizes = GRID_SIZES,
  look = "tile",
}: {
  product: Product;
  sizes?: string;
  look?: "tile" | "cover";
}) {
  const cover = look === "cover";
  const { code, title, images, price } = product;
  const status = statusOf(product);
  const sold = status === "sold";
  const [first, second] = images;
  const swap = !isPlaceholder(first) && second !== undefined && !isPlaceholder(second);

  // Both photos share one frame, fit and position, so nothing moves when they swap.
  const photo = (src: string, index: number) => (
    <div className={`absolute ${cover ? "inset-0" : "inset-[10%]"}`}>
      <ProductImage
        src={src}
        code={code}
        index={index}
        alt={index === 0 ? title : ""}
        sizes={sizes}
        dim={sold}
        contain={!cover}
        flat={cover}
      />
    </div>
  );

  return (
    <div className="card relative">
      <Link href={productHref(product)} className="card-link block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          {/* Opaque layers, so the photo's multiply still has the tile to blend with as it scales. */}
          <div className="card-photo absolute inset-0 bg-cream">
            {photo(first, 0)}
            {swap ? (
              <div aria-hidden="true" className="card-photo-alt absolute inset-0 bg-cream">
                {photo(second, 1)}
              </div>
            ) : null}
          </div>
        </div>

        <div className={`relative pt-3 ${cover ? "text-left" : "px-2 text-center"}`}>
          <div className="card-info" data-swap={status === "available" ? "" : undefined}>
            <h3 className="type-label">
              {title}
            </h3>
            <p className={`type-data mt-1 flex flex-wrap gap-x-3 ${cover ? "justify-start" : "justify-center"}`}>
              <span className={sold ? "line-through" : ""}>
                <span className="sr-only">{sold ? "Was " : "Price "}</span>
                {formatPrice(price)}
              </span>
              {sold ? <span className="font-bold">SOLD</span> : null}
              {status === "on-hold" ? <span className="font-bold">ON HOLD</span> : null}
            </p>
          </div>
          {status === "available" ? (
            <p
              className={`card-sizes type-data absolute top-3 flex flex-wrap gap-x-3 ${cover ? "inset-x-0 justify-start" : "inset-x-2 justify-center"}`}
            >
              <span className="sr-only">Sizes: </span>
              {product.sizes.map((s) => (
                <span key={s.label} className={s.available ? "" : "text-muted line-through"}>
                  {s.label}
                  {s.available ? null : <span className="sr-only"> unavailable</span>}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </Link>

      <SaveButton code={code} title={title} className="absolute top-0 right-0" />
    </div>
  );
}

/** 4 columns desktop, 2 mobile. `cover` uses the edge-to-edge card (see ProductCard). */
export function ProductGrid({ products, cover = false }: { products: Product[]; cover?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 px-(--gutter) pt-4 md:grid-cols-4 md:gap-y-[72px]">
      {products.map((p) => (
        <li key={p.code}>
          <ProductCard product={p} look={cover ? "cover" : "tile"} />
        </li>
      ))}
    </ul>
  );
}

/**
 * A single row that runs off the right edge. The next piece always peeks in.
 * Plain: bordered tiles with the native scrollbar (product pages).
 * `carousel` (home): edge-to-edge cards that snap to the gutter, 72vw below 640px, 40vw
 * to 1023px and 23vw from 1024px (four and a peek), 12px apart on phones and 16px above.
 * A progress bar inside the gutters replaces the scrollbar, with an optional "View all"
 * link under it.
 */
export function ProductRow({
  products,
  label,
  carousel = false,
  viewAllHref,
}: {
  products: Product[];
  label: string;
  carousel?: boolean;
  viewAllHref?: string;
}) {
  const row = useRef<HTMLUListElement>(null);
  const [bar, setBar] = useState({ left: 0, width: 100 });

  const measure = useCallback(() => {
    const el = row.current;
    if (!el || !el.scrollWidth) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setBar({ left: (scrollLeft / scrollWidth) * 100, width: (clientWidth / scrollWidth) * 100 });
  }, []);

  useEffect(() => {
    if (!carousel || !row.current) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row.current);
    return () => observer.disconnect();
  }, [carousel, measure]);

  if (!carousel) {
    return (
      <ul
        tabIndex={0}
        aria-label={label}
        className="scroll-row relative flex snap-x overflow-x-auto border-y border-line"
      >
        {products.map((p) => (
          <li key={p.code} className="w-[62vw] shrink-0 snap-start border-r border-line pb-5 md:w-[23vw]">
            <ProductCard product={p} sizes="(min-width: 768px) 23vw, 62vw" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <ul
        ref={row}
        tabIndex={0}
        aria-label={label}
        onScroll={measure}
        className="scroll-none relative flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) sm:gap-4"
      >
        {products.map((p) => (
          <li key={p.code} className="w-[72vw] shrink-0 snap-start sm:w-[40vw] lg:w-[23vw]">
            <ProductCard
              product={p}
              look="cover"
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 40vw, 72vw"
            />
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="relative mx-(--gutter) mt-5 h-[2px] bg-line">
        <div
          className="absolute inset-y-0 bg-ink"
          style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
        />
      </div>
      {viewAllHref ? (
        <div className="mt-1 flex justify-end px-(--gutter)">
          <Link href={viewAllHref} className="type-label link py-[15px]">
            View all →
          </Link>
        </div>
      ) : null}
    </>
  );
}
