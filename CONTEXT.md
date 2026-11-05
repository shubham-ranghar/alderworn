# ALDERWORN: project context

Status snapshot as of 5 November 2026, at commit `8493aa7`. For how-to steps (adding products, photos,
deployment), see `README.md`. If this file and the code disagree, trust the code.

## What it is

Online store for one-of-one pre-owned clothing, presented like a luxury fashion house. Tagline:
"Previously owned." Prices are in INR.

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
- **Architecture:** fully static export to `out/`. No backend, database, auth or payment gateway.
- **Bag:** stored in the browser's `localStorage`.
- **Repository:** https://github.com/shubham-ranghar/alderworn, branch `main`. The owner pushes manually.
- **Hosting:** chosen to be Cloudflare Pages. Not confirmed as deployed yet.

## How orders work

Prepaid by UPI only, with no cash on delivery. Nothing is paid on the site. WhatsApp is the only order
route, so there is one queue and holds stay first-come, first-served.

1. The customer adds pieces to the bag and fills in the form.
2. The bag opens WhatsApp with a prefilled message: pieces, subtotal, shipping, total, address.
3. The owner confirms and holds the pieces, and sends UPI details.
4. The customer pays and sends the transaction ID. The order ships after the payment is verified.

The site cannot enforce holds. The owner sets `status` by hand in `data/products.ts` and pushes, so a
second customer can request a piece until that deploy finishes.

## Where things live

| Path | What it holds |
| --- | --- |
| `config/site.ts` | Order terms, contact details, currency, season, home panel images |
| `data/products.ts` | The whole catalogue |
| `lib/catalog.ts` | Categories, price format, drop logic |
| `lib/bagMessage.ts` | WhatsApp message format |
| `app/globals.css` | Colour tokens and type styles |
| `scripts/flatten-export.mjs` | Post-build fix for a Next.js export bug on Windows. Does nothing on Linux |

Pages: home, `/women`, `/men`, category and product pages under each section, `/bag`, `/archive`,
`/info`, the 404 page, and `/styleguide` (not linked). Search lives in the header.

## Current settings

| Setting | Value | State |
| --- | --- | --- |
| `whatsappNumber` | `917579194871` | Real |
| `HOLD_HOURS` | 2 | Set |
| `DISPATCH_DAYS` | 2 | Set |
| `CLAIM_HOURS` | 48 | Set |
| `SHIPPING_FEE` | 150 | Placeholder |
| `email` | `hello@alderworn.example` | Placeholder |
| `instagramUrl` | `https://instagram.com/alderworn` | Placeholder |
| `url` | `https://alderworn.example` | Placeholder |
| `UPI_ID` | `yourname@bank` | Placeholder, not shown on the site |
| `dropListAccessKey` | empty | Placeholder. The drop list form shows an error until it is set |

## Before going live

- [ ] Replace the 24 sample products (12 women, 12 men). They are invented, including their brand labels,
      and they use flat colour panels because there are no real photos yet. With the real WhatsApp number
      set, customers could send requests for them.
- [ ] Set the placeholder values listed above.
- [ ] Review the drafted copy in `app/info/page.tsx` (courier, paper packaging, FAQ).
- [ ] Set `dropListAccessKey` and test a footer drop list signup from the live site. Web3Forms emails each
      signup to the owner. There is no mailing list, so drop messages are sent by hand.
- [ ] Deploy on Cloudflare Pages, then check the browser console for 404s.
- [ ] Send a real test order from another phone.
- [ ] Confirm that Cloudflare's free plan terms allow commercial use.

## Testing status

Passed on commit `8493aa7`, on the static export served by Cloudflare's local Pages server, in Edge:

- 78 route checks: all pages, 404s, redirects, search, and links within the site.
- 44 browser checks: bag, form validation, WhatsApp message contents, filters, sorting, keyboard, mobile.
- Temporary real photos loading correctly. This was at the earlier commit `3ea0094`, using test images
  that have since been removed.

Not tested:

- A real message sent through WhatsApp.
- Cloudflare's actual Linux build and the live site.
- Safari, Firefox and real phones.

Last Lighthouse run, at `3ea0094` on the local preview: accessibility, best practices and SEO were 100 on
the home and product pages. Performance varied between runs, from 82 to 100, and should be measured again
on the live site.

The test scripts were kept outside the repository, so they aren't available from a fresh clone.

## Decisions worth keeping

- **No email orders.** The address appears only in the footer and the `/info` Contact section, for general
  questions.
- **One drop list form per page.** The signup lives in the footer. The home page section was removed
  because it appeared directly above the footer's.
- **Orders & Returns** is the link label for `/info`, replacing "Information" for SEO. The page heading is
  still "Information".
- **Mrs Saint Delafield** appears only on home, women, men and 404, plus `/styleguide` for reference.
- **Design rules:** only the seven colour tokens, no gradients, shadows or rounded corners, and words
  instead of icons. The one permitted glyph is →.

## Known limitations

- Photos are served exactly as uploaded because there is no server to resize them. Aim for about 1600px
  and under 500 KB.
- Photo filenames must be exact, such as `1.jpg`. The live site runs on Linux, where `1.JPG` won't match.
- Kalnia has no swash letters, so the swashes in the original typography reference can't be reproduced.
- Home panel text over photos needs a fix when real photos are added to `homeImages`. The dark text is
  hard to read over images. An earlier fix using `mix-blend-difference` was removed with the preview
  images.
