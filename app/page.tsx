import Image from "next/image";
import Link from "next/link";
import { StackLockup } from "@/components/Lockups";
import { ProductRow } from "@/components/ProductCard";
import { Seal } from "@/components/Seal";
import { ORDER_STEPS, site } from "@/config/site";
import {
  currentDrop,
  dropDate,
  dropLabel,
  dropName,
  inSection,
  latestDropPieces,
  pieces,
} from "@/lib/catalog";

/** Short titles for the home page's ORDER_STEPS, in the same order. */
const STEP_TITLES = ["Choose", "Send", "Hold", "Pay & ship"];

/**
 * The whole panel is the link. The name and count sit in the top row and the big name at
 * the bottom left; its thin underline grows on hover and keyboard focus (.link-reveal).
 */
function EntryPanel({
  href,
  word,
  tone,
  image,
  count,
}: {
  href: string;
  word: string;
  tone: "cream" | "taupe";
  image: string | null;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[50svh] flex-col justify-between overflow-hidden p-(--gutter) md:min-h-[70svh] ${tone === "cream" ? "bg-cream" : "bg-taupe"}`}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      ) : null}
      <span className="relative flex justify-between gap-4">
        <span className="type-label">{word}</span>
        <span className="type-data">{pieces(count)}</span>
      </span>
      <span className="link-reveal type-mega w-fit [--type-size:clamp(3.5rem,9vw,9rem)]">
        {word}
      </span>
    </Link>
  );
}

export default function HomePage() {
  const drop = latestDropPieces();

  return (
    <>
      {/* Just below the sticky row, at the top of the hero, and it scrolls away with the hero.
          Above page content, below the z-40 header and the search panel; the bag and menu are
          modal dialogs, so they always cover it. The paper disc keeps it legible over the dark
          hero. */}
      <Seal
        disc
        className="absolute top-[calc(var(--header-h)+0.75rem)] right-(--gutter) z-30 max-sm:h-16 max-sm:w-16 md:top-[calc(var(--header-h)+1rem)]"
      />

      {/* Hero: the name runs behind the photo in an endless loop (Hero in globals.css).
          From 640px it matches a Band: the drop label top left, the tagline bottom left and
          Women / Men bottom right, with the portrait photo and the name positioned against
          the whole section. Below 640px it is a plain stack, with the tagline and Women / Men
          in one row under the photo. */}
      <section className="hero relative isolate flex flex-col overflow-hidden bg-ink px-(--gutter) py-3 text-paper max-sm:pb-5 sm:h-[calc(100svh-var(--header-h)-var(--search-h))] md:py-4">
        <div className="type-label relative z-20 grid grid-cols-[1fr_auto_1fr] items-start gap-3">
          <div>{dropLabel(currentDrop)}</div>
        </div>
        <div className="hero-stage flex min-w-0 flex-col justify-center sm:static sm:flex-1">
          <h1 className="sr-only">
            {site.name} — {site.tagline}
          </h1>
          <div aria-hidden="true" className="hero-marquee">
            <div className="hero-marquee-track type-mega">
              {/* Four copies: each half of the track is wider than any screen, so the loop never shows a gap. */}
              {[0, 1, 2, 3].map((i) => (
                <span key={i}>{site.name}</span>
              ))}
            </div>
          </div>
          <div className="hero-photo">
            <Image
              src={site.homeImages.hero}
              alt="Model in a red satin top and grey wide-leg jeans"
              fill
              sizes="(min-width: 640px) min(30vw, 560px), 70vw"
              loading="eager"
              fetchPriority="high"
              className="object-cover object-[77%_top] sm:object-[81%_center]"
            />
          </div>
        </div>
        <div className="relative z-20 flex items-end justify-between gap-x-4 max-sm:mt-6">
          <p className="type-lead">One of each. Never restocked.</p>
          <div className="type-label shrink-0 text-right whitespace-nowrap">
            <span className="hero-tag">
              <Link href="/women" className="link">
                Women
              </Link>{" "}
              /{" "}
              <Link href="/men" className="link">
                Men
              </Link>
            </span>
          </div>
        </div>
      </section>

      {/* Split entry */}
      <div className="grid md:grid-cols-2">
        <EntryPanel
          href="/women"
          word="Women"
          tone="cream"
          image={site.homeImages.women}
          count={inSection("women").length}
        />
        <EntryPanel
          href="/men"
          word="Men"
          tone="taupe"
          image={site.homeImages.men}
          count={inSection("men").length}
        />
      </div>

      {/* Latest drop. The id is the target of the archive's empty-state link. */}
      <section id="latest-drop" className="scroll-mt-(--header-h) pt-12 md:pt-20">
        <div className="mb-10 px-(--gutter) md:mb-14">
          <StackLockup first="The latest" second={dropName(currentDrop)} align="left" />
          <p className="type-label mt-5">{dropDate(currentDrop)}</p>
        </div>
        {/* There is no page per drop, so "View all" goes to /women. */}
        <ProductRow
          products={drop}
          label={`Pieces from ${dropName(currentDrop)}`}
          carousel
          viewAllHref="/women"
        />
      </section>

      {/* How it works */}
      {/* The footer brings its own top margin, so that sets the space below. Below 640px,
          the last step's 32px plus the footer's 96px, less the 64px pulled back here, leaves
          64px. 640-767px: 32 + 96 - 48 = 80px. From 768px: 32 + 160 - 112 = 80px. */}
      <section className="px-(--gutter) pt-24 max-sm:-mb-16 sm:-mb-12 md:-mb-28">
        <div className="flex items-start justify-between">
          <StackLockup first="How it" second="works" align="left" />
          <p className="type-label">The process</p>
        </div>
        <ol className="mt-10 grid grid-cols-1 border-t border-ink min-[400px]:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {ORDER_STEPS.map((step, i) => (
            <li
              key={step}
              className="border-line pt-6 pb-8 not-first:border-t min-[400px]:even:border-l min-[400px]:even:pl-4 min-[400px]:odd:pr-4 min-[400px]:nth-[2]:border-t-0 lg:border-t-0! lg:pr-6! lg:pl-6! lg:first:pl-0! lg:last:pr-0! lg:not-first:border-l"
            >
              <span className="type-h1 ml-[-0.05em] block text-seal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="type-label mt-5">
                {STEP_TITLES[i]}
              </h3>
              <p className="type-body mt-2 max-w-[28ch] text-pretty text-ink">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
