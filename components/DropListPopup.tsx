"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { sendSignup } from "./DropList";
import { Sheet } from "./Sheet";

/** Routes the popup may appear on. Exact matches, so category and product pages are left out. */
const ROUTES = ["/", "/women", "/men"];

const DELAY_MS = 8000;
const SCROLL_SHARE = 0.4;
const SNOOZE_DAYS = 14;
const SUCCESS_CLOSE_MS = 3000;

const KEY_DISMISSED = "alderworn:droplist-popup-dismissed"; // localStorage: time it was closed
const KEY_JOINED = "alderworn:droplist-popup-joined"; // localStorage: never show again
const KEY_SEEN = "alderworn:droplist-popup-seen"; // sessionStorage: once per visit

function read(storage: () => Storage, key: string) {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

function write(storage: () => Storage, key: string, value: string) {
  try {
    storage().setItem(key, value);
  } catch {
    /* Private mode or blocked storage: the popup simply shows again next time. */
  }
}

const local = () => window.localStorage;
const session = () => window.sessionStorage;

function allowedByStorage() {
  if (read(local, KEY_JOINED)) return false;
  if (read(session, KEY_SEEN)) return false;
  const dismissed = Number(read(local, KEY_DISMISSED));
  return !dismissed || Date.now() - dismissed > SNOOZE_DAYS * 24 * 60 * 60 * 1000;
}

/** The menu, bag and filter are dialogs; search is open while its field has focus. */
function somethingElseOpen() {
  return (
    document.querySelector("dialog[open]") !== null ||
    document.activeElement?.matches('input[type="search"]') === true
  );
}

function restoreFocus(target: Element | null) {
  if (target instanceof HTMLElement && target.isConnected && target !== document.body) {
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  }
}

/**
 * Drop list signup popup. Uses the footer form's Web3Forms submit and access key.
 * Add ?popup=1 to the URL to open it straight away, ignoring the storage rules.
 */
export function DropListPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const returnFocus = useRef<Element | null>(null);
  const id = useId();
  const headingId = `${id}-heading`;

  // Storage is only read here, after hydration, so the static HTML never depends on it.
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("popup") === "1";
    if (!forced && (!ROUTES.includes(pathname) || !allowedByStorage())) return;

    let done = false;
    let retry: number | undefined;

    const show = () => {
      if (done) return;
      if (somethingElseOpen()) {
        // Wait for the menu, bag or search to close, then try again.
        window.clearTimeout(retry);
        retry = window.setTimeout(show, 1000);
        return;
      }
      done = true;
      cleanup();
      returnFocus.current = document.activeElement;
      if (!forced) write(session, KEY_SEEN, "1");
      setStatus("idle");
      setOpen(true);
    };

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= SCROLL_SHARE) show();
    };

    const timer = window.setTimeout(show, forced ? 0 : DELAY_MS);
    if (!forced) window.addEventListener("scroll", onScroll, { passive: true });

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }

    return () => {
      done = true;
      cleanup();
      window.clearTimeout(retry);
    };
  }, [pathname]);

  // Closes on its own a few seconds after a successful signup.
  useEffect(() => {
    if (status !== "done") return;
    const t = window.setTimeout(() => {
      setOpen(false);
      restoreFocus(returnFocus.current);
    }, SUCCESS_CLOSE_MS);
    return () => window.clearTimeout(t);
  }, [status]);

  /** CLOSE, Esc and a backdrop click. Snoozes the popup unless the visitor has joined. */
  function close() {
    if (!open) return;
    if (status !== "done") write(local, KEY_DISMISSED, String(Date.now()));
    setOpen(false);
    restoreFocus(returnFocus.current);
  }

  async function join(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const ok = await sendSignup(new FormData(e.currentTarget));
      if (ok) write(local, KEY_JOINED, "1");
      setStatus(ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const copy = site.dropListPopup;

  return (
    <Sheet open={open} onClose={close} labelledBy={headingId} variant="popup" trapFocus>
      <div className="relative grid md:grid-cols-[55fr_45fr]">
        <button
          type="button"
          onClick={close}
          className="type-label link absolute top-3 right-3 z-10 bg-paper px-2 py-1.5 md:top-4 md:right-4"
        >
          Close
        </button>

        <div className="flex flex-col bg-paper px-5 pt-5 pb-7 text-ink md:min-h-[32rem] md:px-10 md:pt-8 md:pb-10">
          <p className="type-label">{site.name}</p>

          <div className="mt-10 md:mt-auto">
            <h2 id={headingId} className="type-h2">
              {copy.headline}
            </h2>
            <p id={`${id}-copy`} className="type-body mt-4 max-w-[34ch] text-muted">
              {copy.subtext}
            </p>

            {status === "done" ? (
              <p role="status" className="type-body mt-8 border border-ink px-4 py-3.5">
                You&apos;re on the list.
              </p>
            ) : (
              <form onSubmit={join} className="mt-8">
                {/* Honeypot: hidden from people, so only bots tick it. */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" />
                <label htmlFor={`${id}-email`} className="sr-only">
                  Email address
                </label>
                <div className="flex border border-ink focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-ink">
                  <input
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email address"
                    aria-describedby={`${id}-copy ${id}-note${status === "error" ? ` ${id}-error` : ""}`}
                    aria-invalid={status === "error" || undefined}
                    className="type-field min-w-0 flex-1 border-0 px-4 py-3.5 outline-none placeholder:text-muted"
                  />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    aria-label={status === "sending" ? undefined : "Join the drop list"}
                    className="type-field shrink-0 px-4 transition-colors duration-250 ease-(--hover-ease) not-disabled:hover:bg-ink not-disabled:hover:text-paper disabled:text-muted"
                  >
                    {status === "sending" ? <span className="type-label">Sending…</span> : "→"}
                  </button>
                </div>
                {status === "error" && (
                  <p id={`${id}-error`} role="alert" className="type-body mt-2">
                    Something went wrong. Try again.
                  </p>
                )}
                <p id={`${id}-note`} className="type-body mt-3 text-muted">
                  {copy.note}
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="relative hidden md:block">
          <Image
            src={site.homeImages.hero}
            alt=""
            fill
            sizes="(min-width: 768px) 405px, 0px"
            className="object-cover object-[77%_top]"
          />
        </div>
      </div>
    </Sheet>
  );
}
