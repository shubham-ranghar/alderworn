import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="ALDERWORN, home"
      className={`font-kalnia leading-none font-semibold tracking-[0.02em] uppercase [font-stretch:112%] ${className}`}
    >
      ALDERWORN
    </Link>
  );
}
