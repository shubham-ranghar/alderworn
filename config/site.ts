/**
 * ALDERWORN site settings. Change things here; nothing else needs touching.
 * Every value marked PLACEHOLDER must be replaced before going live.
 */

/* Order terms. Every page reads these, so a change here updates all site copy. */

/** How long pieces are held for payment once a request is confirmed. */
export const HOLD_HOURS: number = 2;

/** How soon an order ships once payment is verified. */
export const DISPATCH_DAYS: number = 2;

/** How long after delivery a customer can report a piece that doesn't match its description. */
export const CLAIM_HOURS: number = 48;

/** PLACEHOLDER: flat shipping fee in rupees, added to every bag. */
export const SHIPPING_FEE = 150;

/**
 * PLACEHOLDER: your UPI ID, kept here for reference. It is not shown on the site,
 * because UPI details are sent on WhatsApp after a request is confirmed.
 */
export const UPI_ID = "yourname@bank";

const count = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

export const holdWindow = count(HOLD_HOURS, "hour");
export const dispatchWindow = count(DISPATCH_DAYS, "day");
export const claimWindow = count(CLAIM_HOURS, "hour");

export const ORDER_STEPS = [
  "Add pieces to your bag.",
  "Send your bag to us on WhatsApp.",
  `We confirm and hold your pieces for ${holdWindow}.`,
  `Pay by UPI. Your order ships within ${dispatchWindow}.`,
];

export const site = {
  name: "ALDERWORN",
  tagline: "Previously owned.",
  description: "Pre-owned clothing. One of each. Never restocked.",
  season: "FW—26",

  /** PLACEHOLDER: your live domain, used for link previews. */
  url: "https://alderworn.example",

  currency: { code: "INR", symbol: "₹", locale: "en-IN" },

  /** PLACEHOLDER: country code + number, digits only. No +, no spaces. */
  whatsappNumber: "917579194871",

  /** PLACEHOLDER: for general questions. Orders come through WhatsApp only. */
  email: "hello@alderworn.example",

  /**
   * PLACEHOLDER: Web3Forms access key. Drop list signups are emailed to the inbox
   * the key was created for. The form shows an error until this is set.
   */
  dropListAccessKey: "" as string,

  /** PLACEHOLDER */
  instagramUrl: "https://instagram.com/alderworn",

  /**
   * Home page photos. The hero needs a landscape photo with the subject on the
   * right and empty space on the left for the headline. For the Women / Men panels,
   * leave null for a flat colour panel, or point at a photo in /public,
   * e.g. "/home/women.jpg".
   */
  homeImages: {
    hero: "/home/hero.jpg",
    women: null as string | null,
    men: null as string | null,
  },
} as const;
