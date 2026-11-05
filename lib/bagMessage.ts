import { SHIPPING_FEE, site } from "@/config/site";
import type { Product, ProductSize } from "@/data/products";
import { formatPrice } from "./catalog";

/** One line in the bag: a product in one size. */
export type BagLine = { product: Product; size: ProductSize };

export type Customer = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  note: string;
};

export function bagMessage(lines: BagLine[], c: Customer) {
  const subtotal = lines.reduce((sum, l) => sum + l.product.price, 0);
  const text = lines.map(({ product: p, size }, i) =>
    [
      `${i + 1}. ${p.code}`,
      `   ${p.title}`,
      `   Size: ${size.label}`,
      `   ${formatPrice(p.price)}`,
    ].join("\n"),
  );

  return [
    `${site.name}: bag request`,
    "",
    text.join("\n\n"),
    "",
    `Subtotal: ${formatPrice(subtotal)} (${lines.length} ${lines.length === 1 ? "piece" : "pieces"})`,
    `Shipping: ${formatPrice(SHIPPING_FEE)}`,
    `Total: ${formatPrice(subtotal + SHIPPING_FEE)}`,
    "",
    `Name: ${c.name.trim()}`,
    `Phone: ${c.phone.trim()}`,
    `Address: ${c.address.trim()}`,
    `City: ${c.city.trim()}`,
    `Pincode: ${c.pincode.trim()}`,
    ...(c.note.trim() ? [`Note: ${c.note.trim()}`] : []),
  ].join("\n");
}

export const whatsappUrl = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
