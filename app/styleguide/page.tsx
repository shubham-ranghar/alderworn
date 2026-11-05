import type { Metadata } from "next";
import { Band } from "@/components/Band";
import { ScriptLockup, StackLockup } from "@/components/Lockups";
import { ProductCard } from "@/components/ProductCard";
import { Seal } from "@/components/Seal";
import { Wordmark } from "@/components/Wordmark";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  ["--paper", "#F4F1EC", "Main background"],
  ["--cream", "#EFE8DE", "Hero bands"],
  ["--taupe", "#D4CBBF", "One feature band per page"],
  ["--ink", "#0D0D0D", "Text, rules, buttons"],
  ["--muted", "#6E6860", "Secondary text"],
  ["--line", "rgba(13,13,13,.15)", "Subtle dividers"],
  ["--seal", "#8F7A63", "The seal only"],
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
  const available = products.find((p) => p.status === "available")!;
  const hold = products.find((p) => p.status === "on-hold")!;
  const sold = products.find((p) => p.status === "sold")!;

  return (
    <div className="pb-24">
      <div className="flex items-baseline justify-between border-b border-ink px-(--gutter) py-3">
        <h1 className="type-label">ALDERWORN / Styleguide</h1>
        <p className="type-label">Not linked. Not indexed.</p>
      </div>

      {/* ------------------------- Reference 1 ------------------------- */}
      <Heading n="R1">Reference 1: script over serif, stacked lockups</Heading>
      <div className="relative overflow-hidden px-(--gutter)">
        <p className="type-label absolute top-[9%] right-(--gutter) text-right">
          Free
          <br />
          Font
          <br />
          Pairings
        </p>
        <div className="pt-[max(8rem,15vw)]">
          <ScriptLockup
            as="div"
            script="Old"
            word="Money"
            wordClass="type-mega-fit"
            scriptStyle={{ fontSize: "1.9em", top: "-0.76em", left: "0.12em", rotate: "-7deg" }}
          />
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-14">
          {/* roman serif over italic serif over tiny tracked sans */}
          <div className="text-center">
            <div className="font-bodoni text-[clamp(1.75rem,4vw,3.25rem)] leading-[0.92]">
              <span className="block">The</span>
              <span className="block italic">Seasons</span>
            </div>
            <p className="type-label mt-2 tracking-[0.3em]!">Fall edition</p>
          </div>
          {/* italic didone over roman capitals over small sans capitals */}
          <div className="text-center">
            <div className="font-bodoni text-[clamp(1.75rem,4vw,3.25rem)] leading-[0.92]">
              <span className="block italic">Second</span>
              <span className="block text-[0.72em] uppercase">Owners</span>
            </div>
            <p className="type-label mt-2">House of</p>
          </div>
          {/* tall condensed high-contrast capitals with a script across them */}
          <div className="flex justify-center pt-4">
            <div className="relative">
              <span className="font-kalnia block text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] font-extralight tracking-[-0.02em] uppercase">
                Worn
              </span>
              <span className="font-script absolute top-[-0.32em] left-[-0.1em] -rotate-6 text-[clamp(4rem,10vw,7.5rem)] leading-none">
                twice
              </span>
            </div>
          </div>
          {/* thin capitals on two lines over a small sans caption */}
          <div className="text-center">
            <div className="font-kalnia text-[clamp(1.5rem,3.5vw,2.75rem)] leading-[0.95] font-extralight tracking-[-0.01em] uppercase">
              <span className="block">One</span>
              <span className="block">of each</span>
            </div>
            <p className="type-label mt-2">Never restocked</p>
          </div>
        </div>
      </div>

      {/* ------------------------- Reference 2 ------------------------- */}
      <Heading n="R2">Reference 2: three poster panels</Heading>
      <Band
        tone="cream"
        className="min-h-[34vw]"
        labels={{
          tl: "Style",
          tc: "Pairing no. 1",
          tr: "2026",
          bl: "Heavy",
          bc: <span className="type-label">Kalnia 700</span>,
          br: "Roman",
        }}
      >
        <p className="type-mega-fit my-[3vw] text-center leading-[0.86]! [font-stretch:113%]">
          <span className="block">Quiet</span>
          <span className="block">Luxury</span>
        </p>
      </Band>
      <Band
        tone="taupe"
        className="min-h-[34vw]"
        labels={{
          tl: "Style",
          tc: "Pairing no. 2",
          tr: <Seal className="h-[clamp(4.5rem,9vw,8rem)] w-[clamp(4.5rem,9vw,8rem)]" />,
          bl: "Heavy",
          bc: <span className="type-label">Kalnia 700</span>,
          br: "Roman",
        }}
      >
        <p className="type-mega my-[1vw] text-center leading-[0.86]!">
          <span className="block">Old</span>
          <span className="block">Money</span>
        </p>
      </Band>
      <Band
        tone="cream"
        className="min-h-[34vw]"
        labels={{
          tl: "Style",
          tc: "Pairing no. 3",
          tr: "2026",
          bl: "Light",
          bc: <span className="type-label">Kalnia 200</span>,
          br: "Roman",
        }}
      >
        <p className="type-mega-fit my-[3vw] text-center leading-[0.86]! font-extralight!">
          <span className="block">Font</span>
          <span className="block">Pairings</span>
        </p>
      </Band>

      {/* ---------------------------- Fonts ---------------------------- */}
      <Heading n="01">Fonts</Heading>
      <div className="grid gap-px px-(--gutter) md:grid-cols-2">
        <div className="border-t border-line py-4">
          <p className="type-label mb-3">Kalnia. Wordmark, mega, h1. Weight 200 to 700.</p>
          <p className="font-kalnia text-[3.75rem] leading-none font-bold tracking-[-0.03em]">Previously 700</p>
          <p className="font-kalnia text-[3.75rem] leading-none font-extralight tracking-[-0.02em]">Previously 200</p>
          <p className="font-kalnia text-[3.75rem] leading-none font-semibold tracking-[-0.02em] [font-stretch:125%]">
            Wide 125
          </p>
        </div>
        <div className="border-t border-line py-4">
          <p className="type-label mb-3">Bodoni Moda. Lockups, h2, h3, titles, quotes.</p>
          <p className="font-bodoni text-[3.75rem] leading-none">Roman line</p>
          <p className="font-bodoni text-[3.75rem] leading-none italic">Italic line</p>
        </div>
        <div className="border-t border-line py-4">
          <p className="type-label mb-3">
            Mrs Saint Delafield. Overlap only, four uses on the live site.
          </p>
          <p className="font-script -rotate-6 text-[6rem] leading-none">Previously</p>
        </div>
        <div className="border-t border-line py-4">
          <p className="type-label mb-3">Archivo. Three styles.</p>
          <p className="type-label">Label style: Women / Men / Archive</p>
          <p className="type-data mt-2">Data style: AW-W-0142 / ₹2,450 / 54 CM</p>
          <p className="type-body mt-2">Body style: Clothes outlive their first owners.</p>
        </div>
      </div>

      <Heading n="02">Type scale</Heading>
      <div className="flex flex-col gap-6 overflow-hidden px-(--gutter)">
        <div>
          <p className="type-data mb-1">MEGA clamp(5rem, 16vw, 15rem)</p>
          <p className="type-mega">Owned.</p>
        </div>
        <div>
          <p className="type-data mb-1">H1 clamp(3rem, 8vw, 7.5rem)</p>
          <p className="type-h1">Archive</p>
        </div>
        <div>
          <p className="type-data mb-1">H2 clamp(2rem, 4.5vw, 4rem)</p>
          <p className="type-h2">The latest</p>
        </div>
        <div>
          <p className="type-data mb-1">PRODUCT TITLE 1.75rem</p>
          <p className="type-title">Cream cable-knit cardigan</p>
        </div>
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
        {[available, hold, sold].map((p) => (
          <li key={p.code} className="border-r border-b border-line">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      <Heading n="06">Marks and lockups</Heading>
      <div className="flex flex-wrap items-end gap-12 px-(--gutter)">
        <Seal className="h-48 w-48" />
        <Seal className="h-24 w-24" />
        <Wordmark className="text-3xl" />
        <StackLockup roman="Previously" italic="owned." caption="Est. 2026" as="p" />
      </div>
    </div>
  );
}
