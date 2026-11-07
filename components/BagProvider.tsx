"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { BagLine } from "@/lib/bagMessage";
import { findProduct } from "@/lib/catalog";

const KEY = "alderworn.bag.v2";
/** Bags saved before sizes: a plain list of product codes. */
const OLD_KEY = "alderworn.bag.v1";

type Saved = { code: string; size: string };

/**
 * What the drawer shows: "added" is just the piece that was added a moment ago, "bag" is
 * everything in the bag.
 */
export type DrawerView = { view: "added"; code: string; size: string } | { view: "bag" };

type BagContextValue = {
  items: BagLine[];
  count: number;
  has: (code: string, size: string) => boolean;
  add: (code: string, size: string) => void;
  remove: (code: string, size: string) => void;
  drawerOpen: boolean;
  drawer: DrawerView | null;
  /** Opens the full bag. Takes no arguments, so it can be an onClick handler as it is. */
  openDrawer: () => void;
  /** Adds a piece and opens the drawer on it alone. */
  addAndShow: (code: string, size: string) => void;
  closeDrawer: () => void;
  /** Bumped on every add, so the "Added to bag" announcement repeats for a second piece. */
  addedAt: number;
};

const BagContext = createContext<BagContextValue | null>(null);

const isSaved = (l: unknown): l is Saved =>
  typeof (l as Saved)?.code === "string" && typeof (l as Saved)?.size === "string";

const parse = (key: string): unknown[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const read = (): Saved[] => {
  const saved = parse(KEY).filter(isSaved);
  if (saved.length > 0) return saved;
  // An old bag only says which product, so it can only carry over if that product has one size.
  return parse(OLD_KEY).flatMap((code) => {
    const sizes = typeof code === "string" ? (findProduct(code)?.sizes ?? []) : [];
    return sizes.length === 1 ? [{ code: code as string, size: sizes[0].label }] : [];
  });
};

const write = (lines: Saved[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
    localStorage.removeItem(OLD_KEY);
  } catch {
    /* Private window: the bag still works until the tab closes. */
  }
};

const same = (l: Saved, code: string, size: string) => l.code === code && l.size === size;

export function BagProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Saved[]>([]);
  const [drawer, setDrawer] = useState<DrawerView | null>(null);
  const [addedAt, setAddedAt] = useState(0);
  const pathname = usePathname();

  // localStorage only exists after hydration, and other tabs can change it.
  useEffect(() => {
    setLines(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setLines(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => setDrawer(null), [pathname]);

  const update = useCallback((next: (prev: Saved[]) => Saved[]) => {
    setLines((prev) => {
      const value = next(prev);
      write(value);
      return value;
    });
  }, []);

  const value = useMemo<BagContextValue>(() => {
    const items = lines.flatMap((l) => {
      const product = findProduct(l.code);
      const size = product?.sizes.find((s) => s.label === l.size);
      return product && size ? [{ product, size }] : [];
    });
    // Each size of a product can only be in the bag once.
    const add = (code: string, size: string) =>
      update((prev) => (prev.some((l) => same(l, code, size)) ? prev : [...prev, { code, size }]));
    return {
      items,
      count: items.length,
      has: (code, size) => lines.some((l) => same(l, code, size)),
      add,
      remove: (code, size) => update((prev) => prev.filter((l) => !same(l, code, size))),
      drawerOpen: drawer !== null,
      drawer,
      openDrawer: () => setDrawer({ view: "bag" }),
      addAndShow: (code, size) => {
        add(code, size);
        setDrawer({ view: "added", code, size });
        setAddedAt(Date.now());
      },
      closeDrawer: () => setDrawer(null),
      addedAt,
    };
  }, [lines, drawer, addedAt, update]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside BagProvider");
  return ctx;
}
