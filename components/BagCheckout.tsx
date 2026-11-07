"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { holdWindow, POLICY } from "@/config/site";
import { bagMessage, whatsappUrl, type Customer } from "@/lib/bagMessage";
import { formatPrice, sizeText } from "@/lib/catalog";
import { BagLines, BagTotals, useOpenLines } from "./BagContents";

const EMPTY: Customer = { name: "", phone: "", address: "", city: "", pincode: "", note: "" };

/** Details are kept on this device so a returning customer doesn't type them again. */
const DETAILS_KEY = "alderworn.details.v1";
/** The note belongs to one order, so it isn't remembered. */
const REMEMBERED = ["name", "phone", "address", "city", "pincode"] as const;

type Field = keyof Customer;

const FIELDS: {
  key: Field;
  label: string;
  autoComplete: string;
  wide?: boolean;
  multiline?: boolean;
  type?: "text" | "tel";
  inputMode?: "text" | "tel" | "numeric";
  maxLength?: number;
  placeholder?: string;
  /** Shown inside the field, before what is typed. */
  prefix?: string;
  /** Returns an error message, or nothing when the value is fine. */
  check?: (v: string) => string | undefined;
}[] = [
  { key: "name", label: "Name", autoComplete: "name", wide: true, check: (v) => (v ? undefined : "Enter your name.") },
  {
    key: "phone",
    label: "Phone",
    autoComplete: "tel-national",
    type: "tel",
    inputMode: "tel",
    prefix: "+91",
    wide: true,
    check: (v) => (/^\d{10}$/.test(v.replace(/\s/g, "")) ? undefined : "Enter a 10-digit mobile number."),
  },
  {
    key: "address",
    label: "Full address",
    autoComplete: "street-address",
    wide: true,
    multiline: true,
    placeholder: "House no., street, area, landmark",
    check: (v) => (v ? undefined : "Enter your full address."),
  },
  { key: "city", label: "City", autoComplete: "address-level2", check: (v) => (v ? undefined : "Enter your city.") },
  {
    key: "pincode",
    label: "Pincode",
    autoComplete: "postal-code",
    inputMode: "numeric",
    maxLength: 6,
    check: (v) => (/^\d{6}$/.test(v) ? undefined : "Enter a 6-digit pincode."),
  },
  { key: "note", label: "Note (optional)", autoComplete: "off", wide: true, multiline: true },
];

type Errors = Partial<Record<Field, string>>;

const validate = (c: Customer): Errors =>
  Object.fromEntries(
    FIELDS.flatMap((f) => {
      const message = f.check?.(c[f.key].trim());
      return message ? [[f.key, message]] : [];
    }),
  );

const readDetails = (): Partial<Customer> => {
  try {
    const parsed = JSON.parse(localStorage.getItem(DETAILS_KEY) ?? "{}");
    return Object.fromEntries(REMEMBERED.flatMap((k) => (typeof parsed?.[k] === "string" ? [[k, parsed[k]]] : [])));
  } catch {
    return {};
  }
};

/** True when at least one remembered field has something in it. */
const hasDetails = (c: Partial<Customer>) => REMEMBERED.some((k) => Boolean(c[k]?.trim()));

/** Returns whether anything is now kept on this device. */
const writeDetails = (c: Customer | null): boolean => {
  try {
    if (c && hasDetails(c)) localStorage.setItem(DETAILS_KEY, JSON.stringify(Object.fromEntries(REMEMBERED.map((k) => [k, c[k]]))));
    else localStorage.removeItem(DETAILS_KEY);
    return Boolean(c && hasDetails(c));
  } catch {
    /* Private window: the form still works, it just isn't remembered. */
    return false;
  }
};

/**
 * The /bag page: the pieces, the details form and the send button.
 * From 1024px, two columns with the details sticky on the right. Below, one column with a
 * bar fixed to the bottom of the screen holding the total and the send button; it stays in
 * view over the whole page, footer included, and the page's bottom padding clears it.
 * Sending with missing or invalid fields shows the errors inline and moves to the first one.
 */
export function BagCheckout() {
  const { items, open, total } = useOpenLines();
  const [customer, setCustomer] = useState<Customer>(EMPTY);
  // Whether details are actually kept on this device; the note and Clear only show then.
  const [stored, setStored] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  // The bag and link a request was sent with. Changing the bag brings the form back.
  const [sent, setSent] = useState<{ bag: string; url: string } | null>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const formId = `${uid}-form`;

  const bagKey = open.map((l) => `${l.product.code}:${l.size.label}`).join("|");
  const confirmed = sent !== null && sent.bag === bagKey && open.length > 0;

  // localStorage only exists after hydration. Saving happens on each change (in `set`),
  // never from an effect, so the empty first render can't overwrite what was remembered.
  useEffect(() => {
    const saved = readDetails();
    setCustomer((c) => ({ ...c, ...saved }));
    setStored(hasDetails(saved));
  }, []);

  // The button that had focus is gone, so keyboard and screen reader users are moved to the message.
  useEffect(() => {
    if (confirmed) confirmRef.current?.focus();
  }, [confirmed]);

  const set = (key: Field) => (e: { target: { value: string } }) => {
    const next = { ...customer, [key]: e.target.value };
    setCustomer(next);
    setStored(writeDetails(next));
    // Once a send has failed, each field's error clears as soon as it is fixed.
    if (tried) setErrors(validate(next));
  };

  const clearDetails = () => {
    setStored(writeDetails(null));
    setCustomer(EMPTY);
    setErrors({});
    setTried(false);
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (open.length === 0) return;
    const found = validate(customer);
    setErrors(found);
    setTried(true);
    const first = FIELDS.find((f) => found[f.key]);
    if (first) {
      const el = document.getElementById(`${uid}-${first.key}`);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" });
      return;
    }
    const url = whatsappUrl(bagMessage(open, customer));
    window.open(url, "_blank", "noopener");
    setSent({ bag: bagKey, url });
  };

  if (items.length === 0) {
    return (
      <div className="px-(--gutter) py-16 md:py-24">
        <h1 className="type-title">Your bag is empty.</h1>
        <Link href="/#latest-drop" className="type-label link mt-4 inline-block py-3">
          Shop the latest drop →
        </Link>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div ref={confirmRef} tabIndex={-1} className="px-(--gutter) py-16 focus:outline-none md:py-24">
        <div role="status">
          <h1 className="type-h2">Request sent.</h1>
          <p className="type-body mt-5 max-w-[30rem]">
            We&apos;ll reply on WhatsApp with your total and UPI details. Your pieces are held for{" "}
            {holdWindow} once we confirm.
          </p>
        </div>
        <ul className="mt-8 max-w-[30rem] border-t border-line">
          {open.map(({ product: p, size }) => (
            <li
              key={`${p.code}:${size.label}`}
              className="flex items-baseline justify-between gap-4 border-b border-line py-2.5"
            >
              <span className="type-label">{p.title}</span>
              <span className="type-data shrink-0">{sizeText(size.label)}</span>
            </li>
          ))}
        </ul>
        <p className="type-label mt-8 flex flex-col items-start gap-3">
          <a href={sent.url} target="_blank" rel="noopener noreferrer" className="link-on">
            WhatsApp didn&apos;t open? Try again →
          </a>
          <button type="button" className="link uppercase" onClick={() => setSent(null)}>
            Back to bag
          </button>
        </p>
      </div>
    );
  }

  const sendButton = (className: string) => (
    <button type="submit" form={formId} disabled={open.length === 0} className={`btn disabled:btn-off ${className}`}>
      Send order on WhatsApp →
    </button>
  );

  return (
    <div>
      <h1 className="sr-only">Your bag</h1>
      <ol aria-label="Steps" className="type-label flex flex-wrap gap-x-2 border-b border-ink px-(--gutter) py-4">
        <li className="text-muted">01 Bag</li>
        <li aria-hidden="true" className="text-muted">
          ·
        </li>
        <li aria-current="step">02 Details</li>
        <li aria-hidden="true" className="text-muted">
          ·
        </li>
        <li className="text-muted">03 WhatsApp</li>
      </ol>

      {/* Below 1024px the content ends with room for the bottom bar, so the last field and
          the totals always clear it. */}
      <div className="lg:grid lg:grid-cols-12">
        <section aria-labelledby={`${uid}-bag`} className="lg:col-span-7 lg:border-r lg:border-line">
          <h2 id={`${uid}-bag`} className="type-label border-b border-line px-(--gutter) py-3">
            Bag ({items.length})
          </h2>
          <BagLines className="border-b border-line" />
        </section>

        {/* Sticky from 1024px while a long bag list scrolls past. No inner scroll, so the
            send button is always reached by scrolling the page. */}
        <section
          aria-labelledby={`${uid}-details`}
          className="p-(--gutter) pt-8 lg:sticky lg:top-(--header-h) lg:col-span-5 lg:self-start lg:pt-6"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 id={`${uid}-details`} className="type-label">
              Your details
            </h2>
            {stored ? (
              <button type="button" onClick={clearDetails} className="type-label link btn-text text-muted">
                Clear my details
              </button>
            ) : null}
          </div>
          {stored ? <p className="type-label mt-1 text-muted">Remembered on this device only.</p> : null}

          <form id={formId} noValidate onSubmit={send} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6">
            {FIELDS.map((f) => {
              const id = `${uid}-${f.key}`;
              const error = errors[f.key];
              const shared = {
                id,
                name: f.key,
                autoComplete: f.autoComplete,
                required: Boolean(f.check),
                "aria-invalid": error ? true : undefined,
                "aria-describedby": error ? `${id}-error` : undefined,
                value: customer[f.key],
                onChange: set(f.key),
                placeholder: f.placeholder,
                className: "field resize-none",
              };
              const input = (
                <input
                  {...shared}
                  type={f.type ?? "text"}
                  inputMode={f.inputMode}
                  maxLength={f.maxLength}
                  enterKeyHint="next"
                  // Room for the prefix; inline so it wins over the field's own padding.
                  style={f.prefix ? { paddingLeft: "2.25rem" } : undefined}
                />
              );
              return (
                <div key={f.key} className={f.wide ? "col-span-2" : ""}>
                  <label htmlFor={id} className="type-label mb-2 block">
                    {f.label}
                  </label>
                  {f.multiline ? (
                    <textarea {...shared} rows={2} />
                  ) : f.prefix ? (
                    <div className="relative">
                      {/* On the typed text's line: the field's 0.5rem top padding, same type. */}
                      <span aria-hidden="true" className="type-field pointer-events-none absolute top-2 left-0">
                        {f.prefix}
                      </span>
                      {input}
                    </div>
                  ) : (
                    input
                  )}
                  {error ? (
                    <p id={`${id}-error`} className="type-label mt-1.5">
                      {error}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </form>

          <BagTotals className="mt-8 border-t border-ink pt-4" />
          <p className="type-body mt-4">{POLICY.confirm}</p>
          <p className="type-label mt-4 text-muted">
            {POLICY.bag}{" "}
            <Link href={POLICY.detailsHref} className="link-on whitespace-nowrap text-ink">
              Details →
            </Link>
          </p>
          {sendButton("mt-4 max-lg:hidden")}
        </section>
      </div>

      {/* Phones and tablets: the total and the send button are fixed to the bottom of the screen
          over the whole page. The page's own bottom padding (.bag-bar in globals.css) keeps the
          last field, the footer and the rest clear of it. */}
      <div className="bag-bar fixed inset-x-0 bottom-0 z-20 flex min-h-[calc(var(--bag-bar-h)+env(safe-area-inset-bottom))] items-center gap-4 border-t border-ink bg-paper px-(--gutter) pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <p className="shrink-0">
          <span className="type-label block">Total</span>
          <span className="type-data font-bold">{formatPrice(total)}</span>
        </p>
        {sendButton("flex-1")}
      </div>
    </div>
  );
}
