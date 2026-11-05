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
import type { Product } from "@/data/products";
import { findProduct } from "@/lib/catalog";

const KEY = "alderworn.bag.v1";

type BagContextValue = {
  items: Product[];
  count: number;
  has: (code: string) => boolean;
  add: (code: string) => void;
  remove: (code: string) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const BagContext = createContext<BagContextValue | null>(null);

const read = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((c) => typeof c === "string") : [];
  } catch {
    return [];
  }
};

const write = (codes: string[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(codes));
  } catch {
    /* Private window: the bag still works until the tab closes. */
  }
};

export function BagProvider({ children }: { children: ReactNode }) {
  const [codes, setCodes] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // localStorage only exists after hydration, and other tabs can change it.
  useEffect(() => {
    setCodes(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setCodes(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => setDrawerOpen(false), [pathname]);

  const update = useCallback((next: (prev: string[]) => string[]) => {
    setCodes((prev) => {
      const value = next(prev);
      write(value);
      return value;
    });
  }, []);

  const value = useMemo<BagContextValue>(() => {
    const items = codes.flatMap((c) => findProduct(c) ?? []);
    return {
      items,
      count: items.length,
      has: (code) => codes.includes(code),
      // One of one: a piece can only be in the bag once.
      add: (code) => update((prev) => (prev.includes(code) ? prev : [...prev, code])),
      remove: (code) => update((prev) => prev.filter((c) => c !== code)),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [codes, drawerOpen, update]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside BagProvider");
  return ctx;
}
