# ALDERWORN

Online store for pre-owned clothing. Built with Next.js (App Router), TypeScript and Tailwind CSS.
There is no payment gateway, backend or database. Customers send their bag to you on WhatsApp, you
confirm and hold the pieces, and they pay by UPI. Orders are prepaid only, with no cash on delivery.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site, written to /out
npm run preview  # serve /out the way Cloudflare Pages will (run build first)
```

## Change the WhatsApp number and email

Open `config/site.ts` and replace every value marked `PLACEHOLDER`:

| Setting          | Format                                                     |
| ---------------- | ---------------------------------------------------------- |
| `whatsappNumber` | Country code + number, digits only: `919876543210`         |
| `email`          | General questions. Shown in the footer and `/info` Contact |
| `instagramUrl`   | Your full profile link                                     |
| `url`            | Your live domain                                           |
| `dropListAccessKey` | Web3Forms key that emails you each drop list signup. See below |

To get signup emails, create an access key at https://web3forms.com using the inbox that should receive
them, then paste it into `dropListAccessKey`. The key is meant for browser use and doesn't reveal your
address. Until it is set, the footer form shows an error instead of a confirmation.

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
  category: "Shirts",           // Must match a category below, exactly
  title: "Grey flannel shirt",
  label: "Unbranded",           // Brand on the tag, or "Unbranded"
  era: "1980s",
  sizes: [{ label: "M", available: true }], // As on the tag. One entry for a one-of-one piece.
                                // Several sizes: list each. A size that measures differently
                                // can add its own measurements: { ... }. With no size
                                // available, the piece counts as sold.
  measurements: { chest: 52, length: 60, shoulder: 44, sleeve: 56 }, // cm, laid flat
  fabric: "Wool flannel",
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

- **Women:** Jackets, Shirts, Trousers
- **Men:** Shirts, Jackets, Tailoring, Trousers, Accessories

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

**Resize photos before adding them.** The site has no server to shrink images, so customers download
each file exactly as you upload it. Aim for about 1600px on the long edge and under 500 KB. Phone
photos straight from the camera will make pages slow. Cloudflare also rejects any single file over
25 MiB.

The home page hero photo is `public/home/hero.jpg`. To replace it, use a landscape photo with the
subject on the right and empty space on the left for the headline.

For the home page Women and Men panels, add photos to `public/home/` and set `homeImages` in
`config/site.ts`, for example `women: "/home/women.jpg"`.

## Deploy on Cloudflare Pages

The site is a fully static export, so Cloudflare only hosts files. There is no server to run.

### First deployment

1. Push this repository to GitHub.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **Workers & Pages** and choose
   **Create application**.
3. Select the **Pages** tab, then **Import an existing Git repository**. Authorise GitHub if asked.
4. Select the repository and choose **Begin setup**.
5. Enter these build settings:

   | Setting                | Value                         |
   | ---------------------- | ----------------------------- |
   | Production branch      | `main`                        |
   | Framework preset       | Next.js (Static HTML Export)  |
   | Build command          | `npx next build`              |
   | Build output directory | `out`                         |

6. Choose **Save and Deploy**. When the build finishes, the site is live at
   `https://<your-project>.pages.dev`.

**Node version:** nothing to set. The `.node-version` file in this repository tells Cloudflare to use
Node 22. To change it, edit that file.

### Publishing changes

Every push to `main` rebuilds and redeploys the site. That is how a catalogue edit goes live. The free
plan allows 500 builds a month, one at a time.

### Add a custom domain later

1. Go to **Workers & Pages**, select the project, and open **Custom domains**.
2. Choose **Set up a domain**, enter the domain, and choose **Continue**.
3. Then follow the case that applies:
   - **Root domain (`alderworn.com`):** the domain must be added to the same Cloudflare account, with
     its nameservers pointed to Cloudflare. Cloudflare then creates the DNS record for you.
   - **Subdomain (`shop.alderworn.com`):** the domain can stay with your current DNS provider. Add a
     CNAME record from `shop` to `<your-project>.pages.dev`. If the domain is already on Cloudflare,
     the record is added for you.
4. Set `url` in `config/site.ts` to the new domain and push.

Always add the domain in the Pages dashboard first. Adding the CNAME record before that causes a 522
error.

## Before going live

- Replace everything marked `PLACEHOLDER` in `config/site.ts`.
- Set your real `SHIPPING_FEE`. The site currently shows a placeholder of ₹150.
- Read the shipping and FAQ text in `app/info/page.tsx`. The tracked courier, paper packaging and
  buying question are drafts. Make them match what you actually do.
- Replace the seed products in `data/products.ts`. They are invented examples, and their labels are
  made up.
- Set `dropListAccessKey`, then join the drop list from the live site and check the email arrives.
  Signups reach you as individual emails. There is no mailing list, so drop messages are sent by hand.

## Where things live

| Path                     | What it is                                                  |
| ------------------------ | ----------------------------------------------------------- |
| `config/site.ts`         | Contact details, currency, season, home images              |
| `data/products.ts`       | The catalogue                                               |
| `lib/catalog.ts`         | Categories, price format, drop logic                        |
| `lib/bagMessage.ts`      | The WhatsApp message format                                 |
| `app/globals.css`        | Colour tokens and type styles                               |
| `scripts/flatten-export.mjs` | Fixes a Next.js export bug on Windows. Does nothing on Linux |
| `/styleguide`            | Fonts, scale, colours, buttons, card states (not linked)    |

## Design rules worth keeping

- Mrs Saint Delafield appears on four pages only (home, women, men, 404), always overlapping a Kalnia
  word. `/styleguide` also shows it, for reference.
- Only the seven colour tokens. No gradients, shadows or rounded corners.
- Words instead of icons. The one permitted glyph is →.
