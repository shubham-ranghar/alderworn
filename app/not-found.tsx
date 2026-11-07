import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Gone elsewhere" };

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-var(--header-h))] flex-col justify-between overflow-hidden px-(--gutter) py-3 md:py-4">
      <div className="type-label flex justify-between">
        <span>404</span>
        <span>Not on the rail</span>
      </div>
      {/* h1 at a size of its own: 16vw, at most 240px. */}
      <h1 className="type-h1 [--type-size:min(15rem,16vw)]">
        <span className="block">Gone</span>
        <span className="block">elsewhere.</span>
      </h1>
      <div className="grid gap-4 md:grid-cols-12 md:items-end">
        <p className="type-body md:col-span-4 md:col-start-5">This piece found a new owner.</p>
        <p className="type-label flex gap-5 md:col-span-3 md:col-start-10 md:justify-end">
          <Link href="/women" className="link-on">
            Women
          </Link>
          <Link href="/men" className="link-on">
            Men
          </Link>
        </p>
      </div>
    </div>
  );
}
