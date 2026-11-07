"use client";

import Link from "next/link";
import { POLICY, site } from "@/config/site";
import type { Product, ProductSize } from "@/data/products";
import { statusOf } from "@/lib/catalog";
import { useBag } from "./BagProvider";

export function AddToBag({ product, size }: { product: Product; size: ProductSize | null }) {
  const { has, addAndShow, openDrawer } = useBag();
  const status = statusOf(product);

  if (status === "sold") {
    return (
      <p className="btn btn-off" aria-disabled="true">
        <span>
          Sold —{" "}
          <Link href="/archive" className="link-on text-ink">
            See archive
          </Link>
        </span>
      </p>
    );
  }

  if (status === "on-hold") {
    const text = encodeURIComponent(`Hello. Is ${product.code} still on hold?`);
    return (
      <p className="btn btn-off" aria-disabled="true">
        <span>
          On hold —{" "}
          <a
            href={`https://wa.me/${site.whatsappNumber}?text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-on text-ink"
          >
            Ask us
          </a>
        </span>
      </p>
    );
  }

  return (
    <>
      {/* One button in every state, so focus has somewhere to return when the drawer
          closes: adding a piece turns it into "In your bag" rather than replacing it. */}
      {size ? (
        <button
          type="button"
          aria-haspopup="dialog"
          className="btn"
          onClick={() =>
            has(product.code, size.label) ? openDrawer() : addAndShow(product.code, size.label)
          }
        >
          {has(product.code, size.label) ? "In your bag · View bag →" : "Add to bag"}
        </button>
      ) : null}
      <PolicyLine />
    </>
  );
}

/** The one payment and shipping line under the button. */
function PolicyLine() {
  return <p className="type-label mt-2 text-center text-balance text-muted">{POLICY.product}</p>;
}
