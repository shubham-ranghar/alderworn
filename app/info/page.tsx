import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  dispatchWindow,
  holdWindow,
  ORDER_STEPS,
  POLICY,
  SHIPPING_FEE,
  site,
} from "@/config/site";
import { formatPrice } from "@/lib/catalog";
import { Faq, InfoNav } from "@/components/InfoSections";

export const metadata: Metadata = {
  title: "Orders & Returns",
  description:
    "Orders & Returns at ALDERWORN: how ordering, payment, shipping and returns work, plus care, FAQ and contact.",
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

/*
 * 48px between sections on phones, 64px from 768px; none after the last, so the
 * footer's own top margin sets the space below Contact. scroll-margin-top keeps each
 * heading clear of the sticky header, and below 768px of the sticky link row too.
 */
function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="scroll-mt-[calc(var(--header-h)+var(--info-nav-h)+1rem)] border-t border-ink pt-3 pb-12 last:pb-0 md:scroll-mt-[calc(var(--header-h)+1rem)] md:pb-16"
    >
      <h2 className="type-h2 mb-6">
        {title}
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
      <h1 className="type-h1 px-(--gutter) py-8 text-balance md:py-12">
        Orders &amp; Returns
      </h1>

      {/* --info-nav-h: the sticky link row below 768px. The -64px from 768px takes the
          footer's 160px top margin down to 96px after Contact (phones: its 96px as is). */}
      <div className="grid px-(--gutter) [--info-nav-h:2.875rem] md:-mb-16 md:grid-cols-12">
        <InfoNav items={INDEX} />

        <div className="md:col-span-8 md:col-start-5">
          <Block id="ordering" title="How ordering works">
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

          <Block id="payment" title="Payment">
            <p>
              Prepaid only. No cash on delivery. After we confirm your request on WhatsApp, pay by
              UPI within the hold window and send the transaction ID. Your order is confirmed once
              we verify the payment. Unpaid holds are released to the next request.
            </p>
          </Block>

          <Block id="shipping" title="Shipping">
            <p>
              Tracked courier across India, at a flat {formatPrice(SHIPPING_FEE)}. Your order ships
              within {dispatchWindow} of payment. You get the tracking number on WhatsApp. Pieces go
              out folded in paper, not plastic.
            </p>
          </Block>

          <Block id="returns" title="Returns">
            {POLICY.returns.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </Block>

          <Block id="care" title="Care">
            <p>
              Wool: air it often, wash it rarely, fold it, never hang it. Silk: cold water or a good
              dry cleaner. Tailoring: a wide hanger and a brush. Waxed cotton: never the machine.
            </p>
            <p>These clothes have already lasted. Most of the work is leaving them alone.</p>
          </Block>

          <Block id="faq" title="Frequently asked">
            <Faq items={FAQ} />
          </Block>

          <Block id="contact" title="Contact">
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
              <li className="flex flex-wrap gap-x-3">
                <span>Email</span>
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
