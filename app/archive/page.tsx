import type { Metadata } from "next";
import { ArchiveGrid } from "@/components/ArchiveGrid";
import { Band } from "@/components/Band";
import { site } from "@/config/site";
import { soldPieces } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Archive",
  description: "Sold. Kept here so you know what you missed.",
};

export default function ArchivePage() {
  const sold = soldPieces();
  return (
    <>
      {/* Sized to its content: with the band's own 12px / 16px padding, the title and line
          sit 40px below the labels and 40px above the edge on phones, 64px from 768px.
          The piece count lives in the toolbar below. */}
      <Band
        tone="cream"
        contentClassName="relative pt-10 pb-7 text-center md:pt-16 md:pb-12"
        labels={{ tl: "Archive", tc: "Not for sale", tr: site.season }}
      >
        <h1 className="type-h1">
          Archive
        </h1>
        <p className="type-lead mx-auto mt-4 max-w-[22rem] md:max-w-none">
          Sold. Kept here so you know what you missed.
        </p>
      </Band>
      <ArchiveGrid products={sold} />
    </>
  );
}
