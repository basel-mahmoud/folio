/**
 * Folio brand assets — a folded-page mark (dog-ear top-right corner = "folio",
 * a folded sheet) with a geometric "F". Drawn as paths/rects (no font dep) so it
 * rasterizes identically everywhere. Run from repo root: node tools/gen-icons.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const COBALT = "#5277ff";
const FOLD = "#3a56cf"; // folded-corner underside (depth)
const WHITE = "#ffffff";
const W = 1024;
const D = 300; // dog-ear size

// Geometric "F", centred, clears the folded corner.
const fRects = (color) => `
  <rect x="318" y="300" width="112" height="446" rx="18" fill="${color}"/>
  <rect x="318" y="300" width="392" height="112" rx="18" fill="${color}"/>
  <rect x="318" y="476" width="306" height="104" rx="16" fill="${color}"/>
`;

// Card silhouette with a folded top-right corner. r = corner radius (0 = square).
const cardPath = (r) =>
  r === 0
    ? `M0,0 H${W - D} L${W},${D} V${W} H0 Z`
    : `M${r},0 H${W - D} L${W},${D} V${W - r} A${r},${r} 0 0 1 ${W - r},${W} H${r} A${r},${r} 0 0 1 0,${W - r} V${r} A${r},${r} 0 0 1 ${r},0 Z`;

const flap = `<path d="M${W - D},0 L${W},${D} L${W - D},${D} Z" fill="${FOLD}"/>`;

const mark = (r) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">` +
  `<path d="${cardPath(r)}" fill="${COBALT}"/>${flap}${fRects(WHITE)}</svg>`;

// Adaptive icon pieces
const bgSolid = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}"><rect width="${W}" height="${W}" fill="${COBALT}"/></svg>`;
const fgF = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}"><g transform="translate(512 512) scale(0.6) translate(-512 -512)">${fRects(WHITE)}</g></svg>`;

async function out(source, rel, size) {
  const path = resolve(ROOT, rel);
  mkdirSync(dirname(path), { recursive: true });
  await sharp(Buffer.from(source)).resize(size, size).png().toFile(path);
  console.log("wrote", rel, `${size}px`);
}

const M = "apps/mobile/assets/images";
const Wd = "apps/web/src/app";

await out(mark(0), `${M}/icon.png`, 1024); // full-bleed (OS masks)
await out(fgF, `${M}/android-icon-foreground.png`, 1024);
await out(bgSolid, `${M}/android-icon-background.png`, 1024);
await out(fgF, `${M}/android-icon-monochrome.png`, 1024);
await out(fgF, `${M}/splash-icon.png`, 512);
await out(mark(200), `${M}/favicon.png`, 64);
await out(mark(200), `${Wd}/icon.png`, 512);
await out(mark(200), `${Wd}/apple-icon.png`, 180);

console.log("✓ brand assets generated");
