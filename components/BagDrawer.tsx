"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BagItem, BagReview } from "./BagContents";
import { useBag } from "./BagProvider";
import { Sheet, SheetBar } from "./Sheet";

/**
 * Two views. "added" shows only the piece just added, with View bag and Continue shopping.
 * "bag" is the full bag for review, with the totals and "Continue to details" pinned to
 * the bottom (BagReview). The details form lives on /bag.
 * Focus moves to the heading whenever the drawer opens or changes view. The native dialog
 * closes on Esc and hands focus back to whatever opened it.
 */
export function BagDrawer() {
  const { drawer, drawerOpen, closeDrawer, openDrawer, count, items, addedAt } = useBag();
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  const [announcement, setAnnouncement] = useState("");

  const added =
    drawer?.view === "added"
      ? items.find((l) => l.product.code === drawer.code && l.size.label === drawer.size)
      : undefined;
  // If the added piece has gone (another tab removed it), fall back to the full bag.
  const view = added ? "added" : "bag";

  useEffect(() => {
    if (drawerOpen) heading.current?.focus();
  }, [drawerOpen, view]);

  // Set just after the drawer opens, so the live region exists before its text changes.
  useEffect(() => {
    if (!addedAt) return;
    setAnnouncement("");
    const t = window.setTimeout(() => setAnnouncement("Added to bag"), 150);
    return () => window.clearTimeout(t);
  }, [addedAt]);

  const title = (
    <h2 ref={heading} id={headingId} tabIndex={-1} className="focus:outline-none">
      {view === "added" ? "Added to your bag" : `Bag (${count})`}
    </h2>
  );

  return (
    <Sheet open={drawerOpen} onClose={closeDrawer} labelledBy={headingId}>
      <SheetBar title={title} onClose={closeDrawer} />
      <p aria-live="polite" className="sr-only">
        {view === "added" ? announcement : ""}
      </p>

      {added ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="border-b border-line">
            <BagItem line={added} onNavigate={closeDrawer} />
          </div>
          <div className="flex flex-col gap-3 p-(--gutter)">
            <button type="button" onClick={openDrawer} className="btn">
              View bag ({count}) →
            </button>
            <button type="button" onClick={closeDrawer} className="btn btn-quiet">
              Continue shopping
            </button>
          </div>
        </div>
      ) : (
        <BagReview onNavigate={closeDrawer} />
      )}
    </Sheet>
  );
}
