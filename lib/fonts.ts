/*
 * One font family for the whole site: PP Neue Montreal (Pangram Pangram), in three weights.
 * CSS only ever refers to --font-sans-face, through the type utilities in app/globals.css.
 *
 *   400 Regular: everything by default, and all text 24px and larger
 *   500 Medium:  labels and buttons (type-label), the seal
 *   700 Bold:    the logo, the bag and checkout total amount, SOLD / ON HOLD
 *
 * No italics: none are loaded, and font-synthesis: none (globals.css) stops the browser faking them.
 *
 * TEMPORARY: the font files are not in the project yet, so the site uses the fallback
 * (Helvetica Neue, then Arial) and `fontVariables` is empty. To switch Neue Montreal on:
 *   1. Put the three files in app/fonts/neue-montreal/ under the names below (if they are
 *      .otf, change the extensions in the paths to match).
 *   2. Delete the `export const fontVariables = "";` line and uncomment the block below it.
 *
 * The trial files are for personal use and local testing only. Buy the web license for these
 * three weights and replace them before deploying.
 */
export const fontVariables = "";

// import localFont from "next/font/local";
//
// export const sans = localFont({
//   src: [
//     { path: "../app/fonts/neue-montreal/PPNeueMontreal-Regular.woff2", weight: "400", style: "normal" },
//     { path: "../app/fonts/neue-montreal/PPNeueMontreal-Medium.woff2", weight: "500", style: "normal" },
//     { path: "../app/fonts/neue-montreal/PPNeueMontreal-Bold.woff2", weight: "700", style: "normal" },
//   ],
//   variable: "--font-sans-face",
//   display: "swap",
//   fallback: ["Helvetica Neue", "Arial", "sans-serif"],
// });
//
// export const fontVariables = sans.variable;
