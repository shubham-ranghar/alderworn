import type { Metadata } from "next";
import { ArchiveGrid } from "@/components/ArchiveGrid";
import { Band } from "@/components/Band";
import { site } from "@/config/site";
import { pieces, soldPieces } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Archive",
  description: "Sold. Kept here so you know what you missed.",
};

export default function ArchivePage() {
  const sold = soldPieces();
  return (
    <>
      <Band
        tone="cream"
        className="min-h-[60svh]"
        labels={{
          tl: "Archive",
          tc: "Not for sale",
          tr: site.season,
          bl: pieces(sold.length),
          br: "Women / Men",
        }}
      >
        <h1 className="type-mega-fit my-12 font-extralight! tracking-[-0.02em]! [--fit:21vw] md:text-center md:[--fit:16vw]">
          Archive
        </h1>
        <p className="type-body -mt-8 mb-10 max-w-[22rem] md:mx-auto md:max-w-none md:text-center">
          Sold. Kept here so you know what you missed.
        </p>
      </Band>
      <ArchiveGrid products={sold} />
    </>
  );
}
