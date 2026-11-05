"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { holdWindow, SHIPPING_FEE } from "@/config/site";
import { bagMessage, whatsappUrl, type BagLine, type Customer } from "@/lib/bagMessage";
import { formatPrice, pieces, productHref, statusOf } from "@/lib/catalog";
import { useBag } from "./BagProvider";
import { ProductImage } from "./ProductImage";

const EMPTY: Customer = { name: "", phone: "", address: "", city: "", pincode: "", note: "" };

/** A size that has gone since it was added is sold, whatever the rest of the product is doing. */
const lineStatus = ({ product, size }: BagLine) => (size.available ? statusOf(product) : "sold");

export function BagContents({ onNavigate }: { onNavigate?: () => void }) {
  const { items, remove } = useBag();
  const [customer, setCustomer] = useState<Customer>(EMPTY);
  // The bag and link a request was sent with. Changing the bag brings the form back.
  const [sent, setSent] = useState<{ bag: string; url: string } | null>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  // A piece can sell or go on hold after it was added. It stays visible, but it can't be requested.
  const open = items.filter((l) => lineStatus(l) === "available");
  const subtotal = open.reduce((sum, l) => sum + l.product.price, 0);
  const bagKey = open.map((l) => `${l.product.code}:${l.size.label}`).join("|");
  const confirmed = sent !== null && sent.bag === bagKey && open.length > 0;

  // The button that had focus is gone, so keyboard and screen reader users are moved to the message.
  useEffect(() => {
    if (confirmed) confirmRef.current?.focus();
  }, [confirmed]);

  if (items.length === 0) {
    return (
      <div className="px-(--gutter) py-10">
        <p className="type-title">Your bag is empty.</p>
        <p className="type-label mt-6 flex gap-5">
          <Link href="/women" className="link-on" onClick={onNavigate}>
            Women
          </Link>
          <Link href="/men" className="link-on" onClick={onNavigate}>
            Men
          </Link>
        </p>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div ref={confirmRef} tabIndex={-1} className="scroll-mt-(--header-h) px-(--gutter) py-10 focus:outline-none">
        <div role="status">
          <p className="type-h2 italic">Request sent.</p>
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
              <span className="type-data shrink-0">SIZE {size.label}</span>
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

  const set = (key: keyof Customer) => (e: { target: { value: string } }) =>
    setCustomer((c) => ({ ...c, [key]: e.target.value }));

  const sendWhatsapp = (e: FormEvent) => {
    e.preventDefault();
    const url = whatsappUrl(bagMessage(open, customer));
    window.open(url, "_blank", "noopener");
    setSent({ bag: bagKey, url });
  };

  const input = (
    key: keyof Customer,
    label: string,
    autoComplete: string,
    extra: {
      inputMode?: "tel" | "numeric";
      pattern?: string;
      title?: string;
      type?: string;
      className?: string;
    } = {},
  ) => (
    <div className={extra.className}>
      <label htmlFor={`${uid}-${key}`} className="type-label">
        {label}
      </label>
      <input
        id={`${uid}-${key}`}
        className="field"
        required
        type={extra.type ?? "text"}
        autoComplete={autoComplete}
        inputMode={extra.inputMode}
        pattern={extra.pattern}
        title={extra.title}
        value={customer[key]}
        onChange={set(key)}
      />
    </div>
  );

  return (
    <div>
      <ul>
        {items.map((line) => {
          const { product: p, size } = line;
          const status = lineStatus(line);
          const unavailable = status !== "available";
          return (
            <li
              key={`${p.code}:${size.label}`}
              className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-line p-(--gutter)"
            >
              <Link
                href={productHref(p)}
                onClick={onNavigate}
                tabIndex={-1}
                aria-hidden="true"
                className="relative block aspect-[3/4] overflow-hidden"
              >
                <ProductImage
                  src={p.images[0]}
                  code={p.code}
                  index={0}
                  alt=""
                  sizes="88px"
                  dim={status === "sold"}
                />
              </Link>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="type-data">{p.code}</p>
                <h3 className="type-label">
                  <Link href={productHref(p)} onClick={onNavigate} className="link">
                    {p.title}
                  </Link>
                </h3>
                <p className="type-data">SIZE {size.label}</p>
                <p className={`type-data ${unavailable ? "line-through" : ""}`}>
                  {formatPrice(p.price)}
                </p>
                {status === "sold" ? (
                  <p className="type-data">SOLD. NOT PART OF YOUR REQUEST.</p>
                ) : null}
                {status === "on-hold" ? (
                  <p className="type-data">ON HOLD. NOT PART OF YOUR REQUEST.</p>
                ) : null}
                <button
                  type="button"
                  onClick={() => remove(p.code, size.label)}
                  aria-label={`Remove ${p.title}, size ${size.label}`}
                  className="type-label link btn-text mt-auto w-fit pt-2"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <dl className="border-b border-ink p-(--gutter)">
        <div className="flex items-baseline justify-between">
          <dt className="type-label">Subtotal, {pieces(open.length)}</dt>
          <dd className="type-data">{formatPrice(subtotal)}</dd>
        </div>
        {open.length > 0 ? (
          <>
            <div className="mt-1.5 flex items-baseline justify-between">
              <dt className="type-label">Shipping, flat</dt>
              <dd className="type-data">{formatPrice(SHIPPING_FEE)}</dd>
            </div>
            <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
              <dt className="type-label">Total</dt>
              <dd className="type-data">{formatPrice(subtotal + SHIPPING_FEE)}</dd>
            </div>
          </>
        ) : null}
      </dl>

      <div className="p-(--gutter)">
        <p className="type-body">
          Nothing is charged on this site. Send your bag on WhatsApp. We confirm your pieces, hold
          them for {holdWindow} and send UPI details. Prepaid orders only.
        </p>

        <form onSubmit={sendWhatsapp} className="mt-8 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {input("name", "Name", "name", { className: "col-span-2" })}
            {input("phone", "Phone", "tel", {
              className: "col-span-2",
              inputMode: "tel",
              type: "tel",
              pattern: "[0-9+\\- ]{10,16}",
              title: "A phone number, at least 10 digits.",
            })}
            <div className="col-span-2">
              <label htmlFor={`${uid}-address`} className="type-label">
                Full address
              </label>
              <textarea
                id={`${uid}-address`}
                rows={2}
                required
                autoComplete="street-address"
                className="field resize-none"
                value={customer.address}
                onChange={set("address")}
              />
            </div>
            {input("city", "City", "address-level2")}
            {input("pincode", "Pincode", "postal-code", {
              inputMode: "numeric",
              pattern: "[0-9]{6}",
              title: "Six digits.",
            })}
            <div className="col-span-2">
              <label htmlFor={`${uid}-note`} className="type-label">
                Note (optional)
              </label>
              <textarea
                id={`${uid}-note`}
                rows={2}
                className="field resize-none"
                value={customer.note}
                onChange={set("note")}
              />
            </div>
          </div>

          <button type="submit" disabled={open.length === 0} className="btn disabled:btn-off">
            Send request on WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
