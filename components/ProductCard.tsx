import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice, productHref } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";

const GRID_SIZES = "(min-width: 768px) 25vw, 50vw";

export function ProductCard({ product, sizes = GRID_SIZES }: { product: Product; sizes?: string }) {
  const { code, title, images, status, price } = product;
  const sold = status === "sold";
  const second = images[1];

  return (
    <Link href={productHref(product)} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden">
        <ProductImage src={images[0]} code={code} index={0} alt={title} sizes={sizes} dim={sold} />
        {second ? (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
            <ProductImage src={second} code={code} index={1} alt="" sizes={sizes} dim={sold} />
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 px-2 pt-2 pb-5">
        <h3 className="type-label underline-offset-3 group-hover:underline">{title}</h3>
        <p className="type-data flex flex-wrap gap-x-3">
          <span className={sold ? "line-through" : ""}>
            <span className="sr-only">{sold ? "Was " : "Price "}</span>
            {formatPrice(price)}
          </span>
          {sold ? <span>SOLD</span> : null}
          {status === "on-hold" ? <span>ON HOLD</span> : null}
        </p>
      </div>
    </Link>
  );
}

/** 4 columns desktop, 2 mobile, 1px hairlines between cells. */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 border-t border-line md:grid-cols-4">
      {products.map((p) => (
        <li key={p.code} className="border-r border-b border-line">
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
        <li key={p.code} className="w-[62vw] shrink-0 snap-start border-r border-line md:w-[23vw]">
          <ProductCard product={p} sizes="(min-width: 768px) 23vw, 62vw" />
        </li>
      ))}
    </ul>
  );
}
