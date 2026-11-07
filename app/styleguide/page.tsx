import type { Metadata } from "next";
import { StackLockup } from "@/components/Lockups";
import { ProductCard } from "@/components/ProductCard";
import { Seal } from "@/components/Seal";
import { Wordmark } from "@/components/Wordmark";
import { products, type Product, type Status } from "@/data/products";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  ["--paper", "#FFFFFF", "Main background"],
  ["--cream", "#F4F5F7", "Hero bands"],
  ["--taupe", "#E4E6EA", "One feature band per page"],
  ["--ink", "#0D0D0D", "Text, rules, buttons"],
  ["--muted", "#5F6368", "Secondary text"],
  ["--line", "rgba(13,13,13,.12)", "Subtle dividers"],
  ["--seal", "#1F2A44", "The seal only"],
];

function Heading({ n, children }: { n: string; children: string }) {
  return (
    <div className="mt-24 mb-6 flex items-baseline justify-between border-t border-ink px-(--gutter) pt-2">
      <h2 className="type-label">{children}</h2>
      <span className="type-data">{n}</span>
    </div>
  );
}

export default function StyleguidePage() {
  // The catalogue may not hold a piece in every status, so one piece demonstrates all three.
  const states: Product[] = (["available", "on-hold", "sold"] as Status[]).map((status) => ({
    ...products[0],
    status,
  }));

  return (
    <div className="pb-24">
      <div className="flex items-baseline justify-between border-b border-ink px-(--gutter) py-3">
        <h1 className="type-label">ALDERWORN / Styleguide</h1>
        <p className="type-label">Not linked. Not indexed.</p>
      </div>

      {/* ---------------------------- Fonts ---------------------------- */}
      <Heading n="01">Font</Heading>
      <div className="grid gap-px px-(--gutter) md:grid-cols-3">
        {[
          ["Regular 400", "font-normal", "Everything by default, and all text 24px and larger."],
          ["Medium 500", "font-medium", "Labels and buttons. The seal."],
          ["Bold 700", "font-bold", "The logo, the bag and checkout total, SOLD / ON HOLD. Nowhere else."],
        ].map(([name, weight, use]) => (
          <div key={name} className="border-t border-line py-4">
            <p className="type-label mb-3">PP Neue Montreal {name}</p>
            <p className={`type-lead ${weight}`}>Aa Bb Cc 0123456789 ₹ →</p>
            <p className="type-body mt-3 text-muted">{use}</p>
          </div>
        ))}
      </div>
      <p className="type-body mt-4 px-(--gutter) text-muted">
        One family, three weights, no italics. Trial files: buy the web license and replace them
        before deploying.
      </p>

      <Heading n="02">Type scale</Heading>
      <div className="flex flex-col gap-6 overflow-hidden px-(--gutter)">
        {[
          ["LOGO", "BOLD 700, 20 → 24PX, UPPERCASE, 0.08EM, LH 1", <Wordmark key="logo" />],
          ["MEGA", "REGULAR, CLAMP(4REM, 20VW, 22REM), UPPERCASE, −0.03EM, LH 0.85. HERO MARQUEE", <p key="mega" className="type-mega">Owned</p>],
          ["H1", "REGULAR, CLAMP(2.75REM, 7VW, 6REM), −0.03EM, LH 0.9. PAGE TITLES, STEP NUMBERS", <p key="h1" className="type-h1">Archive</p>],
          ["H2", "REGULAR, CLAMP(2REM, 4.5VW, 4REM), −0.02EM, LH 0.95. SECTION HEADINGS", <StackLockup key="h2" first="The latest" second="Drop 004" align="left" as="p" />],
          ["TITLE", "REGULAR, 24 → 28PX, −0.01EM, LH 1.1. PRODUCT TITLES, EMPTY STATES", <p key="title" className="type-title">Cream cable-knit cardigan</p>],
          ["LEAD", "REGULAR, 18 → 20PX, LH 1.4", <p key="lead" className="type-lead">One of each. Never restocked.</p>],
          ["BODY", "REGULAR, 15PX, LH 1.55", <p key="body" className="type-body">Clothes outlive their first owners.</p>],
          ["FIELD", "REGULAR, 16PX, LH 1.4. EVERYTHING TYPED", <p key="field" className="type-field">priya@example.com</p>],
          ["LABEL", "MEDIUM 500, 12PX, UPPERCASE, 0.08EM, LH 1.35. BUTTONS AT LH 1", <p key="label" className="type-label">Women / Men / Archive</p>],
          ["DATA", "REGULAR, 12PX, TABULAR, UPPERCASE, 0.04EM, LH 1.35", <p key="data" className="type-data">AW-W-0142 / ₹2,450 / 54 CM / <span className="font-bold">SOLD</span></p>],
        ].map(([name, spec, sample]) => (
          <div key={name as string}>
            <p className="type-data mb-1 text-muted">
              {name}. {spec}
            </p>
            {sample}
          </div>
        ))}
        <p className="type-body text-muted">
          Kept sizes on a role, set with --type-size: the mobile menu links (h1), the Women / Men
          panels (mega, 56 → 144px), the footer&apos;s &ldquo;Previously owned.&rdquo; (h2, 48 →
          96px) and the 404 heading (h1, 16vw, at most 240px).
        </p>
      </div>

      <Heading n="03">Colours</Heading>
      <div className="grid grid-cols-2 gap-3 px-(--gutter) md:grid-cols-7">
        {swatches.map(([name, value, use]) => (
          <div key={name}>
            <div
              className="aspect-square border border-line"
              style={{ background: `var(${name})` }}
            />
            <p className="type-data mt-2">{name}</p>
            <p className="type-data">{value}</p>
            <p className="type-label mt-1 text-muted">{use}</p>
          </div>
        ))}
      </div>

      <Heading n="04">Buttons, links, fields</Heading>
      <div className="grid gap-4 px-(--gutter) md:grid-cols-3">
        <button type="button" className="btn">
          Add to bag
        </button>
        <a href="#" className="btn btn-quiet">
          In your bag — view bag
        </a>
        <div className="btn btn-off">Sold — see archive</div>
        <div className="flex gap-4">
          <a href="#" className="type-label link">
            Text link
          </a>
          <a href="#" aria-current="page" className="type-label link">
            Active link
          </a>
          <span className="type-label">+ / − →</span>
        </div>
        <div>
          <label htmlFor="sg-field" className="type-label">
            Labelled field
          </label>
          <input id="sg-field" className="field" placeholder="Name" />
        </div>
      </div>

      <Heading n="05">Product card states</Heading>
      <ul className="grid grid-cols-2 border-t border-line md:grid-cols-4">
        {states.map((p) => (
          <li key={p.status} className="border-r border-b border-line">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      <Heading n="06">Marks and lockups</Heading>
      <div className="flex flex-wrap items-end gap-12 px-(--gutter)">
        <Seal />
        <Seal />
        <Wordmark />
        <StackLockup first="Previously" second="owned." caption="Est. 2026" as="p" />
      </div>
    </div>
  );
}
