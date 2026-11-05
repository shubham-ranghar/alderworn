"use client";

import { useRef, useState } from "react";
import type { Product } from "@/data/products";
import { ProductImage } from "./ProductImage";

/** Stacked at full width on desktop. Swipeable with a counter on mobile. */
export function ProductGallery({ product }: { product: Product }) {
  const { images, code, title, status } = product;
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-w-0">
      <div
        ref={ref}
        tabIndex={0}
        role="group"
        aria-label={`Photos of ${title}`}
        onScroll={() => {
          const el = ref.current;
          if (el && el.clientWidth) setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="scroll-none flex snap-x snap-mandatory overflow-x-auto md:block md:overflow-visible"
      >
        {images.map((src, i) => (
          <div key={src} className="relative aspect-[3/4] w-full shrink-0 snap-start">
            <ProductImage
              src={src}
              code={code}
              index={i}
              alt={`${title}, view ${i + 1} of ${images.length}`}
              sizes="(min-width: 768px) 60vw, 100vw"
              priority={i === 0}
              dim={status === "sold"}
            />
          </div>
        ))}
      </div>
      <p aria-hidden="true" className="type-data absolute right-2 bottom-2 md:hidden">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
