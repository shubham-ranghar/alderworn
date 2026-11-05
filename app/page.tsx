import Image from "next/image";
import Link from "next/link";
import { Band } from "@/components/Band";
import { DropList } from "@/components/DropList";
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
        <Image src={image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      ) : null}
      <span className={`relative flex justify-between ${align === "end" ? "order-2 mt-auto" : ""}`}>
        <span className="type-label">{word}</span>
        <span className="type-data">{pieces(count)}</span>
      </span>
      <span
        className={`relative type-mega-fit [--fit:23vw] underline-offset-[0.08em] decoration-[0.03em] group-hover:underline md:[--fit:11vw] ${align === "end" ? "order-1 mb-auto" : ""}`}
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
      {/* Hero: script use 1 of 4 */}
      <Band
        tone="cream"
        className="min-h-[calc(100svh-var(--header-h))]"
        labels={{
          tl: dropLabel(currentDrop),
          tr: <Seal className="h-[clamp(5rem,10vw,9.5rem)] w-[clamp(5rem,10vw,9.5rem)]" />,
          bl: "One of each",
          bc: <p className="type-body max-md:max-w-[9rem]">One of each. Never restocked.</p>,
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
        <ScriptLockup
          script="Previously"
          word="Owned."
          wordClass="type-mega-fit [--fit:23vw] md:[--fit:16vw] md:expanded"
          scriptStyle={{ fontSize: "1.25em", top: "-0.74em", left: "-0.03em", rotate: "-6deg" }}
          className="mt-[0.5em] ml-[-0.03em]"
        />
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
        <ProductRow products={drop} label={`Pieces from ${dropName(currentDrop)}`} />
      </section>

      {/* Manifesto: the page's one taupe feature band */}
      <section className="mt-20 bg-taupe px-(--gutter) py-3 md:mt-32 md:py-4">
        <div className="type-label flex justify-between">
          <span>The house</span>
          <span>{site.season}</span>
        </div>
        <div className="grid py-20 md:grid-cols-12 md:py-36">
          <p className="type-h2 leading-[1.08]! md:col-span-9 md:col-start-4">
            Clothes outlive their first owners. We find the ones worth keeping, clean them, measure
            them honestly, and photograph every mark. One of each.{" "}
            <em>When it&apos;s sold, it&apos;s sold.</em>
          </p>
        </div>
        <div className="type-label flex justify-between">
          <span>Manifesto</span>
          <Link href="/about" className="link">
            The House →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="grid px-(--gutter) pt-20 md:grid-cols-12 md:pt-32">
        <StackLockup
          roman="How it"
          italic="works"
          align="left"
          className="mb-10 md:col-span-3 md:mb-0"
        />
        <ol className="border-t border-ink md:col-span-8 md:col-start-5">
          {ORDER_STEPS.map((step, i) => (
            <li
              key={step}
              className="grid grid-cols-[3rem_1fr] items-baseline border-b border-line py-5 md:grid-cols-[6rem_1fr] md:py-7"
            >
              <span className="type-data">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-bodoni [font-variation-settings:'opsz'_16] text-[clamp(1.375rem,2.4vw,2.125rem)] leading-[1.1]">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Drop list */}
      <section className="grid px-(--gutter) pt-20 md:grid-cols-12 md:pt-32">
        <StackLockup
          roman="The drop"
          italic="list"
          align="left"
          className="mb-8 md:col-span-3 md:col-start-2 md:mb-0"
        />
        <DropList className="md:col-span-5 md:col-start-8" />
      </section>
    </>
  );
}
