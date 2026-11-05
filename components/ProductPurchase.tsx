"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import type { Measurements, Product } from "@/data/products";
import { statusOf } from "@/lib/catalog";
import { Accordion } from "./Accordion";
import { AddToBag } from "./AddToBag";

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

/**
 * The size choice, the bag button and the measurements, which all follow the selected size.
 * `children` is the rest of the accordion stack.
 */
export function ProductPurchase({ product, children }: { product: Product; children: ReactNode }) {
  const buyable = statusOf(product) === "available";
  const inStock = product.sizes.filter((s) => s.available);
  const [selected, setSelected] = useState(
    buyable && inStock.length === 1 ? inStock[0].label : null,
  );
  const [measurementsOpen, setMeasurementsOpen] = useState(true);
  const measurementsRef = useRef<HTMLDetailsElement>(null);
  const labelId = useId();

  const size = product.sizes.find((s) => s.label === selected) ?? null;
  const measurements = size?.measurements ?? product.measurements;
  const rows = MEASURE_ORDER.flatMap((key) => {
    const value = measurements[key];
    return value === undefined ? [] : [[key, value] as const];
  });

  const openSizeGuide = () => {
    setMeasurementsOpen(true);
    // After the panel has opened, so the scroll accounts for its height.
    requestAnimationFrame(() => measurementsRef.current?.scrollIntoView({ block: "nearest" }));
  };

  return (
    <>
      {product.sizes.length === 1 ? <p className="type-body my-5">Only one exists.</p> : null}

      {buyable ? (
        <div className="my-5">
          <div className="flex items-baseline justify-between gap-4">
            <p id={labelId} className="type-label">
              Select size
            </p>
            <button type="button" onClick={openSizeGuide} className="type-label link-on">
              Size guide
            </button>
          </div>
          <div role="group" aria-labelledby={labelId} className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s.label}
                type="button"
                disabled={!s.available}
                aria-pressed={s.label === selected}
                aria-label={s.available ? undefined : `${s.label}, unavailable`}
                onClick={() => setSelected(s.label)}
                className={`min-h-11 min-w-11 border px-2 text-[12px] whitespace-nowrap uppercase ${
                  s.label === selected
                    ? "border-ink bg-ink text-paper"
                    : s.available
                      ? "border-ink"
                      : "border-muted text-muted line-through"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <AddToBag product={product} size={size} />

      <div className="mt-6 border-t border-line">
        <Accordion
          ref={measurementsRef}
          title="Measurements"
          open={measurementsOpen}
          onToggle={(e) => setMeasurementsOpen(e.currentTarget.open)}
          className="scroll-mt-(--header-h)"
        >
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
          <p className="type-label mt-3 text-muted">
            {size?.measurements ? `Size ${size.label}. ` : ""}Measured laid flat
          </p>
        </Accordion>
        {children}
      </div>
    </>
  );
}
