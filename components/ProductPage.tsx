import Link from "next/link";
import { claimWindow, dispatchWindow, SHIPPING_FEE, site } from "@/config/site";
import type { Product } from "@/data/products";
import { conditionMeaning, dropName, formatPrice, isOneSize, moreFromDrop, statusOf } from "@/lib/catalog";
import { Accordion } from "./Accordion";
import { AddToBag } from "./AddToBag";
import { StackLockup } from "./Lockups";
import { ProductGallery } from "./ProductGallery";
import { ProductRow } from "./ProductCard";
import { SaveButton } from "./SaveButton";

export function ProductPage({ product }: { product: Product }) {
  const more = moreFromDrop(product);
  const sold = statusOf(product) === "sold";
  // Every piece is one of a kind, so it has one size: the first listed.
  const size = product.sizes[0] ?? null;

  return (
    <>
      <article className="md:grid md:grid-cols-[3fr_2fr] md:items-start">
        <ProductGallery product={product} />

        <div className="px-(--gutter) pt-8 pb-4 md:sticky md:top-(--header-h) md:max-h-[calc(100svh-var(--header-h))] md:overflow-y-auto md:border-l md:border-line md:px-8 md:pt-12 lg:px-12">
          {/* 24px between the groups: title, rows, button, accordions. The heart sits on the
              right of the first title line; the negative margins line its icon, not its 44px tap
              area, up with the line and the panel's edge. */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="type-title">
                <span className="block">{product.title}</span>
                <span className="block">circa {product.era}</span>
              </h1>
              <p className="type-data mt-2">{product.code}</p>
              <p className={`type-lead mt-1 text-ink ${sold ? "line-through" : ""}`}>
                <span className="sr-only">{sold ? "Was " : "Price "}</span>
                {formatPrice(product.price)}
              </p>
            </div>
            <SaveButton
              code={product.code}
              title={product.title}
              className="-mt-2 -mr-[13px] shrink-0"
            />
          </div>

          <dl className="mt-6 border-t border-ink">
            <div className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
              <dt className="type-label">Condition</dt>
              <dd className="type-data text-right">
                {product.condition}. {conditionMeaning[product.condition]}
              </dd>
            </div>
            {size ? (
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
                {isOneSize(size.label) ? (
                  <>
                    <dt className="sr-only">Size</dt>
                    <dd className="type-label">One size</dd>
                  </>
                ) : (
                  <>
                    <dt className="type-label">Size</dt>
                    <dd className="type-data text-right">{size.label}</dd>
                  </>
                )}
              </div>
            ) : null}
          </dl>

          <div className="mt-6">
            <AddToBag product={product} size={size} />
          </div>

          {/* All closed to start. */}
          <div className="mt-6 border-t border-line">
            <Accordion title="Condition & flaws">
              <p className="type-body">
                Grade {product.condition}. {conditionMeaning[product.condition]}
              </p>
              <p className="type-body mt-2">
                {product.flaws || "No flaws to report. If we find one, we say so."}
              </p>
            </Accordion>
            <Accordion title="Fabric & label">
              <p className="type-body">{product.fabric}</p>
              <p className="type-body mt-2">Label: {product.label}.</p>
            </Accordion>
            <Accordion title="Shipping & returns">
              <p className="type-body">
                Prepaid only. Tracked courier across India, shipped within {dispatchWindow} of
                payment, at a flat {formatPrice(SHIPPING_FEE)}.
              </p>
              <p className="type-body mt-2">
                All sales are final. If a piece doesn&apos;t match its description, message us within{" "}
                {claimWindow} of delivery with an unboxing video and we&apos;ll make it right.
              </p>
              <p className="type-label mt-3">
                <Link href="/info#shipping" className="link-on">
                  Full shipping terms →
                </Link>
              </p>
              <p className="sr-only">Sold by {site.name}.</p>
            </Accordion>
          </div>
        </div>
      </article>

      {more.length > 0 ? (
        <section className="mt-20 border-t border-ink pt-12 md:mt-32 md:pt-16">
          <div className="mb-10 grid px-(--gutter) md:grid-cols-12">
            <StackLockup
              first="More from"
              second={dropName(product.drop)}
              className="md:col-span-4 md:col-start-8"
            />
          </div>
          <ProductRow products={more} label={`More from ${dropName(product.drop)}`} />
        </section>
      ) : null}
    </>
  );
}
