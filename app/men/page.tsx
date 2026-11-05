import type { Metadata } from "next";
import { SectionHome } from "@/components/SectionPages";

export const metadata: Metadata = { title: "Men" };

export default function MenPage() {
  return <SectionHome section="men" />;
}
