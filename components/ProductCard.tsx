"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatPrice, productHref, statusOf } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";
import { SaveButton } from "./SaveButton";

const GRID_SIZES = "(min-width: 768px) 25vw, 50vw";

/**
 * Hover devices show the first photo only; touch devices swipe through them all (see
 * .card-photos in globals.css). The others load once a finger reaches for the card.
 */
export function ProductCard({ product, sizes = GRID_SIZES }: { product: Product; sizes?: string }) {
  const { code, title, images, price } = product;
  const status = statusOf(product);
  const sold = status === "sold";
  const many = images.length > 1;

  const [index, setIndex] = useState(0);
  const [armed, setArmed] = useState(false);

  return (
    <div
      className="card relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") setArmed(true);
      }}
    >
      <Link href={productHref(product)} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <div
            className="card-photos absolute inset-0"
            onScroll={(e) => {
              const { scrollLeft, clientWidth } = e.currentTarget;
              if (!clientWidth) return;
              setArmed(true);
              setIndex(Math.round(scrollLeft / clientWidth));
            }}
          >
            {images.map((src, i) => (
              // Opaque, so the photo's multiply still has the tile to blend with as it scales.
              <div key={src} className="card-photo bg-cream">
                <div className="absolute inset-[10%]">
                  {i === 0 || armed ? (
                    <ProductImage
                      src={src}
                      code={code}
                      index={i}
                      alt={i === 0 ? title : ""}
                      sizes={sizes}
                      dim={sold}
                      contain
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative px-2 pt-3 text-center">
          <div className="card-info" data-swap={status === "available" ? "" : undefined}>
            <h3 className="text-[13px] leading-[1.3] font-[600] tracking-[0.02em] uppercase [font-stretch:85%]">
              {title}
            </h3>
            <p className="type-data mt-1 flex flex-wrap justify-center gap-x-3">
              <span className={sold ? "line-through" : ""}>
                <span className="sr-only">{sold ? "Was " : "Price "}</span>
                {formatPrice(price)}
              </span>
              {sold ? <span>SOLD</span> : null}
              {status === "on-hold" ? <span>ON HOLD</span> : null}
            </p>
          </div>
          {status === "available" ? (
            <p className="card-sizes type-data absolute inset-x-2 top-3 flex flex-wrap justify-center gap-x-3">
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

      {many ? (
        <div className="card-dots pointer-events-none absolute inset-x-0 top-0 aspect-[4/5]">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                className={`size-[5px] rounded-full bg-ink transition-opacity duration-300 ${i === index ? "" : "opacity-25"}`}
              />
            ))}
          </div>
        </div>
      ) : null}

      <SaveButton code={code} title={title} className="absolute top-0 right-0" />
    </div>
  );
}

/** 4 columns desktop, 2 mobile. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 px-(--gutter) pt-4 md:grid-cols-4 md:gap-y-[72px]">
      {products.map((p) => (
        <li key={p.code}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}

/** A single row that runs off the right edge. The next piece always peeks in. */
export function ProductRow({ products, label }: { products: Product[]; label: string }) {
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
