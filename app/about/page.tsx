import type { Metadata } from "next";
import Link from "next/link";
import { Band } from "@/components/Band";
import { StackLockup } from "@/components/Lockups";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "The House",
  description: "A house of second owners. One of each. Never restocked.",
};

const RULES = [
  ["One of each", "If you see it here, there is exactly one. There will never be another."],
  ["Measured by hand", "Laid flat, in centimetres. Tag sizes lie. A tape does not."],
  ["Every mark shown", "We photograph the flaws and write them down. Then you decide."],
  ["No restocks", "When it's sold it goes to the archive, and that is the end of it."],
];

export default function AboutPage() {
  return (
    <>
      <Band
        tone="cream"
        className="min-h-[70svh]"
        labels={{ tl: "The House", tc: "Est. 2026", tr: site.season, bl: "Second owners", br: "Alderworn" }}
      >
        <h1 className="type-mega my-10 leading-[0.86]! font-extralight!">
          <span className="block">The</span>
          <span className="block md:ml-[16.66%]">House</span>
        </h1>
      </Band>

      <section className="grid gap-y-8 px-(--gutter) pt-16 md:grid-cols-12 md:pt-28">
        <StackLockup
          roman="The"
          italic="name"
          align="left"
          caption="Old English"
          className="md:col-span-3 md:col-start-2"
        />
        <div className="type-body flex max-w-[34rem] flex-col gap-4 md:col-span-5 md:col-start-6">
          <p>
            Alder is the old word for elder. It is where alderman comes from. Worn is what it sounds
            like. Put together: clothes worn by someone before you.
          </p>
          <p>
            We sell pre-owned clothing the way a good house sells new. Pieces are chosen one at a
            time, cleaned, measured and photographed. Then they are put out in small numbered drops
            and left to find someone.
          </p>
          <p>
            We don&apos;t pretend these things are new. A soft elbow or a mended lining is the part
            you can&apos;t get anywhere else. We just tell you where it is.
          </p>
        </div>
      </section>

      {/* The one oversized pull quote: it breaks the column and runs nearly edge to edge. */}
      <blockquote className="my-20 border-y border-ink px-(--gutter) py-10 md:my-32 md:py-16">
        <p className="font-bodoni [font-variation-settings:'opsz'_48] text-[clamp(3.25rem,11vw,11rem)] leading-[0.92] tracking-[-0.02em] italic">
          Someone chose this
          <span className="block text-right">before you did.</span>
        </p>
      </blockquote>

      <section className="grid px-(--gutter) md:grid-cols-12">
        <StackLockup
          roman="House"
          italic="rules"
          align="left"
          className="mb-10 md:col-span-3 md:col-start-1"
        />
        <ol className="border-t border-ink md:col-span-7 md:col-start-6">
          {RULES.map(([title, text], i) => (
            <li
              key={title}
              className="grid grid-cols-[3rem_1fr] items-baseline border-b border-line py-5"
            >
              <span className="type-data">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="type-title">{title}</h3>
                <p className="type-body mt-2 text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="type-label mt-16 flex gap-5 px-(--gutter) md:justify-end">
        <Link href="/women" className="link-on">
          Women →
        </Link>
        <Link href="/men" className="link-on">
          Men →
        </Link>
      </p>
    </>
  );
}
