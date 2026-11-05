import type { Metadata } from "next";
import Link from "next/link";
import { ScriptLockup } from "@/components/Lockups";

export const metadata: Metadata = { title: "Gone elsewhere" };

/** Script use 4 of 4. */
export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-var(--header-h))] flex-col justify-between overflow-hidden px-(--gutter) py-3 md:py-4">
      <div className="type-label flex justify-between">
        <span>404</span>
        <span>Not on the rail</span>
      </div>
      <ScriptLockup
        script="Gone"
        word="elsewhere."
        wordClass="type-mega-fit [--fit:16vw]"
        scriptStyle={{ fontSize: "1.9em", top: "-0.82em", left: "0.1em", rotate: "-7deg" }}
        className="mt-[calc(1.67em+0.75rem)]"
      />
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
