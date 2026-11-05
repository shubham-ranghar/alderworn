import Image from "next/image";
import { isPlaceholder, placeholderTone } from "@/lib/catalog";

/**
 * One product photo, or a flat placeholder panel until real photos exist.
 * Fills its positioned 3:4 parent.
 */
export function ProductImage({
  src,
  code,
  index,
  alt,
  sizes,
  priority = false,
  dim = false,
}: {
  src: string;
  code: string;
  index: number;
  alt: string;
  sizes: string;
  priority?: boolean;
  dim?: boolean;
}) {
  if (isPlaceholder(src)) {
    const tone = placeholderTone(code, index);
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={`absolute inset-0 ${tone === "cream" ? "bg-cream" : "bg-taupe"} ${dim ? "opacity-40" : ""}`}
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
      className={`object-cover ${dim ? "opacity-40" : ""}`}
    />
  );
}
