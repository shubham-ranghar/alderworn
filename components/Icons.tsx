import type { ReactNode } from "react";

/** Thin line icons: 1.5px stroke, square corners, drawn in the text colour. */
function Icon({ size = 18, className = "", children }: { size?: number; className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 18 18"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`block shrink-0 ${className}`}
    >
      {children}
    </svg>
  );
}

export function BagIcon({ className }: { className?: string }) {
  return (
    <Icon size={20} className={className}>
      <path d="M2.75 6.25h12.5v9.5H2.75zM6 6.25v-4h6v4" />
    </Icon>
  );
}

export function HeartIcon({ filled = false, className }: { filled?: boolean; className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M9 15.25L2.9 9.1a3.6 3.6 0 0 1 5.1-5.1L9 5l1-1a3.6 3.6 0 0 1 5.1 5.1L9 15.25z"
        fill={filled ? "currentColor" : "none"}
      />
    </Icon>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <circle cx="7.75" cy="7.75" r="5" />
      <path d="M11.5 11.5l4 4" />
    </Icon>
  );
}
