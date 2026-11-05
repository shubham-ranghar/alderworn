"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import type { Condition, Product, Section } from "@/data/products";
import { categories, conditionMeaning, pieces, sortNewest } from "@/lib/catalog";
import { ProductGrid } from "./ProductCard";
import { Sheet, SheetBar } from "./Sheet";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "low", label: "Price low–high" },
  { value: "high", label: "Price high–low" },
] as const;

type SortValue = (typeof SORTS)[number]["value"];

const list = (params: URLSearchParams, key: string) =>
  (params.get(key) ?? "").split("|").filter(Boolean);

const unique = (values: string[]) => [...new Set(values)];

function ListingView({
  section,
  products,
  activeSlug,
  params,
  setParams,
}: {
  section: Section;
  products: Product[];
  activeSlug?: string;
  params: URLSearchParams;
  setParams: (next: URLSearchParams) => void;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const sizes = list(params, "size");
  const eras = list(params, "era");
  const conditions = list(params, "condition");
  const min = params.get("min") ?? "";
  const max = params.get("max") ?? "";
  const hideSold = params.get("hideSold") === "1";
  const sort: SortValue = SORTS.find((s) => s.value === params.get("sort"))?.value ?? "newest";

  const facets = useMemo(
    () => ({
      sizes: unique(products.map((p) => p.size)).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      ),
      eras: unique(products.map((p) => p.era)).sort(),
    }),
    [products],
  );

  const shown = useMemo(() => {
    const lo = min === "" ? 0 : Number(min);
    const hi = max === "" ? Infinity : Number(max);
    const filtered = products.filter(
      (p) =>
        (sizes.length === 0 || sizes.includes(p.size)) &&
        (eras.length === 0 || eras.includes(p.era)) &&
        (conditions.length === 0 || conditions.includes(p.condition)) &&
        p.price >= lo &&
        p.price <= hi &&
        !(hideSold && p.status === "sold"),
    );
    if (sort === "low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...filtered].sort((a, b) => b.price - a.price);
    return sortNewest(filtered);
  }, [products, sizes, eras, conditions, min, max, hideSold, sort]);

  const change = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    mutate(next);
    setParams(next);
  };

  const toggle = (key: string, current: string[], value: string) =>
    change((p) => {
      const values = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (values.length) p.set(key, values.join("|"));
      else p.delete(key);
    });

  const setValue = (key: string, value: string) =>
    change((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });

  const clear = () =>
    change((p) => {
      ["size", "era", "condition", "min", "max", "hideSold"].forEach((k) => p.delete(k));
    });

  const activeCount =
    sizes.length + eras.length + conditions.length + (min ? 1 : 0) + (max ? 1 : 0) + (hideSold ? 1 : 0);

  const query = params.toString();
  const withQuery = (href: string) => (query ? `${href}?${query}` : href);

  const categoryLinks = [
    { href: `/${section}`, label: "All", active: !activeSlug },
    ...categories[section].map((c) => ({
      href: `/${section}/${c.slug}`,
      label: c.name,
      active: c.slug === activeSlug,
    })),
  ];

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-ink px-(--gutter) py-3 md:flex-row md:items-baseline md:justify-between">
        <nav aria-label="Categories" className="flex flex-wrap gap-x-4 gap-y-1">
          {categoryLinks.map((c) => (
            <Link
              key={c.href}
              href={withQuery(c.href)}
              aria-current={c.active ? "page" : undefined}
              className="type-label link py-1"
            >
              {c.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-baseline justify-between gap-5 md:justify-end">
          <p role="status" className="type-data">
            {pieces(shown.length)}
          </p>
          <div className="flex items-baseline gap-5">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setFilterOpen(true)}
              className="type-label link py-1"
            >
              Filter{activeCount ? ` (${activeCount})` : ""}
            </button>
            <button
              type="button"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((o) => !o)}
              className="type-label link py-1"
            >
              Sort {sortOpen ? "−" : "+"}
            </button>
          </div>
        </div>
      </div>

      {sortOpen ? (
        <div className="flex flex-wrap justify-end gap-x-5 gap-y-1 border-b border-line px-(--gutter) py-2">
          {SORTS.map((s) => (
            <button
              key={s.value}
              type="button"
              aria-pressed={sort === s.value}
              onClick={() => setValue("sort", s.value === "newest" ? "" : s.value)}
              className="type-label link py-1"
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}

      <h2 className="sr-only">Pieces</h2>
      {shown.length > 0 ? (
        <div className="-mt-px">
          <ProductGrid products={shown} />
        </div>
      ) : (
        <div className="px-(--gutter) py-20">
          <p className="type-title">Nothing fits that.</p>
          {activeCount ? (
            <button type="button" onClick={clear} className="type-label link-on mt-4">
              Clear filters
            </button>
          ) : null}
        </div>
      )}

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} label="Filter">
        <SheetBar title="Filter" onClose={() => setFilterOpen(false)} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="border-b border-line p-(--gutter)">
            <p className="type-label mb-3 text-muted">Category</p>
            <ul className="flex flex-col gap-1.5">
              {categoryLinks.map((c) => (
                <li key={c.href}>
                  <Link
                    href={withQuery(c.href)}
                    aria-current={c.active ? "page" : undefined}
                    onClick={() => setFilterOpen(false)}
                    className="type-label link"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <CheckGroup
            legend="Size"
            options={facets.sizes.map((s) => ({ value: s, label: s }))}
            selected={sizes}
            onToggle={(v) => toggle("size", sizes, v)}
            twoCol
          />
          <CheckGroup
            legend="Era"
            options={facets.eras.map((e) => ({ value: e, label: e }))}
            selected={eras}
            onToggle={(v) => toggle("era", eras, v)}
            twoCol
          />
          <CheckGroup
            legend="Condition"
            options={(Object.keys(conditionMeaning) as Condition[]).map((c) => ({
              value: c,
              label: `${c}: ${conditionMeaning[c]}`,
            }))}
            selected={conditions}
            onToggle={(v) => toggle("condition", conditions, v)}
          />

          <fieldset className="border-b border-line p-(--gutter)">
            <legend className="type-label float-left mb-3 w-full text-muted">Price range</legend>
            <div className="clear-both grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price-min" className="type-label">
                  From ₹
                </label>
                <input
                  id="price-min"
                  type="number"
                  min={0}
                  step={50}
                  inputMode="numeric"
                  className="field"
                  value={min}
                  onChange={(e) => setValue("min", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price-max" className="type-label">
                  To ₹
                </label>
                <input
                  id="price-max"
                  type="number"
                  min={0}
                  step={50}
                  inputMode="numeric"
                  className="field"
                  value={max}
                  onChange={(e) => setValue("max", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <div className="p-(--gutter)">
            <label className="type-label flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="check"
                checked={hideSold}
                onChange={(e) => setValue("hideSold", e.target.checked ? "1" : "")}
              />
              Hide sold
            </label>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-5 border-t border-ink p-(--gutter)">
          <button type="button" onClick={clear} className="type-label link shrink-0 py-2">
            Clear
          </button>
          <button type="button" onClick={() => setFilterOpen(false)} className="btn">
            Show {pieces(shown.length)}
          </button>
        </div>
      </Sheet>
    </>
  );
}

function CheckGroup({
  legend,
  options,
  selected,
  onToggle,
  twoCol = false,
}: {
  legend: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  twoCol?: boolean;
}) {
  return (
    <fieldset className="border-b border-line p-(--gutter)">
      <legend className="type-label float-left mb-3 w-full text-muted">{legend}</legend>
      <div className={`clear-both grid gap-x-4 gap-y-2 ${twoCol ? "grid-cols-2" : ""}`}>
        {options.map((o) => (
          <label key={o.value} className="type-label flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="check"
              checked={selected.includes(o.value)}
              onChange={() => onToggle(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type Props = { section: Section; products: Product[]; activeSlug?: string };

/** Filter state lives in the URL, so it survives category changes and can be shared. */
function ListingWithParams(props: Props) {
  const urlParams = useSearchParams();
  const pathname = usePathname();
  // Local state answers immediately. The URL follows in a transition, which is too slow to drive
  // controlled inputs: checkboxes would flicker and fast typing would lose characters.
  const [params, setLocal] = useState(() => new URLSearchParams(urlParams.toString()));
  return (
    <ListingView
      {...props}
      params={params}
      setParams={(next) => {
        setLocal(next);
        const qs = next.toString();
        window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
      }}
    />
  );
}

export function Listing(props: Props) {
  return (
    <Suspense
      fallback={<ListingView {...props} params={new URLSearchParams()} setParams={() => undefined} />}
    >
      <ListingWithParams {...props} />
    </Suspense>
  );
}
