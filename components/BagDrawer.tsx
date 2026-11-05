"use client";

import Link from "next/link";
import { BagContents } from "./BagContents";
import { useBag } from "./BagProvider";
import { Sheet, SheetBar } from "./Sheet";

export function BagDrawer() {
  const { drawerOpen, closeDrawer, count } = useBag();
  return (
    <Sheet open={drawerOpen} onClose={closeDrawer} label="Your bag">
      <SheetBar title={`Bag (${count})`} onClose={closeDrawer} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <BagContents onNavigate={closeDrawer} />
      </div>
      {count > 0 ? (
        <div className="shrink-0 border-t border-line px-(--gutter) py-3 text-right">
          <Link href="/bag" onClick={closeDrawer} className="type-label link">
            Full bag →
          </Link>
        </div>
      ) : null}
    </Sheet>
  );
}
