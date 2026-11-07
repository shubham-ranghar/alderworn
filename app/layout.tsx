import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BagDrawer } from "@/components/BagDrawer";
import { BagProvider } from "@/components/BagProvider";
import { DropListPopup } from "@/components/DropListPopup";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}. ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website", locale: "en_IN" },
};

export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <BagProvider>
          <a
            href="#main"
            className="type-label sr-only z-50 bg-ink p-3 text-paper focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
          <DropListPopup />
        </BagProvider>
      </body>
    </html>
  );
}
