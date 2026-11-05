/**
 * Works around a Next.js static export bug on Windows.
 *
 * Next.js writes each page's prefetch data to a flat file such as
 *   out/women/__next.women.__PAGE__.txt
 * On Windows its path handling leaves backslashes in the name, so the file lands in
 *   out/women/__next.women/__PAGE__.txt
 * The browser requests the flat name, gets a 404, and logs an error for every link on the page.
 *
 * This moves those files to the flat names. Linux builds, including Cloudflare's, have no such
 * folders, so there it does nothing.
 */
import { readdir, rename, rm } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUT = "out";

async function filesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? filesIn(join(dir, e.name)) : [join(dir, e.name)])),
  );
  return nested.flat();
}

async function flatten(dir) {
  let moved = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await filesIn(path)) {
        await rename(file, join(dir, relative(dir, file).split(sep).join(".")));
        moved++;
      }
      await rm(path, { recursive: true });
    } else {
      moved += await flatten(path);
    }
  }
  return moved;
}

const moved = await flatten(OUT);
if (moved > 0) console.log(`Flattened ${moved} prefetch files in /${OUT}.`);
