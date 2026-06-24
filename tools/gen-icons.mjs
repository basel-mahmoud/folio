/**
 * Generates the Folio brand assets from inline SVG (no font dependency — the "F"
 * is drawn as rectangles so it rasterizes identically everywhere).
 * Run from repo root: node tools/gen-icons.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const COBALT = "#5277ff";
const WHITE = "#ffffff";

// Folio "F" — geometric, drawn as rects, centered in a 1024 canvas.
const fRects = (color) => `
  <rect x="320" y="290" width="108" height="444" rx="16" fill="${color}"/>
  <rect x="320" y="290" width="400" height="108" rx="16" fill="${color}"/>
  <rect x="320" y="468" width="312" height="100" rx="14" fill="${color}"/>
`;

const svg = (inner, rounded = false) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${inner}</svg>`;

// Full-bleed mark (OS masks corners on device).
const markFull = svg(`<rect width="1024" height="1024" fill="${COBALT}"/>${fRects(WHITE)}`);
// Rounded mark for standalone web favicon / apple icon.
const markRounded = svg(`<rect width="1024" height="1024" rx="228" fill="${COBALT}"/>${fRects(WHITE)}`);
// Solid background for the Android adaptive icon.
const bgSolid = svg(`<rect width="1024" height="1024" fill="${COBALT}"/>`);
// White "F" sized into the adaptive safe zone (transparent background).
const fgF = svg(`<g transform="translate(512 512) scale(0.62) translate(-512 -512)">${fRects(WHITE)}</g>`);

async function out(source, rel, size) {
  const path = resolve(ROOT, rel);
  mkdirSync(dirname(path), { recursive: true });
  await sharp(Buffer.from(source)).resize(size, size).png().toFile(path);
  console.log("wrote", rel, `${size}px`);
}

const M = "apps/mobile/assets/images";
const W = "apps/web/src/app";

await out(markFull, `${M}/icon.png`, 1024);
await out(fgF, `${M}/android-icon-foreground.png`, 1024);
await out(bgSolid, `${M}/android-icon-background.png`, 1024);
await out(fgF, `${M}/android-icon-monochrome.png`, 1024);
await out(fgF, `${M}/splash-icon.png`, 512);
await out(markRounded, `${M}/favicon.png`, 64);
await out(markRounded, `${W}/icon.png`, 512);
await out(markRounded, `${W}/apple-icon.png`, 180);

console.log("✓ brand assets generated");
