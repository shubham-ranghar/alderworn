import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  claimWindow,
  dispatchWindow,
  holdWindow,
  ORDER_STEPS,
  SHIPPING_FEE,
  site,
} from "@/config/site";
import { formatPrice } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Information",
  description: "How ordering, payment, shipping and returns work at ALDERWORN.",
};

const FAQ: [string, string][] = [
  [
    "Can you hold a piece for me?",
    `Once we confirm your request on WhatsApp, your pieces are held for ${holdWindow} while you pay. Unpaid holds are released to the next request.`,
  ],
  [
    "Will you restock this?",
    "No. Every piece is one of one.",
  ],
  [
    "How do I know it will fit?",
    "Compare the measurements with something you already own, laid flat. The tag size is only what the tag says.",
  ],
  [
    "Are the pieces cleaned?",
    "Yes, before they are photographed. Old garments can keep some memory of where they've been. If a mark didn't shift, it's written down.",
  ],
  [
    "Do you buy clothes?",
    "Sometimes. Send photos and measurements to us on WhatsApp.",
  ],
];

function Block({ id, roman, italic, children }: { id: string; roman: string; italic?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[calc(var(--header-h)+1rem)] border-t border-ink pt-3 pb-14 md:pb-24">
      <h2 className="type-h2 mb-6 leading-[0.92]!">
        {roman} {italic ? <em>{italic}</em> : null}
      </h2>
      <div className="type-body flex max-w-[36rem] flex-col gap-3">{children}</div>
    </section>
  );
}

const INDEX: [string, string][] = [
  ["ordering", "How ordering works"],
  ["payment", "Payment"],
  ["shipping", "Shipping"],
  ["returns", "Returns"],
  ["care", "Care"],
  ["faq", "FAQ"],
  ["contact", "Contact"],
];

export default function InfoPage() {
  return (
    <>
      <div className="overflow-hidden px-(--gutter) pt-10 pb-14 md:pt-16 md:pb-24">
        <h1 className="type-mega-fit font-extralight! [--fit:14.5vw]">Information</h1>
      </div>

      <div className="grid px-(--gutter) md:grid-cols-12">
        <nav
          aria-label="On this page"
          className="mb-12 self-start md:sticky md:top-[calc(var(--header-h)+1rem)] md:col-span-3 md:mb-0"
        >
          <ul className="flex flex-col gap-1.5 border-t border-ink pt-3">
            {INDEX.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="type-label link">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-8 md:col-start-5">
          <Block id="ordering" roman="How ordering" italic="works">
            <p>Nothing is bought on this site. It works the old way, by asking.</p>
            <ol className="flex flex-col gap-1">
              {ORDER_STEPS.map((step, i) => (
                <li key={step}>
                  <span className="type-data mr-3">{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p>First confirmed request gets the piece. There is only the one.</p>
          </Block>

          <Block id="payment" roman="Payment">
            <p>
              Prepaid only. No cash on delivery. After we confirm your request on WhatsApp, pay by
              UPI within the hold window and send the transaction ID. Your order is confirmed once
              we verify the payment. Unpaid holds are released to the next request.
            </p>
          </Block>

          <Block id="shipping" roman="Shipping">
            <p>
              Tracked courier across India, at a flat {formatPrice(SHIPPING_FEE)}. Your order ships
              within {dispatchWindow} of payment. You get the tracking number on WhatsApp. Pieces go
              out folded in paper, not plastic.
            </p>
          </Block>

          <Block id="returns" roman="Returns">
            <p>
              All sales are final. If a piece doesn&apos;t match its description, message us within{" "}
              {claimWindow} of delivery with an unboxing video and we&apos;ll make it right.
            </p>
          </Block>

          <Block id="care" roman="Care">
            <p>
              Wool: air it often, wash it rarely, fold it, never hang it. Silk: cold water or a good
              dry cleaner. Tailoring: a wide hanger and a brush. Waxed cotton: never the machine.
            </p>
            <p>These clothes have already lasted. Most of the work is leaving them alone.</p>
          </Block>

          <Block id="faq" roman="Frequently" italic="asked">
            <div className="border-t border-line">
              {FAQ.map(([q, a]) => (
                <details key={q} className="border-b border-line">
                  <summary className="flex items-baseline justify-between gap-4 py-3">
                    <span>{q}</span>
                    <span aria-hidden="true" className="type-label">
                      <span className="when-closed">+</span>
                      <span className="when-open">−</span>
                    </span>
                  </summary>
                  <p className="pb-4 text-muted">{a}</p>
                </details>
              ))}
            </div>
          </Block>

          <Block id="contact" roman="Contact">
            <ul className="type-label flex flex-col gap-2">
              <li>
                <a
                  href={`https://wa.me/${site.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-on"
                >
                  WhatsApp →
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-on normal-case">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-on">
                  Instagram →
                </a>
              </li>
            </ul>
          </Block>
        </div>
      </div>
    </>
  );
}
