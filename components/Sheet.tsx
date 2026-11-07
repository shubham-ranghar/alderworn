"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const focusables = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.getClientRects().length > 0);

/**
 * Native modal dialog: Esc and inert page come from the browser.
 * "side" slides in from the right over 200ms. "full" covers the screen, no motion.
 * "popup" is centred over a dark backdrop and fades up over 200ms.
 * `trapFocus` also keeps Tab inside, where the browser would let it reach its own toolbar.
 */
export function Sheet({
  open,
  onClose,
  label,
  labelledBy,
  id,
  trapFocus = false,
  variant = "side",
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name. Pass `labelledBy` instead to name it from a heading inside. */
  label?: string;
  labelledBy?: string;
  id?: string;
  trapFocus?: boolean;
  variant?: "side" | "full" | "popup";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      if (trapFocus && !dialog.contains(document.activeElement)) focusables(dialog)[0]?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open, trapFocus]);

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (!trapFocus || e.key !== "Tab" || !ref.current) return;
    const items = focusables(ref.current);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !ref.current.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      className={`sheet sheet-${variant}`}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {variant === "popup" ? children : <div className="flex h-full flex-col">{children}</div>}
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
  // 15px padding makes a 44px tap target; the underline still sits just under the text.
  const close = (
    <button type="button" onClick={onClose} className="type-label link py-3.75">
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
