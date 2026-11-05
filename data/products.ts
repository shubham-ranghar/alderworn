/**
 * THE CATALOGUE. To add a piece, copy one block and edit it. See README.md.
 *
 * Photos: put them in /public/products/[code]/1.jpg, 2.jpg … then swap
 *   images: placeholders(4)
 * for
 *   images: photos("AW-W-0142", 4)
 */

export type Section = "women" | "men";
export type Condition = "A" | "B" | "C";
export type Status = "available" | "on-hold" | "sold";
export type ProductCategory = "Shirts" | "Trousers" | "Jackets" | "Tailoring" | "Accessories";

export type Measurements = Partial<
  Record<
    "chest" | "length" | "shoulder" | "sleeve" | "waist" | "inseam" | "width" | "height",
    number
  >
>;

export type ProductSize = {
  /** As written on the tag. */
  label: string;
  available: boolean;
  /** Only if this size measures differently. Replaces the product's measurements. */
  measurements?: Measurements;
};

export type Product = {
  code: string;
  section: Section;
  category: ProductCategory;
  title: string;
  /** Brand on the tag, or "Unbranded". */
  label: string;
  era: string;
  /** A one-of-one piece has a single entry. */
  sizes: ProductSize[];
  /** Centimetres, laid flat. Include whichever apply. */
  measurements: Measurements;
  fabric: string;
  condition: Condition;
  /** Honest text. Can be empty. */
  flaws: string;
  price: number;
  images: string[];
  status: Status;
  drop: number;
  /** YYYY-MM-DD */
  addedAt: string;
};

/** Paths to real photos: /products/[code]/1.jpg … n.jpg */
export const photos = (code: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/products/${code}/${i + 1}.jpg`);

/** Flat colour panels, shown until real photos exist. */
export const placeholders = (count: number) =>
  Array.from({ length: count }, (_, i) => `placeholder:${i + 1}`);

export const products: Product[] = [
  /* ---------------------------------- WOMEN ---------------------------------- */
  {
    code: "AW-W-0147",
    section: "women",
    category: "Shirts",
    title: "Ivory poplin shirt",
    label: "Unbranded",
    era: "2000s",
    sizes: [
      {
        label: "S",
        available: true,
        measurements: { chest: 47, length: 66, shoulder: 39, sleeve: 59 },
      },
      { label: "M", available: true },
      { label: "L", available: false },
      { label: "XL", available: true },
    ],
    measurements: { chest: 50, length: 68, shoulder: 41, sleeve: 60 },
    fabric: "100% cotton poplin",
    condition: "A",
    flaws: "",
    price: 1350,
    images: placeholders(3),
    status: "available",
    drop: 4,
    addedAt: "2026-11-01",
  },
  {
    code: "AW-W-0131",
    section: "women",
    category: "Trousers",
    title: "Houndstooth wool trousers",
    label: "Harlow & Finch",
    era: "1980s",
    sizes: [{ label: "UK 10", available: true }],
    measurements: { waist: 36, inseam: 76, length: 104 },
    fabric: "Wool, half lined",
    condition: "B",
    flaws: "Hem let down once. The old crease is faintly visible.",
    price: 2800,
    images: placeholders(3),
    status: "available",
    drop: 3,
    addedAt: "2026-09-12",
  },

  /* ----------------------------------- MEN ----------------------------------- */
  {
    code: "AW-M-0092",
    section: "men",
    category: "Accessories",
    title: "Silk repp tie",
    label: "Ashby Tailors",
    era: "1990s",
    sizes: [{ label: "One size", available: true }],
    measurements: { length: 146, width: 9 },
    fabric: "100% silk, wool interlining",
    condition: "A",
    flaws: "",
    price: 950,
    images: placeholders(2),
    status: "available",
    drop: 4,
    addedAt: "2026-11-01",
  },
  {
    code: "AW-M-0089",
    section: "men",
    category: "Trousers",
    title: "Brown corduroy trousers",
    label: "Corvin",
    era: "1970s",
    sizes: [{ label: "W32 L31", available: true }],
    measurements: { waist: 41, inseam: 79, length: 107 },
    fabric: "100% cotton corduroy, 8-wale",
    condition: "B",
    flaws: "Wale slightly flattened at the knees. Comes with the territory.",
    price: 2350,
    images: placeholders(3),
    status: "available",
    drop: 4,
    addedAt: "2026-11-01",
  },
  {
    code: "AW-M-0088",
    section: "men",
    category: "Shirts",
    title: "Striped oxford shirt",
    label: "Unbranded",
    era: "1990s",
    sizes: [{ label: "15½", available: true }],
    measurements: { chest: 56, length: 78, shoulder: 47, sleeve: 63 },
    fabric: "100% cotton oxford cloth",
    condition: "A",
    flaws: "",
    price: 1450,
    images: placeholders(3),
    status: "available",
    drop: 4,
    addedAt: "2026-11-01",
  },
  {
    code: "AW-M-0087",
    section: "men",
    category: "Tailoring",
    title: "Navy double-breasted blazer",
    label: "Ashby Tailors",
    era: "1980s",
    sizes: [{ label: "40R", available: true }],
    measurements: { chest: 54, length: 76, shoulder: 45, sleeve: 63 },
    fabric: "100% wool serge, full canvas, gilt buttons",
    condition: "B",
    flaws: "Light shine at the elbows. Inner pocket mended by hand.",
    price: 4800,
    images: placeholders(4),
    status: "available",
    drop: 4,
    addedAt: "2026-11-01",
  },
  {
    code: "AW-M-0081",
    section: "men",
    category: "Trousers",
    title: "Grey flannel pleated trousers",
    label: "Ashby Tailors",
    era: "1990s",
    sizes: [{ label: "W34", available: true }],
    measurements: { waist: 43, inseam: 78, length: 108 },
    fabric: "100% wool flannel. Button fly.",
    condition: "B",
    flaws: "Tiny moth nick on the back of the left thigh. Rewoven.",
    price: 2600,
    images: placeholders(3),
    status: "available",
    drop: 3,
    addedAt: "2026-09-12",
  },
  {
    code: "AW-M-0074",
    section: "men",
    category: "Tailoring",
    title: "Herringbone tweed sports jacket",
    label: "Unbranded",
    era: "1970s",
    sizes: [{ label: "42L", available: true }],
    measurements: { chest: 57, length: 80, shoulder: 47, sleeve: 66 },
    fabric: "100% wool tweed. Leather elbow patches.",
    condition: "B",
    flaws: "Patches added later. Previous owner's name tape inside the collar.",
    price: 5200,
    images: placeholders(4),
    status: "available",
    drop: 3,
    addedAt: "2026-09-12",
  },
  {
    code: "AW-M-0070",
    section: "men",
    category: "Shirts",
    title: "Cream linen camp-collar shirt",
    label: "Corvin",
    era: "1990s",
    sizes: [{ label: "L", available: true }],
    measurements: { chest: 59, length: 74, shoulder: 49, sleeve: 26 },
    fabric: "100% linen",
    condition: "A",
    flaws: "",
    price: 1750,
    images: placeholders(3),
    status: "available",
    drop: 3,
    addedAt: "2026-09-12",
  },
  {
    code: "AW-M-0066",
    section: "men",
    category: "Jackets",
    title: "Waxed cotton field jacket",
    label: "Unbranded",
    era: "1990s",
    sizes: [{ label: "XL", available: true }],
    measurements: { chest: 63, length: 76, shoulder: 52, sleeve: 66 },
    fabric: "Waxed cotton, corduroy collar, tartan lining",
    condition: "C",
    flaws: "Wax worn at the cuffs and pocket edges. Needs re-proofing. Small tear in the lining, inner left.",
    price: 4400,
    images: placeholders(4),
    status: "available",
    drop: 2,
    addedAt: "2026-07-04",
  },
  {
    code: "AW-M-0061",
    section: "men",
    category: "Accessories",
    title: "Bridle leather belt",
    label: "Corvin",
    era: "1990s",
    sizes: [{ label: "34", available: true }],
    measurements: { length: 98, width: 3 },
    fabric: "Bridle leather, solid brass buckle",
    condition: "B",
    flaws: "Creased at the third hole. Buckle has a soft patina.",
    price: 1200,
    images: placeholders(2),
    status: "available",
    drop: 2,
    addedAt: "2026-07-04",
  },
];
