import type { Metadata } from "next";
import { BagCheckout } from "@/components/BagCheckout";

export const metadata: Metadata = { title: "Bag", robots: { index: false } };

export default function BagPage() {
  return <BagCheckout />;
}
