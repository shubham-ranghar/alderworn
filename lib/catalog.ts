import { products, type Condition, type Product, type Section, type Status } from "@/data/products";
import { site } from "@/config/site";

export type Category = {
  name: string;
  slug: string;
};

export const toSlug = (name: string) =>
  name.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const cat = (name: string): Category => ({ name, slug: toSlug(name) });

export const categories: Record<Section, Category[]> = {
  women: [
    cat("Dresses"),
    cat("Knitwear"),
    cat("Coats & Jackets"),
    cat("Shirts & Blouses"),
    cat("Skirts & Trousers"),
    cat("Bags & Scarves"),
  ],
  men: [
    cat("Shirts"),
    cat("Knitwear"),
    cat("Coats & Jackets"),
    cat("Tailoring"),
    cat("Trousers"),
    cat("Accessories"),
  ],
};

export const conditionMeaning: Record<Condition, string> = {
  A: "Near new.",
  B: "Lightly worn.",
  C: "Worn, marks noted below.",
};

export const formatPrice = (n: number) =>
  `${site.currency.symbol}${new Intl.NumberFormat(site.currency.locale).format(n)}`;

export const dropLabel = (n: number) => `DROP ${String(n).padStart(3, "0")}`;
export const dropName = (n: number) => `Drop ${String(n).padStart(3, "0")}`;

export const pieces = (n: number) => `${n} ${n === 1 ? "PIECE" : "PIECES"}`;

export const currentDrop = Math.max(...products.map((p) => p.drop));

const byNewest = (a: Product, b: Product) =>
  b.addedAt.localeCompare(a.addedAt) || b.code.localeCompare(a.code);

export const sortNewest = (list: Product[]) => [...list].sort(byNewest);

export const inSection = (section: Section) =>
  sortNewest(products.filter((p) => p.section === section));

export const inCategory = (section: Section, slug: string) =>
  inSection(section).filter((p) => toSlug(p.category) === slug);

export const findCategory = (section: Section, slug: string) =>
  categories[section].find((c) => c.slug === slug);

export const findProduct = (code: string) => products.find((p) => p.code === code);

export const productHref = (p: Pick<Product, "section" | "code">) => `/${p.section}/${p.code}`;

/** A product's real status: with no size left to buy, it counts as sold. */
export const statusOf = (p: Pick<Product, "status" | "sizes">): Status =>
  p.sizes.some((s) => s.available) ? p.status : "sold";

export const soldPieces = () => sortNewest(products.filter((p) => statusOf(p) === "sold"));

export const latestDropPieces = (limit = 8) =>
  sortNewest(products.filter((p) => p.drop === currentDrop)).slice(0, limit);

export const moreFromDrop = (p: Product, limit = 8) =>
  sortNewest(
    products.filter((o) => o.drop === p.drop && o.code !== p.code && statusOf(o) !== "sold"),
  ).slice(0, limit);

/** Date a drop went out, taken from its pieces. */
export const dropDate = (n: number) => {
  const iso = products
    .filter((p) => p.drop === n)
    .map((p) => p.addedAt)
    .sort()
    .pop();
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
};

export const isPlaceholder = (src: string) => src.startsWith("placeholder:");

/** Stable cream / taupe choice so panels vary without being random. */
export const placeholderTone = (code: string, index: number): "cream" | "taupe" => {
  const n = Number(code.replace(/\D/g, "")) || 0;
  return (n + index) % 2 === 0 ? "cream" : "taupe";
};
