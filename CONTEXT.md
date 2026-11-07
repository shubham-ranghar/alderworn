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

## Home hero

A solid ink section in `app/page.tsx`, with its styles under "Hero" in `app/globals.css`. It has its own
markup rather than using `Band`, because the phone layout reorders the labels.

- "ALDERWORN" in `type-mega` (`clamp(4rem, 20vw, 22rem)`, paper colour) scrolls right to left in an
  endless loop. The track holds four copies and moves by -50% every 28 seconds, so it never shows a gap
  even on very wide screens. With reduced motion it stays still.
- The photo (`homeImages.hero`) sits centred in front of the text and starts halfway down the letters, so
  the name slides behind it.
- The page's only h1 is visually hidden: "ALDERWORN — Previously owned." The marquee copies are
  `aria-hidden`.
- The fixed seal takes a paper disc on the home page (`<Seal disc />`) so it shows over the dark hero.

**640px and up** (tablet, desktop, phone landscape): the hero fills the screen below the header and search
rows. The photo is a 4:5 portrait, `min(30vw, 560px)` wide, cropped with `object-position: 81%` so the model
is centred. It may run past the hero's bottom edge, which cuts it off. The drop label is top left, the
tagline "One of each. Never restocked." bottom left (`type-lead`, paper, no tab), and "Women / Men" bottom
right.

**Below 640px:** a plain stack, as tall as its content.

- The order is "Drop 004", then the marquee about 40px below it, then the photo, then one row with the
  tagline on the left and "Women / Men" on the right. Neither crosses the photo.
- The photo is 4:5. Its width is the smallest of 70vw, 58svh tall, and the height the other rows leave.
  The whole hero therefore fits on the first screen, down to 320×568.
- The seal shrinks to 64px so it clears the search text.

## Drop list popup

`components/DropListPopup.tsx` is mounted in `app/layout.tsx` and uses the `popup` variant of `Sheet`.
It sends signups through the footer form's `sendSignup` and `dropListAccessKey`, so it shows its error
message until the key is set. Its copy lives in `site.dropListPopup`, and its photo is `homeImages.hero`.

- It appears only on `/`, `/women` and `/men` (exact paths), after 8 seconds or 40% scroll, whichever
  comes first. It waits while any dialog is open (menu, bag, filter) or the search field has focus.
- It shows once per visit (sessionStorage). Closing it snoozes it for 14 days and joining hides it for
  good (localStorage keys `alderworn:droplist-popup-*`). Storage is read only after hydration.
- Add `?popup=1` to any URL to open it at once, ignoring those rules.
- Below 768px it is a single column without the photo, 16px from the screen edges, scrolling within
  90svh.

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

- [ ] Buy the PP Neue Montreal web license for Regular, Medium and Bold and replace the trial files before
      deploying.
- [ ] Replace the 11 sample products (2 women, 9 men). They are invented, including their brand labels,
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

## Colour theme

A cool neutral palette, defined as seven tokens in `app/globals.css`. The token names come from the earlier
warm palette and were kept so no component classes had to change.

| Token | Value | Role |
| --- | --- | --- |
| `paper` | `#ffffff` | Main background |
| `cream` | `#f4f5f7` | Secondary panels |
| `taupe` | `#e4e6ea` | Muted panels and fills |
| `ink` | `#0d0d0d` | Text, borders, buttons |
| `muted` | `#5f6368` | Secondary text, disabled states |
| `line` | `rgba(13, 13, 13, 0.12)` | Dividers, dialog backdrop |
| `seal` | `#1f2a44` | Deep navy accent for the rotating seal and the favicon |

Muted text contrast: 6.05:1 on paper, 5.55:1 on cream, 4.84:1 on taupe, so all three pass WCAG AA.
The favicon (`app/icon.svg`), the `themeColor` in `app/layout.tsx` and the `/styleguide` swatches use the
same values.

## Typography

One font family, **PP Neue Montreal** (Pangram Pangram), in three weights: Regular 400, Medium 500 and
Bold 700. No other fonts, weights or italics. It loads in `lib/fonts.ts` with `next/font/local` from
`app/fonts/neue-montreal/` (`PPNeueMontreal-Regular.woff2`, `-Medium.woff2`, `-Bold.woff2`). These are
**trial files, personal use only**: see "Before going live". CSS only refers to `--font-sans-face` (as
Tailwind's `--font-sans`), and the type roles live in `app/globals.css`.

Every piece of text uses one of these roles (`type-<role>`), and nothing else:

| Role | Weight | Size (mobile → desktop) | Case | Letter-spacing | Line-height |
| --- | --- | --- | --- | --- | --- |
| logo | Bold 700 | 20 → 24px | upper | 0.08em | 1 |
| mega | Regular 400 | `clamp(4rem, 20vw, 22rem)` | upper | -0.03em | 0.85 |
| h1 | Regular 400 | `clamp(2.75rem, 7vw, 6rem)` | normal | -0.03em | 0.9 |
| h2 | Regular 400 | `clamp(2rem, 4.5vw, 4rem)` | normal | -0.02em | 0.95 |
| title | Regular 400 | 24 → 28px | normal | -0.01em | 1.1 |
| lead | Regular 400 | 18 → 20px | normal | 0 | 1.4 |
| body | Regular 400 | 15px | normal | 0 | 1.55 |
| field | Regular 400 | 16px | normal | 0 | 1.4 |
| label | Medium 500 | 12px | upper | 0.08em | 1.35 |
| data | Regular 400 | 12px, tabular figures | upper | 0.04em | 1.35 |

Buttons (`btn`) use label at line-height 1. The desktop step (logo, title, lead) is at 768px.

Where they go:

- **logo:** the header wordmark. **mega:** the hero marquee.
- **h1:** page titles (`/women`, `/men`, categories, `/saved`, `/archive`, `/info`), the "How it works"
  step numbers (seal colour) and the mobile menu links.
- **h2:** section headings ("The latest / Drop 004", "How it works", "More from", the `/info` headings),
  "Request sent." and the drop list popup headline.
- **title:** product titles and every empty state. **lead:** the hero tagline and the `/archive` intro.
- **label:** nav, the category bar, links, buttons, form labels and errors, corner labels, card titles.
- **data:** prices, codes, sizes, counts, measurements.

Rules:

- Everything 24px and larger is Regular. Bold is only for the logo, the bag and checkout total amount, and
  the SOLD / ON HOLD status labels (`font-bold`). Only `font-normal`, `font-medium` and `font-bold` exist.
- Nothing is below 12px, except the seal's ring text (Medium, decorative).
- Two-line headings (`StackLockup`) set both lines in the same style.
- Four elements keep a size of their own on top of a role, set with `--type-size`: the mobile menu links
  (h1 at `min(14.5vw, 13svh)`), the home Women / Men panels (mega at `clamp(3.5rem, 9vw, 9rem)`), the
  footer's "Previously owned." (h2 at `clamp(3rem, 6.75vw, 6rem)`) and the 404 heading (h1 at
  `min(15rem, 16vw)`). Everything else about them comes from the role.
- `font-synthesis: none` is set on `html`, so the browser never fakes bold or italic.

## Decisions worth keeping

- **No email orders.** The address appears only in the footer and the `/info` Contact section, for general
  questions.
- **One inline drop list form per page.** The signup lives in the footer. The home page section was
  removed because it appeared directly above the footer's. The popup on home, `/women` and `/men` is the
  one exception, added on purpose.
- **Orders & Returns** is the link label for `/info`, replacing "Information" for SEO. The page heading is
  still "Information".
- **Design rules:** only the seven colour tokens, no gradients, shadows or rounded corners, and words
  instead of icons. The one permitted glyph is →.

## Known limitations

- Photos are served exactly as uploaded because there is no server to resize them. Aim for about 1600px
  and under 500 KB.
- Photo filenames must be exact, such as `1.jpg`. The live site runs on Linux, where `1.JPG` won't match.
- Home panel text over photos needs a fix when real photos are added to `homeImages`. The dark text is
  hard to read over images. An earlier fix using `mix-blend-difference` was removed with the preview
  images.
