"use client";

import { HeartIcon } from "./Icons";
import { useSaved } from "./useSaved";

/** 44px to tap, with an 18px heart centred inside. Use `className` for placement. */
export function SaveButton({
  code,
  title,
  className = "",
}: {
  code: string;
  title: string;
  className?: string;
}) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(code);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`Save ${title}`}
      onClick={() => toggle(code)}
      className={`flex size-11 items-center justify-center text-ink ${className}`}
    >
      <HeartIcon filled={saved} />
    </button>
  );
}
