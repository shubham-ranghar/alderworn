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

type BagContextValue = {
  items: BagLine[];
  count: number;
  has: (code: string, size: string) => boolean;
  add: (code: string, size: string) => void;
  remove: (code: string, size: string) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
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
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  useEffect(() => setDrawerOpen(false), [pathname]);

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
    return {
      items,
      count: items.length,
      has: (code, size) => lines.some((l) => same(l, code, size)),
      // Each size of a product can only be in the bag once.
      add: (code, size) =>
        update((prev) => (prev.some((l) => same(l, code, size)) ? prev : [...prev, { code, size }])),
      remove: (code, size) => update((prev) => prev.filter((l) => !same(l, code, size))),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [lines, drawerOpen, update]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside BagProvider");
  return ctx;
}
