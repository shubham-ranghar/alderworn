"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import type { Section } from "@/data/products";
import { categories, findCategory } from "@/lib/catalog";

const SECTIONS: Section[] = ["women", "men"];

/** Which listing a path shows, or null anywhere else, including product pages. */
export function listingAt(pathname: string): { section: Section; slug?: string } | null {
  const [root, slug, ...rest] = pathname.split("/").filter(Boolean);
  const section = SECTIONS.find((s) => s === root);
  if (!section || rest.length > 0) return null;
  if (slug && !findCategory(section, slug)) return null;
  return { section, slug };
}

function CategoryLinks({ section, slug, query = "" }: { section: Section; slug?: string; query?: string }) {
  const bar = useRef<HTMLElement>(null);

  // On a phone the active category can start off screen. Moves the row only, never the page.
  useEffect(() => {
    const active = bar.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!bar.current || !active) return;
    bar.current.scrollLeft = active.offsetLeft - (bar.current.clientWidth - active.offsetWidth) / 2;
  }, [section, slug]);

  const links = [
    { href: `/${section}`, label: "All", active: !slug },
    ...categories[section].map((c) => ({
      href: `/${section}/${c.slug}`,
      label: c.name,
      active: c.slug === slug,
    })),
  ];

  return (
    // Every link carries the 1px border and 10px padding, so 6px between them leaves the words
    // 28px apart, and the first word lines up with the gutter when it has no box.
    <nav
      ref={bar}
      aria-label="Categories"
      className="scroll-none relative flex h-(--category-h) items-center gap-1.5 overflow-x-auto border-b border-ink bg-paper px-[calc(var(--gutter)-11px)]"
    >
      {links.map((l) => (
        <Link
          key={l.href}
          // Filters live in the URL, so they carry over to the next category.
          href={query ? `${l.href}?${query}` : l.href}
          aria-current={l.active ? "page" : undefined}
          className={`type-nav shrink-0 border px-2.5 py-1.5 whitespace-nowrap transition-colors duration-300 ${l.active ? "border-ink" : "border-transparent hover:border-line"}`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

function CategoryLinksWithQuery(props: { section: Section; slug?: string }) {
  return <CategoryLinks {...props} query={useSearchParams().toString()} />;
}

export function CategoryBar(props: { section: Section; slug?: string }) {
  return (
    <Suspense fallback={<CategoryLinks {...props} />}>
      <CategoryLinksWithQuery {...props} />
    </Suspense>
  );
}
