import { Archivo, Bodoni_Moda, Kalnia, Mrs_Saint_Delafield } from "next/font/google";

export const kalnia = Kalnia({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-kalnia-face",
  display: "swap",
});

export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni-face",
  display: "swap",
});

export const script = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-face",
  display: "swap",
});

/* latin-ext carries the rupee sign. */
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  axes: ["wdth"],
  variable: "--font-archivo-face",
  display: "swap",
});

export const fontVariables = [kalnia, bodoni, script, archivo].map((f) => f.variable).join(" ");
