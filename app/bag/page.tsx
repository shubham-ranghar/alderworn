import type { Metadata } from "next";
import { BagContents } from "@/components/BagContents";
import { StackLockup } from "@/components/Lockups";

export const metadata: Metadata = { title: "Bag", robots: { index: false } };

export default function BagPage() {
  return (
    <div className="grid md:grid-cols-12">
      <div className="px-(--gutter) py-12 md:col-span-5 md:py-20">
        <StackLockup as="h1" roman="Your" italic="bag" caption="Nothing is charged here" align="left" />
      </div>
      <div className="border-t border-ink md:col-span-6 md:col-start-7 md:border-t-0 md:border-l md:border-line">
        <BagContents />
      </div>
    </div>
  );
}
