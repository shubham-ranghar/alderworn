"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Native modal dialog: focus trap, Esc and inert page come from the browser.
 * "side" slides in from the right over 200ms. "full" covers the screen, no motion.
 */
export function Sheet({
  open,
  onClose,
  label,
  variant = "side",
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  variant?: "side" | "full";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={`sheet ${variant === "side" ? "sheet-side" : "sheet-full"}`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="flex h-full flex-col">{children}</div>
    </dialog>
  );
}

export function SheetBar({
  title,
  onClose,
  closeSide = "right",
}: {
  title?: ReactNode;
  onClose: () => void;
  closeSide?: "left" | "right";
}) {
  const close = (
    <button type="button" onClick={onClose} className="type-label link py-2">
      Close
    </button>
  );
  return (
    <div className="flex h-(--header-h) shrink-0 items-center justify-between border-b border-ink px-(--gutter)">
      {closeSide === "left" ? close : <div className="type-label">{title}</div>}
      {closeSide === "left" ? <div className="type-label">{title}</div> : close}
    </div>
  );
}
