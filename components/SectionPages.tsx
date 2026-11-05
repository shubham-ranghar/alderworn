import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import type { Section } from "@/data/products";
import { products } from "@/data/products";
import {
  categories,
  currentDrop,
  dropLabel,
  findCategory,
  findProduct,
  inCategory,
  inSection,
  pieces,
} from "@/lib/catalog";
import { Band } from "./Band";
import { Listing } from "./Listing";
import { ScriptLockup, StackLockup } from "./Lockups";
import { ProductPage } from "./ProductPage";
import { Seal } from "./Seal";

const NAME: Record<Section, string> = { women: "Women", men: "Men" };

/** Script uses 2 and 3 of 4. */
export function SectionHome({ section }: { section: Section }) {
  const all = inSection(section);
  const women = section === "women";
  return (
    <>
      <Band
        tone={women ? "cream" : "taupe"}
        className="min-h-[72svh]"
        labels={{
          tl: dropLabel(currentDrop),
          tc: NAME[section],
          tr: <Seal className="h-[clamp(5rem,9vw,8.5rem)] w-[clamp(5rem,9vw,8.5rem)]" />,
          bl: "One of each",
          bc: <span className="type-label">{pieces(all.length)}</span>,
          br: site.season,
        }}
      >
        <ScriptLockup
          script={women ? "Hers," : "His,"}
          word="before."
          wordClass="type-mega-fit [--fit:23vw] md:[--fit:16vw] md:expanded"
          scriptStyle={{
            fontSize: "1.6em",
            top: "-0.72em",
            left: women ? "0.02em" : "0.18em",
            rotate: women ? "-6deg" : "-7deg",
          }}
          className={`mt-[0.6em] ${women ? "" : "md:ml-auto"}`}
        />
      </Band>
      <Listing section={section} products={all} />
    </>
  );
}

export function CategoryPage({ section, slug }: { section: Section; slug: string }) {
  const category = findCategory(section, slug);
  if (!category) notFound();
  const list = inCategory(section, slug);
  return (
    <>
      <div className="px-(--gutter) py-12 md:py-20">
        <StackLockup
          as="h1"
          roman={category.lockup[0]}
          italic={category.lockup[1]}
          caption={`${NAME[section]} / One of each`}
        />
      </div>
      <div className="border-t border-ink">
        <Listing key={slug} section={section} products={list} activeSlug={slug} />
      </div>
    </>
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
    description: `${product.title}, circa ${product.era}. Size ${product.size}. Only one exists.`,
  };
}
