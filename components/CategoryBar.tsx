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
    // The words sit 28px apart. The active one carries the header's underline (.link with
    // aria-current); the others grow it from the left on hover.
    <nav
      ref={bar}
      aria-label="Categories"
      className="scroll-none relative flex h-(--category-h) items-center gap-7 overflow-x-auto border-b border-ink bg-paper px-(--gutter)"
    >
      {links.map((l) => (
        <Link
          key={l.href}
          // Filters live in the URL, so they carry over to the next category.
          href={query ? `${l.href}?${query}` : l.href}
          aria-current={l.active ? "page" : undefined}
          className="type-label link shrink-0 py-2 whitespace-nowrap"
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
