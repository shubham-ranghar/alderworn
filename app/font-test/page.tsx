/**
 * TEMPORARY: compares fonts for "Previously" in the home hero and for the home
 * manifesto. Delete this folder once they are chosen. The fonts are declared here,
 * not in lib/fonts.ts, so that they load on this route only. The hero and manifesto
 * values are copied from app/page.tsx.
 */
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  Cormorant_Garamond,
  Ephesis,
  Instrument_Serif,
  Italianno,
  Newsreader,
  Petit_Formal_Script,
  Pinyon_Script,
} from "next/font/google";
import Image from "next/image";
import { Band } from "@/components/Band";
import { ScriptLockup } from "@/components/Lockups";
import { Seal } from "@/components/Seal";
import { site } from "@/config/site";

const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", display: "swap" });
const italianno = Italianno({ subsets: ["latin"], weight: "400", display: "swap" });
const ephesis = Ephesis({ subsets: ["latin"], weight: "400", display: "swap" });
const petitFormal = Petit_Formal_Script({ subsets: ["latin"], weight: "400", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: ["normal", "italic"],
  display: "swap",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Font test",
  robots: { index: false, follow: false },
};

const HERO_SCRIPT: CSSProperties = {
  fontSize: "1.25em",
  top: "-0.74em",
  left: "-0.03em",
  rotate: "-6deg",
};

const OPTIONS: { name: string; style: CSSProperties }[] = [
  { name: "Pinyon Script", style: { fontFamily: pinyon.style.fontFamily } },
  { name: "Italianno", style: { fontFamily: italianno.style.fontFamily } },
  { name: "Ephesis", style: { fontFamily: ephesis.style.fontFamily } },
  { name: "Petit Formal Script", style: { fontFamily: petitFormal.style.fontFamily } },
  {
    name: "Bodoni Moda Italic",
    style: { fontFamily: "var(--font-bodoni-face), serif", fontStyle: "italic", rotate: "0deg" },
  },
];

/** An empty style keeps the live type-h2 look, for reference. */
const MANIFESTO_OPTIONS: { name: string; style: CSSProperties }[] = [
  { name: "Bodoni Moda (current)", style: {} },
  { name: "Cormorant Garamond", style: { fontFamily: cormorant.style.fontFamily, fontWeight: 500 } },
  { name: "Instrument Serif", style: { fontFamily: instrument.style.fontFamily } },
  { name: "Newsreader", style: { fontFamily: newsreader.style.fontFamily } },
  { name: "Archivo (already on the site)", style: { fontFamily: "var(--font-archivo-face), sans-serif" } },
];

export default function FontTestPage() {
  return (
    <>
      {OPTIONS.map((option, i) => (
        <Band
          key={option.name}
          tone="cream"
          className="min-h-[calc(100svh-var(--header-h))] border-b border-ink"
          contentClassName="static"
          labels={{
            tl: `${i + 1}. ${option.name}`,
            tr: <Seal />,
            bl: "One of each",
            bc: <p className="type-body max-md:max-w-[9rem]">One of each. Never restocked.</p>,
            br: "Women / Men",
          }}
        >
          <ScriptLockup
            as="p"
            script="Previously"
            word="Owned."
            wordClass="type-mega-fit [--fit:23vw] [--fit-max:22rem] md:[--fit:16.5vw] md:expanded"
            scriptStyle={{ ...HERO_SCRIPT, ...option.style }}
            className="z-10 mt-[1.1em] mb-[50svh] ml-[-0.03em] text-paper mix-blend-difference md:mb-[47svh] lg:mt-[0.5em] lg:mb-0"
          />
          <div className="absolute inset-0">
            <Image
              src={site.homeImages.hero}
              alt=""
              fill
              sizes="100vw"
              loading="eager"
              className="object-cover object-[77%_top] md:object-[73%_top]"
            />
          </div>
        </Band>
      ))}

      {MANIFESTO_OPTIONS.map((option, i) => (
        <section
          key={option.name}
          data-manifesto
          className="border-b border-ink bg-taupe px-(--gutter) py-3 md:py-4"
        >
          <div className="type-label flex justify-between">
            <span>
              {String.fromCharCode(65 + i)}. {option.name}
            </span>
            <span>{site.season}</span>
          </div>
          <div className="grid py-20 md:grid-cols-12 md:py-36">
            <p
              className="type-h2 leading-[1.08]! md:col-span-9 md:col-start-4"
              style={option.style.fontFamily ? { fontVariationSettings: "normal", ...option.style } : undefined}
            >
              Clothes outlive their first owners. We find the ones worth keeping, clean them, measure
              them honestly, and photograph every mark. One of each.{" "}
              <em>When it&apos;s sold, it&apos;s sold.</em>
            </p>
          </div>
          <div className="type-label flex justify-between">
            <span>Manifesto</span>
            <span>The House →</span>
          </div>
        </section>
      ))}
    </>
  );
}
