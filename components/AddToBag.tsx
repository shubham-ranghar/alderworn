"use client";

import Link from "next/link";
import { dispatchWindow, site } from "@/config/site";
import type { Product } from "@/data/products";
import { useBag } from "./BagProvider";

export function AddToBag({ product }: { product: Product }) {
  const { has, add, openDrawer } = useBag();

  if (product.status === "sold") {
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

  if (product.status === "on-hold") {
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
      {has(product.code) ? (
        <Link href="/bag" className="btn btn-quiet">
          In your bag — view bag
        </Link>
      ) : (
        <button
          type="button"
          className="btn"
          onClick={() => {
            add(product.code);
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
