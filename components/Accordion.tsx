import type { ComponentProps, ReactNode } from "react";

export function Accordion({
  title,
  children,
  className = "",
  ...details
}: {
  title: string;
  children: ReactNode;
} & ComponentProps<"details">) {
  return (
    <details {...details} className={`border-b border-line ${className}`}>
      <summary className="type-label flex items-center justify-between gap-4 py-3">
        {title}
        {/* Like the FAQ on /info. */}
        <span aria-hidden="true" className="shrink-0">
          <span className="when-closed">Open</span>
          <span className="when-open">Close</span>
        </span>
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}
