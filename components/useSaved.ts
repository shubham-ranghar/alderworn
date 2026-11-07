"use client";

import { useSyncExternalStore } from "react";
import { findProduct } from "@/lib/catalog";

const KEY = "alderworn.saved.v1";

/** Newest first. Null until the browser has been read, so the page can tell "empty" from "not yet known". */
let codes: string[] | null = null;
const listeners = new Set<() => void>();

const read = (): string[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((c) => typeof c === "string") : [];
  } catch {
    return [];
  }
};

const getSnapshot = () => (codes ??= read());
const getServerSnapshot = () => null;

const subscribe = (listener: () => void) => {
  // Other tabs can change it too.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    codes = read();
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const toggle = (code: string) => {
  const current = getSnapshot();
  codes = current.includes(code) ? current.filter((c) => c !== code) : [code, ...current];
  try {
    localStorage.setItem(KEY, JSON.stringify(codes));
  } catch {
    /* Private window: saved pieces still work until the tab closes. */
  }
  listeners.forEach((l) => l());
};

/** Adds a piece, leaving it saved if it already was (unlike toggle). */
const save = (code: string) => {
  if (!getSnapshot().includes(code)) toggle(code);
};

/** The visitor's saved pieces, kept in this browser. No account involved. */
export function useSaved() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // A saved code can outlive its product in the catalogue.
  const products = (snapshot ?? []).flatMap((c) => findProduct(c) ?? []);
  return {
    products,
    count: products.length,
    ready: snapshot !== null,
    isSaved: (code: string) => snapshot?.includes(code) ?? false,
    toggle,
    save,
  };
}
