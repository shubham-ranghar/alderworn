import Image from "next/image";
import { isPlaceholder, placeholderTone } from "@/lib/catalog";

/**
 * One product photo, or a flat placeholder panel until real photos exist.
 * Fills its positioned parent. `contain` shows the whole garment, its background
 * merging into the panel behind it.
 */
export function ProductImage({
  src,
  code,
  index,
  alt,
  sizes,
  priority = false,
  dim = false,
  contain = false,
}: {
  src: string;
  code: string;
  index: number;
  alt: string;
  sizes: string;
  priority?: boolean;
  dim?: boolean;
  contain?: boolean;
}) {
  if (isPlaceholder(src)) {
    const tone = placeholderTone(code, index);
    // A cream panel would vanish into a cream tile.
    const panel = tone === "taupe" ? "bg-taupe" : contain ? "bg-paper" : "bg-cream";
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`absolute inset-0 ${panel} ${dim ? "opacity-40" : ""}`}
      >
        <span className="type-data absolute bottom-2 left-2">{code}</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`${contain ? "object-contain mix-blend-multiply" : "object-cover"} ${dim ? "opacity-40" : ""}`}
    />
  );
}
