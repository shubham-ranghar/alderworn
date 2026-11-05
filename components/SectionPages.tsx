import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Section } from "@/data/products";
import { products } from "@/data/products";
import { categories, findCategory, findProduct, inCategory, inSection } from "@/lib/catalog";
import { Listing } from "./Listing";
import { ProductPage } from "./ProductPage";

const NAME: Record<Section, string> = { women: "Women", men: "Men" };

export function SectionHome({ section }: { section: Section }) {
  return <Listing title={NAME[section]} products={inSection(section)} />;
}

export function CategoryPage({ section, slug }: { section: Section; slug: string }) {
  const category = findCategory(section, slug);
  if (!category) notFound();
  return (
    <Listing
      key={slug}
      title={`${category.name} for ${NAME[section]}`}
      products={inCategory(section, slug)}
    />
  );
}

/** /women/[slug] and /men/[slug] hold both categories and item codes. */
export function SectionSlug({ section, slug }: { section: Section; slug: string }) {
  if (findCategory(section, slug)) return <CategoryPage section={section} slug={slug} />;
  const product = findProduct(slug);
  if (!product || product.section !== section) notFound();
  return <ProductPage product={product} />;
}

export function sectionSlugParams(section: Section) {
  return [
    ...categories[section].map((c) => ({ slug: c.slug })),
    ...products.filter((p) => p.section === section).map((p) => ({ slug: p.code })),
  ];
}

export function sectionSlugMetadata(section: Section, slug: string): Metadata {
  const category = findCategory(section, slug);
  if (category) return { title: `${category.name}, ${NAME[section]}` };
  const product = findProduct(slug);
  if (!product || product.section !== section) return {};
  return {
    title: product.title,
    description: `${product.title}, circa ${product.era}. Size ${product.sizes.map((s) => s.label).join(", ")}.${product.sizes.length === 1 ? " Only one exists." : ""}`,
  };
}
