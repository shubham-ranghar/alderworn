"use client";

import Link from "next/link";
import { dispatchWindow, site } from "@/config/site";
import type { Product, ProductSize } from "@/data/products";
import { statusOf } from "@/lib/catalog";
import { useBag } from "./BagProvider";

export function AddToBag({ product, size }: { product: Product; size: ProductSize | null }) {
  const { has, add, openDrawer } = useBag();
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
      {!size ? (
        <button type="button" disabled className="btn btn-off">
          Select a size
        </button>
      ) : has(product.code, size.label) ? (
        <Link href="/bag" className="btn btn-quiet">
          In your bag — view bag
        </Link>
      ) : (
        <button
          type="button"
          className="btn"
          onClick={() => {
            add(product.code, size.label);
            openDrawer();
          }}
        >
          Add to bag
        </button>
      )}
      <p className="type-label mt-2 text-center">Prepaid only · Ships in {dispatchWindow}</p>
    </>
  );
}
