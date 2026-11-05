import type { Metadata } from "next";
import { SavedPieces } from "@/components/SavedPieces";

export const metadata: Metadata = { title: "Saved", robots: { index: false } };

export default function SavedPage() {
  return <SavedPieces />;
}
