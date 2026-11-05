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
      <summary className="type-label flex items-center justify-between py-3">
        {title}
        <span aria-hidden="true">
          <span className="when-closed">+</span>
          <span className="when-open">−</span>
        </span>
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}
