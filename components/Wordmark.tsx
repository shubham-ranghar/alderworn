import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="ALDERWORN, home"
      className={`type-logo ${className}`}
    >
      ALDERWORN
    </Link>
  );
}
