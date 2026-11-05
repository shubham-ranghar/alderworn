import type { Metadata } from "next";
import { SectionHome } from "@/components/SectionPages";

export const metadata: Metadata = { title: "Women" };

export default function WomenPage() {
  return <SectionHome section="women" />;
}
