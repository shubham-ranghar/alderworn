import type { ElementType, ReactNode } from "react";

/**
 * Two-line heading, both lines in the same style (`size`, a type role), over a small
 * caption (`captionClass`, label by default). Centred by default.
 */
export function StackLockup({
  first,
  second,
  caption,
  captionClass = "type-label",
  as: Tag = "h2",
  size = "type-h2",
  align = "center",
  className = "",
}: {
  first: ReactNode;
  second: ReactNode;
  caption?: ReactNode;
  captionClass?: string;
  as?: ElementType;
  size?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <Tag className={size}>
        <span className="block">{first}</span>
        <span className="block">{second}</span>
      </Tag>
      {caption ? <p className={`${captionClass} mt-2`}>{caption}</p> : null}
    </div>
  );
}
