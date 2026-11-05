# ALDERWORN

Online store for pre-owned clothing. Built with Next.js (App Router), TypeScript and Tailwind CSS.
There is no payment gateway, backend or database. Customers send their bag to you on WhatsApp, you
confirm and hold the pieces, and they pay by UPI. Orders are prepaid only, with no cash on delivery.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Change the WhatsApp number and email

Open `config/site.ts` and replace every value marked `PLACEHOLDER`:

| Setting          | Format                                                     |
| ---------------- | ---------------------------------------------------------- |
| `whatsappNumber` | Country code + number, digits only: `919876543210`         |
| `email`          | Where "or send by email" requests go                       |
| `instagramUrl`   | Your full profile link                                     |
| `url`            | Your live domain                                           |

The currency symbol and number format are in the same file. `season` sets the `FW—26` corner label.

## Change the order settings

These are at the top of `config/site.ts`:

| Setting        | What it does                                                                      |
| -------------- | --------------------------------------------------------------------------------- |
| `SHIPPING_FEE` | PLACEHOLDER. Flat fee in rupees, shown in the bag, the message and the shipping text |
| `HOLD_HOURS`   | Hold time. The home steps, bag note, confirmation screen and FAQ all follow it    |
| `DISPATCH_DAYS` | Time to ship after payment. The home steps, product pages and `/info` follow it  |
| `CLAIM_HOURS`  | Window to report a mismatch after delivery. Product pages and `/info` follow it   |
| `UPI_ID`       | PLACEHOLDER. Kept for your reference. It isn't shown on the site                  |

## Handling an order

1. A request arrives on WhatsApp with the pieces, total and address.
2. Set those pieces to `"on-hold"` in `data/products.ts` and reply with the total and UPI details.
3. When the UPI payment and transaction ID check out, set them to `"sold"` and ship within `DISPATCH_DAYS`.
4. If the hold runs out unpaid, set them back to `"available"`.

Each status change goes live when you redeploy, so another customer could still request a piece until
that finishes.

## Add a product

All products live in one file: `data/products.ts`. Copy a block, paste it at the top of the list and
edit it.

```ts
{
  code: "AW-W-0148",            // AW-W-… for women, AW-M-… for men. Must be unique.
  section: "women",             // "women" or "men"
  category: "Knitwear",         // Must match a category below, exactly
  title: "Grey mohair jumper",
  label: "Unbranded",           // Brand on the tag, or "Unbranded"
  era: "1980s",
  size: "M",                    // As written on the tag
  measurements: { chest: 52, length: 60, shoulder: 44, sleeve: 56 }, // cm, laid flat
  fabric: "Mohair blend",
  condition: "B",               // A = near new, B = lightly worn, C = worn, marks noted
  flaws: "Small pull on the hem.", // Honest text. Use "" if there are none.
  price: 2600,                  // Rupees, no commas
  images: placeholders(3),      // See the next section
  status: "available",          // "available", "on-hold" or "sold"
  drop: 4,
  addedAt: "2026-11-01",        // YYYY-MM-DD
},
```

Categories:

- **Women:** Dresses, Knitwear, Coats & Jackets, Shirts & Blouses, Skirts & Trousers, Bags & Scarves
- **Men:** Shirts, Knitwear, Coats & Jackets, Tailoring, Trousers, Accessories

Measurement keys are `chest`, `length`, `shoulder`, `sleeve`, `waist`, `inseam`, `width` and `height`.
Include whichever apply.

**Selling a piece:** change `status` to `"sold"`. It moves to the Archive and can no longer be requested.
Change it to `"on-hold"` while you wait for a customer's payment. A customer who already has it in
their bag will see that it can no longer be requested.

**Starting a new drop:** use a higher `drop` number on the new pieces. The home page and its
"DROP 00X" labels follow the highest number automatically. The date shown comes from `addedAt`.

## Replace placeholder images

1. Put the photos in a folder named after the item code. Use 3:4 portrait shots:

   ```
   public/products/AW-W-0142/1.jpg
   public/products/AW-W-0142/2.jpg
   public/products/AW-W-0142/3.jpg
   ```

2. In `data/products.ts`, change that piece's images line:

   ```ts
   images: photos("AW-W-0142", 3),
   ```

Photo 1 is the main image. Photo 2 appears on hover in the grid.

For the home page Women and Men panels, add photos to `public/home/` and set `homeImages` in
`config/site.ts`, for example `women: "/home/women.jpg"`.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repository.
3. Keep the detected Next.js settings and click **Deploy**.
4. Add your domain under **Settings → Domains**, then set `url` in `config/site.ts` to match.

Every later push redeploys the site. That is how a catalogue edit goes live.

## Before going live

- Replace everything marked `PLACEHOLDER` in `config/site.ts`.
- Set your real `SHIPPING_FEE`. The site currently shows a placeholder of ₹150.
- Read the shipping and FAQ text in `app/info/page.tsx`. The tracked courier, paper packaging and
  buying question are drafts. Make them match what you actually do.
- Read the brand story in `app/about/page.tsx`.
- Replace the seed products in `data/products.ts`. They are invented examples, and their labels are
  made up.
- The drop list form only shows its confirmation message. It doesn't store addresses yet. To collect
  them, connect `components/DropList.tsx` to a mailing list service.

## Where things live

| Path                     | What it is                                                  |
| ------------------------ | ----------------------------------------------------------- |
| `config/site.ts`         | Contact details, currency, season, home images              |
| `data/products.ts`       | The catalogue                                               |
| `lib/catalog.ts`         | Categories, price format, drop logic                        |
| `lib/bagMessage.ts`      | The WhatsApp and email message format                       |
| `app/globals.css`        | Colour tokens and type styles                               |
| `/styleguide`            | Fonts, scale, colours, buttons, card states (not linked)    |

## Design rules worth keeping

- Mrs Saint Delafield appears on four pages only (home, women, men, 404), always overlapping a Kalnia
  word. `/styleguide` also shows it, for reference.
- Only the seven colour tokens. No gradients, shadows or rounded corners.
- Words instead of icons. The one permitted glyph is →.
