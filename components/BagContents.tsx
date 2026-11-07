"use client";

import Link from "next/link";
import { POLICY, SHIPPING_FEE } from "@/config/site";
import type { BagLine } from "@/lib/bagMessage";
import { formatPrice, isPlaceholder, pieces, productHref, sizeText, statusOf } from "@/lib/catalog";
import { useBag } from "./BagProvider";
import { ProductImage } from "./ProductImage";
import { useSaved } from "./useSaved";

/** A size that has gone since it was added is sold, whatever the rest of the product is doing. */
export const lineStatus = ({ product, size }: BagLine) =>
  size.available ? statusOf(product) : "sold";

/**
 * The pieces that can still be requested, and their subtotal. A piece can sell or go on hold
 * after it was added; it stays in the list, but it isn't part of the request.
 */
export function useOpenLines() {
  const { items } = useBag();
  const open = items.filter((l) => lineStatus(l) === "available");
  const subtotal = open.reduce((sum, l) => sum + l.product.price, 0);
  return { items, open, subtotal, total: open.length ? subtotal + SHIPPING_FEE : 0 };
}

/**
 * One piece in the bag: a 72px photo, then name and price, code and size, and Remove /
 * Save for later along the bottom edge of the photo. Used by the drawer (both views) and /bag.
 */
export function BagItem({ line, onNavigate }: { line: BagLine; onNavigate?: () => void }) {
  const { remove } = useBag();
  const { save } = useSaved();
  const { product: p, size } = line;
  const status = lineStatus(line);
  const unavailable = status !== "available";
  const src = p.images[0];
  return (
    <div className="flex gap-4 px-(--gutter) py-5">
      <Link
        href={productHref(p)}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden="true"
        className={`relative block aspect-[4/5] w-[72px] shrink-0 overflow-hidden bg-cream ${status === "sold" ? "opacity-40" : ""}`}
      >
        {/* No photo yet: the plain cream box, with nothing written in it. */}
        {isPlaceholder(src) ? null : (
          <ProductImage src={src} code={p.code} index={0} alt="" sizes="72px" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="type-label min-w-0">
            <Link href={productHref(p)} onClick={onNavigate} className="link">
              {p.title}
            </Link>
          </h3>
          <p className={`type-data shrink-0 ${unavailable ? "line-through" : ""}`}>{formatPrice(p.price)}</p>
        </div>
        <p className="type-data mt-1 truncate text-muted">
          {p.code} · {sizeText(size.label)}
        </p>
        {status === "sold" ? <p className="type-data mt-1 font-bold">SOLD. NOT PART OF YOUR REQUEST.</p> : null}
        {status === "on-hold" ? <p className="type-data mt-1 font-bold">ON HOLD. NOT PART OF YOUR REQUEST.</p> : null}
        {/* 14px padding makes each a 44px tap area; the negative margin puts the text on
            the photo's bottom edge, the extra height reaching into the row's padding. */}
        <div className="-mb-3.5 mt-auto flex gap-x-5">
          <button
            type="button"
            onClick={() => remove(p.code, size.label)}
            aria-label={`Remove ${p.title}, size ${size.label}`}
            className="type-label link py-3.5 text-muted"
          >
            Remove
          </button>
          {/* Out of the bag and into the wishlist; both header counts follow. */}
          <button
            type="button"
            onClick={() => {
              save(p.code);
              remove(p.code, size.label);
            }}
            aria-label={`Save ${p.title}, size ${size.label}, for later in your wishlist`}
            className="type-label link py-3.5 text-muted"
          >
            Save for later
          </button>
        </div>
      </div>
    </div>
  );
}

/** Every piece in the bag, a thin line between each. */
export function BagLines({ onNavigate, className = "" }: { onNavigate?: () => void; className?: string }) {
  const { items } = useBag();
  return (
    <ul className={`divide-y divide-line ${className}`}>
      {items.map((line) => (
        <li key={`${line.product.code}:${line.size.label}`}>
          <BagItem line={line} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  );
}

/** Subtotal, flat shipping and total, for the pieces that can still be requested. */
export function BagTotals({ className = "" }: { className?: string }) {
  const { open, subtotal, total } = useOpenLines();
  return (
    <dl className={className}>
      <div className="flex items-baseline justify-between">
        <dt className="type-label">Subtotal, {pieces(open.length)}</dt>
        <dd className="type-data">{formatPrice(subtotal)}</dd>
      </div>
      {open.length > 0 ? (
        <>
          <div className="mt-1.5 flex items-baseline justify-between">
            <dt className="type-label">Shipping, flat</dt>
            <dd className="type-data">{formatPrice(SHIPPING_FEE)}</dd>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
            <dt className="type-label">Total</dt>
            <dd className="type-data font-bold">{formatPrice(total)}</dd>
          </div>
        </>
      ) : null}
    </dl>
  );
}

/** The drawer's two rows: flat shipping, then the total. */
function DrawerTotals() {
  const { open, total } = useOpenLines();
  return (
    <dl className="flex flex-col gap-3">
      {open.length > 0 ? (
        <div className="type-data flex items-baseline justify-between text-muted">
          <dt>Shipping</dt>
          <dd>{formatPrice(SHIPPING_FEE)}</dd>
        </div>
      ) : null}
      <div className="flex items-baseline justify-between">
        <dt className="type-label">Total</dt>
        <dd className="type-data font-bold">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}

/**
 * The drawer's full bag, for review only. The pieces scroll; the totals, "Continue to
 * details" and the payment line stay pinned at the bottom. It renders the drawer's scroll
 * area and footer itself, so it must sit directly inside the drawer's flex column.
 */
export function BagReview({ onNavigate }: { onNavigate?: () => void }) {
  const { items } = useOpenLines();

  if (items.length === 0) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-(--gutter) py-10">
        <p className="type-title">Your bag is empty.</p>
        <p className="type-label mt-6 flex gap-5">
          <Link href="/women" className="link-on" onClick={onNavigate}>
            Women
          </Link>
          <Link href="/men" className="link-on" onClick={onNavigate}>
            Men
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <BagLines onNavigate={onNavigate} />
      </div>
      <div className="shrink-0 border-t border-ink px-(--gutter) pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <DrawerTotals />
        <Link href="/bag" onClick={onNavigate} className="btn mt-3">
          Continue to details →
        </Link>
        <p className="type-label mt-3 text-center text-balance text-muted">{POLICY.drawer}</p>
      </div>
    </>
  );
}
