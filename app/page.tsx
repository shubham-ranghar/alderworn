import Image from "next/image";
import Link from "next/link";
import { Band } from "@/components/Band";
import { ScriptLockup, StackLockup } from "@/components/Lockups";
import { ProductRow } from "@/components/ProductCard";
import { Seal } from "@/components/Seal";
import { ORDER_STEPS, site } from "@/config/site";
import {
  currentDrop,
  dropDate,
  dropLabel,
  dropName,
  inSection,
  latestDropPieces,
  pieces,
} from "@/lib/catalog";

/** Short titles for the home page's ORDER_STEPS, in the same order. */
const STEP_TITLES = ["Choose", "Send", "Hold", "Pay & ship"];

function EntryPanel({
  href,
  word,
  tone,
  image,
  count,
  align,
}: {
  href: string;
  word: string;
  tone: "cream" | "taupe";
  image: string | null;
  count: number;
  align: "start" | "end";
}) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[72svh] flex-col overflow-hidden p-(--gutter) md:min-h-svh ${tone === "cream" ? "bg-cream" : "bg-taupe"} ${align === "end" ? "justify-end" : "justify-between"}`}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      ) : null}
      <span
        className={`relative flex justify-between ${align === "end" ? "order-2 mt-auto" : ""}`}
      >
        <span className="type-label">{word}</span>
        <span className="type-data">{pieces(count)}</span>
      </span>
      <span
        className={`link-reveal w-fit type-mega-fit [--fit:23vw] [--link-offset:-0.08em] [--link-thickness:0.03em] md:[--fit:11vw] ${align === "end" ? "order-1 mb-auto" : ""}`}
      >
        {word}
      </span>
    </Link>
  );
}

export default function HomePage() {
  const drop = latestDropPieces();

  return (
    <>
      {/* Just below the sticky row. Above page content, below the z-40 header and the search
          panel; the bag and menu are modal dialogs, so they always cover it. */}
      <Seal className="fixed top-[calc(var(--header-h)+0.75rem)] right-(--gutter) z-30 md:top-[calc(var(--header-h)+1rem)]" />

      {/* Hero: script use 1 of 2 */}
      <Band
        tone="cream"
        className="min-h-[calc(100svh-var(--header-h)-var(--search-h))]"
        contentClassName="static"
        labels={{
          tl: dropLabel(currentDrop),
          /* Holds the row's height for the fixed seal below, so the headline stays put. */
          tr: <Seal className="invisible" />,
          bl: "One of each",
          bc: (
            <p className="type-body max-md:max-w-[9rem]">
              One of each. Never restocked.
            </p>
          ),
          br: (
            <span>
              <Link href="/women" className="link">
                Women
              </Link>{" "}
              /{" "}
              <Link href="/men" className="link">
                Men
              </Link>
            </span>
          ),
        }}
      >
        {/* Desktop margins reserve the script's height (1.01em) on short windows. Their
            difference stays 0.5em, so the word sits where it did whenever there is room. */}
        <ScriptLockup
          script="Previously"
          word="Owned."
          wordClass="type-mega-fit [--fit:23vw] [--fit-max:22rem] md:[--fit:16.5vw] md:expanded"
          scriptStyle={{
            fontFamily: "var(--font-bodoni-face), serif",
            fontStyle: "italic",
            fontSize: "0.7em",
            fontWeight: 500,
            fontVariationSettings: '"opsz" 11',
            top: "-0.82em",
            left: "calc(7vw - var(--gutter))",
            rotate: "0deg",
          }}
          className="z-10 mt-[1.1em] mb-[calc(50svh-var(--search-h))] ml-[-0.01em] text-paper mix-blend-difference md:mb-[calc(47svh-var(--search-h))] lg:mt-[calc(1.01em+0.75rem-95px)] lg:mb-[calc(0.51em+0.75rem-95px)]"
        />
        <div className="absolute inset-0">
          <Image
            src={site.homeImages.hero}
            alt="Model in a red satin top and grey wide-leg jeans"
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover object-[77%_top] md:object-[73%_top]"
          />
        </div>
      </Band>

      {/* Split entry */}
      <div className="grid md:grid-cols-2">
        <EntryPanel
          href="/women"
          word="Women"
          tone="cream"
          image={site.homeImages.women}
          count={inSection("women").length}
          align="start"
        />
        <EntryPanel
          href="/men"
          word="Men"
          tone="taupe"
          image={site.homeImages.men}
          count={inSection("men").length}
          align="end"
        />
      </div>

      {/* Latest drop */}
      <section className="pt-20 md:pt-32">
        <div className="mb-10 grid px-(--gutter) md:mb-14 md:grid-cols-12">
          <StackLockup
            roman="The latest"
            italic={dropName(currentDrop)}
            caption={dropDate(currentDrop)}
            className="md:col-span-4 md:col-start-2"
          />
        </div>
        <ProductRow
          products={drop}
          label={`Pieces from ${dropName(currentDrop)}`}
        />
      </section>

      {/* How it works */}
      {/* The footer brings its own top margin, so that sets the space below: 96px on phones,
          and 160px less the 64px pulled back here on desktop. */}
      <section className="px-(--gutter) pt-24 md:-mb-16">
        <div className="flex items-start justify-between">
          <StackLockup
            roman="How it"
            italic="works"
            align="left"
            size="type-h2 text-[clamp(1.75rem,3.2vw,3rem)]!"
          />
          {/* The negative margin stops the trailing letter-space pulling it off the gutter. */}
          <p className="type-label mr-[-0.2em] tracking-[0.2em]!">
            The process
          </p>
        </div>
        <ol className="mt-10 grid grid-cols-1 border-t border-ink min-[400px]:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {ORDER_STEPS.map((step, i) => (
            <li
              key={step}
              className="border-line pt-6 pb-8 not-first:border-t min-[400px]:even:border-l min-[400px]:even:pl-4 min-[400px]:odd:pr-4 min-[400px]:nth-[2]:border-t-0 lg:border-t-0! lg:pr-6! lg:pl-6! lg:first:pl-0! lg:last:pr-0! lg:not-first:border-l"
            >
              <span className="ml-[-0.05em] block font-kalnia text-[3.5rem] font-[200] leading-[0.9] text-seal lg:text-[clamp(4rem,8vw,8rem)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-[12px] font-[500] uppercase leading-[1.35] tracking-[0.2em]">
                {STEP_TITLES[i]}
              </h3>
              <p className="mt-2 max-w-[28ch] text-[17px] leading-[1.5] text-ink text-pretty">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
