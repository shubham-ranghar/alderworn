import Link from "next/link";
import type { ReactNode } from "react";
import { claimWindow, dispatchWindow, SHIPPING_FEE, site } from "@/config/site";
import type { Measurements, Product } from "@/data/products";
import { conditionMeaning, dropName, formatPrice, moreFromDrop } from "@/lib/catalog";
import { AddToBag } from "./AddToBag";
import { StackLockup } from "./Lockups";
import { ProductGallery } from "./ProductGallery";
import { ProductRow } from "./ProductCard";

const MEASURE_ORDER: (keyof Measurements)[] = [
  "chest",
  "waist",
  "shoulder",
  "sleeve",
  "length",
  "inseam",
  "width",
  "height",
];

function Accordion({
  title,
  open = false,
  children,
}: {
  title: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={open} className="border-b border-line">
      <summary className="type-label flex items-center justify-between py-3">
        {title}
        <span aria-hidden="true">
          <span className="when-closed">+</span>
          <span className="when-open">−</span>
        </span>
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

export function ProductPage({ product }: { product: Product }) {
  const more = moreFromDrop(product);
  const rows = MEASURE_ORDER.flatMap((key) => {
    const value = product.measurements[key];
    return value === undefined ? [] : [[key, value] as const];
  });

  return (
    <>
      <article className="md:grid md:grid-cols-[3fr_2fr] md:items-start">
        <ProductGallery product={product} />

        <div className="px-(--gutter) pt-8 pb-4 md:sticky md:top-(--header-h) md:max-h-[calc(100svh-var(--header-h))] md:overflow-y-auto md:border-l md:border-line md:px-8 md:pt-12 lg:px-12">
          <StackLockup
            as="h1"
            size="type-title"
            roman={product.title}
            italic={`circa ${product.era}`}
            caption={product.code}
          />

          <dl className="mt-8 border-t border-ink">
            <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
              <dt className="type-label">Price</dt>
              <dd className={`type-data ${product.status === "sold" ? "line-through" : ""}`}>
                {formatPrice(product.price)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
              <dt className="type-label">Size</dt>
              <dd className="type-data">{product.size}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
              <dt className="type-label">Condition</dt>
              <dd className="type-data text-right">
                {product.condition}. {conditionMeaning[product.condition]}
              </dd>
            </div>
          </dl>

          <p className="type-body my-5">Only one exists.</p>

          <AddToBag product={product} />

          <div className="mt-6 border-t border-line">
            <Accordion title="Measurements" open>
              <table className="type-data w-full">
                <caption className="sr-only">Measurements in centimetres, laid flat</caption>
                <tbody>
                  {rows.map(([key, value]) => (
                    <tr key={key}>
                      <th scope="row" className="py-0.5 text-left font-normal">
                        {key}
                      </th>
                      <td className="py-0.5 text-right">{value} CM</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="type-label mt-3 text-muted">Measured laid flat</p>
            </Accordion>
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
