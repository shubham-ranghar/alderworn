import type { ReactNode } from "react";

export type BandLabels = {
  tl?: ReactNode;
  tc?: ReactNode;
  tr?: ReactNode;
  bl?: ReactNode;
  bc?: ReactNode;
  br?: ReactNode;
};

/**
 * Reference-2 poster panel: colour band, one giant lockup,
 * micro labels pinned to the corners like a magazine spread.
 */
export function Band({
  tone = "cream",
  labels = {},
  className = "",
  children,
}: {
  tone?: "cream" | "taupe";
  labels?: BandLabels;
  className?: string;
  children: ReactNode;
}) {
  const bg = tone === "taupe" ? "bg-taupe" : "bg-cream";
  return (
    <section
      className={`${bg} relative flex flex-col overflow-hidden px-(--gutter) py-3 md:py-4 ${className}`}
    >
      <div className="type-label relative z-20 grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <div>{labels.tl}</div>
        <div className="text-center">{labels.tc}</div>
        <div className="flex justify-end text-right">{labels.tr}</div>
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col justify-center">{children}</div>
      <div className="relative z-20 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div className="type-label">{labels.bl}</div>
        <div className="text-center">{labels.bc}</div>
        <div className="type-label flex justify-end text-right">{labels.br}</div>
      </div>
    </section>
  );
}
