"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";

/**
 * The /info page's "On this page" links. The section in view gets the site's underline
 * (.link with aria-current). A click scrolls smoothly, or jumps with reduced motion; the
 * sections' scroll-margin-top keeps each heading clear of the sticky rows.
 * Below 768px it is a row that scrolls sideways, sticky under the header.
 */
export function InfoNav({ items }: { items: [id: string, label: string][] }) {
  const [active, setActive] = useState(items[0]?.[0]);
  const row = useRef<HTMLUListElement>(null);
  // A clicked link stays current until the visitor scrolls again. Near the end of the page
  // the last sections can't reach the top, so the scroll position alone would pick another.
  const clicked = useRef<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (clicked.current) {
        setActive(clicked.current);
        return;
      }
      const sections = items
        .map(([id]) => document.getElementById(id))
        .filter((s): s is HTMLElement => s !== null);
      if (!sections.length) return;
      const root = document.documentElement;
      // At the very bottom the last sections can't reach the top, so the last one wins.
      if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) {
        setActive(sections[sections.length - 1].id);
        return;
      }
      // A section is current once its top passes the line under the sticky rows.
      const line = parseFloat(getComputedStyle(sections[0]).scrollMarginTop) + 8;
      let current = sections[0].id;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const release = () => {
      clicked.current = null;
    };
    const intents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    intents.forEach((t) => window.addEventListener(t, release, { passive: true }));
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      intents.forEach((t) => window.removeEventListener(t, release));
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // On a phone the current link can sit off screen. Moves the row only, never the page.
  useEffect(() => {
    const el = row.current;
    const link = el?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!el || !link || el.scrollWidth <= el.clientWidth) return;
    el.scrollTo({ left: link.offsetLeft - (el.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    clicked.current = id;
    setActive(id);
  };

  return (
    <nav
      aria-label="On this page"
      // min-w-0 lets the row scroll inside the grid instead of widening the page.
      className="min-w-0 self-start max-md:sticky max-md:top-(--header-h) max-md:z-30 max-md:-mx-(--gutter) max-md:mb-6 max-md:bg-paper md:sticky md:top-[calc(var(--header-h)+1rem)] md:col-span-3"
    >
      <ul
        ref={row}
        className="scroll-none flex border-ink max-md:h-(--info-nav-h) max-md:items-center max-md:gap-6 max-md:overflow-x-auto max-md:border-b max-md:px-(--gutter) md:flex-col md:gap-1.5 md:border-t md:pt-3"
      >
        {items.map(([id, label]) => (
          <li key={id} className="shrink-0">
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              onClick={(e) => go(e, id)}
              className="type-label link whitespace-nowrap max-md:py-[15px]"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Each question row is the button: at least 44px tall, with OPEN / CLOSE on the right. */
export function Faq({ items }: { items: [question: string, answer: string][] }) {
  const [open, setOpen] = useState<number[]>([]);
  const id = useId();

  return (
    <div className="border-t border-line">
      {items.map(([q, a], i) => {
        const isOpen = open.includes(i);
        return (
          <div key={q} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen((o) => (isOpen ? o.filter((n) => n !== i) : [...o, i]))}
                className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left"
              >
                <span>{q}</span>
                <span aria-hidden="true" className="type-label shrink-0">
                  {isOpen ? "Close" : "Open"}
                </span>
              </button>
            </h3>
            <p id={`${id}-${i}`} hidden={!isOpen} className="pb-4 text-muted">
              {a}
            </p>
          </div>
        );
      })}
    </div>
  );
}
