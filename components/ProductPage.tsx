import Link from "next/link";
import { claimWindow, dispatchWindow, SHIPPING_FEE, site } from "@/config/site";
import type { Product } from "@/data/products";
import { conditionMeaning, dropName, formatPrice, moreFromDrop, statusOf } from "@/lib/catalog";
import { Accordion } from "./Accordion";
import { StackLockup } from "./Lockups";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchase } from "./ProductPurchase";
import { ProductRow } from "./ProductCard";
import { SaveButton } from "./SaveButton";

export function ProductPage({ product }: { product: Product }) {
  const more = moreFromDrop(product);
  const status = statusOf(product);

  return (
    <>
      <article className="md:grid md:grid-cols-[3fr_2fr] md:items-start">
        <ProductGallery product={product} />

        <div className="px-(--gutter) pt-8 pb-4 md:sticky md:top-(--header-h) md:max-h-[calc(100svh-var(--header-h))] md:overflow-y-auto md:border-l md:border-line md:px-8 md:pt-12 lg:px-12">
          {/* The padding keeps a long title clear of the heart. The offset puts the heart, not its
              tap area, on the panel's edge. */}
          <div className="relative px-8">
            <StackLockup
              as="h1"
              size="type-title"
              roman={product.title}
              italic={`circa ${product.era}`}
              caption={product.code}
            />
            <SaveButton
              code={product.code}
              title={product.title}
              className="absolute -top-3 -right-[13px]"
            />
          </div>

          <dl className="mt-8 border-t border-ink">
            <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
              <dt className="type-label">Price</dt>
              <dd className={`type-data ${status === "sold" ? "line-through" : ""}`}>
                {formatPrice(product.price)}
              </dd>
            </div>
            {/* A piece that can be bought shows its sizes as buttons instead. */}
            {status !== "available" ? (
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                <dt className="type-label">Size</dt>
                <dd className="type-data">{product.sizes.map((s) => s.label).join(" / ")}</dd>
              </div>
            ) : null}
            <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
              <dt className="type-label">Condition</dt>
              <dd className="type-data text-right">
                {product.condition}. {conditionMeaning[product.condition]}
              </dd>
            </div>
          </dl>

          <ProductPurchase product={product}>
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
          </ProductPurchase>
        </div>
      </article>

      {more.length > 0 ? (
        <section className="mt-20 border-t border-ink pt-12 md:mt-32 md:pt-16">
          <div className="mb-10 grid px-(--gutter) md:grid-cols-12">
            <StackLockup
              roman="More from"
              italic={dropName(product.drop)}
              className="md:col-span-4 md:col-start-8"
            />
          </div>
          <ProductRow products={more} label={`More from ${dropName(product.drop)}`} />
        </section>
      ) : null}
    </>
  );
}
