import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Reference-1 small lockup: roman Bodoni over italic Bodoni, over a tiny tracked
 * caption. Lines almost touch. Centred by default.
 */
export function StackLockup({
  roman,
  italic,
  caption,
  as: Tag = "h2",
  size = "type-h2",
  align = "center",
  className = "",
}: {
  roman: ReactNode;
  italic: ReactNode;
  caption?: ReactNode;
  as?: ElementType;
  size?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <Tag className={`${size} leading-[0.92]!`}>
        <span className="block">{roman}</span>
        <span className="block italic">{italic}</span>
      </Tag>
      {caption ? <p className="type-label mt-2">{caption}</p> : null}
    </div>
  );
}

/**
 * Reference-1 top lockup: formal script overlapping a heavy Kalnia word.
 * Production use is limited to four places: home, women, men, 404.
 */
export function ScriptLockup({
  script,
  word,
  wordClass = "type-mega expanded",
  scriptStyle,
  className = "",
  as: Tag = "h1",
  style,
}: {
  script: string;
  word: string;
  wordClass?: string;
  /** Position in em of the word's font size. */
  scriptStyle?: CSSProperties;
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
}) {
  return (
    <Tag className={`relative block w-fit ${wordClass} ${className}`} style={style}>
      <span
        className="pointer-events-none absolute z-10 font-script font-normal whitespace-nowrap"
        style={{
          fontSize: "1em",
          fontStretch: "100%",
          lineHeight: 1,
          letterSpacing: 0,
          left: "-0.02em",
          top: "-0.62em",
          rotate: "-6deg",
          ...scriptStyle,
        }}
      >
        {script}{" "}
      </span>
      <span className="relative block">{word}</span>
    </Tag>
  );
}
