import { SHIPPING_FEE, site } from "@/config/site";
import type { Product } from "@/data/products";
import { formatPrice } from "./catalog";

export type Customer = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  note: string;
};

export function bagMessage(items: Product[], c: Customer) {
  const subtotal = items.reduce((sum, p) => sum + p.price, 0);
  const lines = items.map((p, i) =>
    [
      `${i + 1}. ${p.code}`,
      `   ${p.title}`,
      `   Size: ${p.size}`,
      `   ${formatPrice(p.price)}`,
    ].join("\n"),
  );

  return [
    `${site.name}: bag request`,
    "",
    lines.join("\n\n"),
    "",
    `Subtotal: ${formatPrice(subtotal)} (${items.length} ${items.length === 1 ? "piece" : "pieces"})`,
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
