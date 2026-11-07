import { useId } from "react";

const RING_TEXT = "ALDERWORN · HOUSE OF SECOND OWNERS · EST. 2026 ·";

/**
 * The house seal. Its size and the rotating ring of text (see .seal-ring in
 * globals.css) live here so every seal stays in sync. Use `className` for
 * placement only, never for size.
 */
export function Seal({
  className = "",
  disc = false,
}: {
  className?: string;
  /** Fills the seal with paper so it stays legible over dark sections. */
  disc?: boolean;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={`block h-[76px] w-[76px] shrink-0 md:h-[110px] md:w-[110px] ${className}`}
    >
      <circle
        cx="100"
        cy="100"
        r="98"
        fill={disc ? "var(--paper)" : "none"}
        stroke="var(--seal)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <defs>
        <path id={id} d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
      </defs>
      <g className="seal-ring">
        <text
          fill="var(--seal)"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <textPath href={`#${id}`} textLength={2 * Math.PI * 78 - 2} lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </g>
      <text
        x="100"
        y="124"
        textAnchor="middle"
        fill="var(--seal)"
        style={{
          fontFamily: "var(--font-sans)",
          // 76 of 200 units: 24px on the smallest (64px) seal.
          fontSize: 76,
          fontWeight: 500,
        }}
      >
        AW
      </text>
    </svg>
  );
}
