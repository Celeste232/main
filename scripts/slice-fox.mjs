#!/usr/bin/env node
/**
 * Slice the fox reference sheets into per-action PNG frames for the 'png' skin.
 *
 *   Output: src/assets/cat/<CatAction>/<n>.png   (512px square, transparent)
 *   Run:    node scripts/slice-fox.mjs
 *
 * Only 여우_01.png has a transparent background, so it slices cleanly into
 * overlay-ready sprites. The white-panel sheets (여우_02..06) can't be keyed to
 * transparent without eating the fox's white fur, so they're left for later
 * (re-export them on a transparent background to add eating/drinking/etc.).
 *
 * Each panel = title + "1 2 3" labels on top, then 3 frames in a row. We crop
 * fixed equal boxes BELOW the label band (no per-frame trim) so the fox keeps a
 * stable size/position across frames — essential for smooth animation.
 */
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'src', 'assets', 'cat');
const SRC = path.join(ROOT, 'src', 'assets', 'reference', '여우_01.png');

// 여우_01: 3 columns × 4 rows of panels on a 1536×1024 sheet → panel 512×256.
const PANEL_W = 512;
const PANEL_H = 256;
const BAND = 80;          // skip title + "1 2 3" labels at the top of each panel
const FRAME_H = 168;      // fox height below the band
const FRAME_W = 158;      // fixed width per frame (avoids neighbour bleed)
const FX = [6, 177, 348]; // left offset of frame 1/2/3 within a panel
const SIZE = 512;         // output square

// panel [col,row] → CatAction key. null = skip (prop frames: box/wall).
const MAP = [
  [0, 0, 'walking'], [1, 0, 'zoomies'],  [2, 0, 'sitting'],
  [0, 1, 'sleeping'],[1, 1, 'tail-wag'], [2, 1, 'jumping'],
  [0, 2, null],      [1, 2, null],       [2, 2, 'curious'],
  [0, 3, null],      [1, 3, null],       [2, 3, 'roll'],
];

// Reuse a sliced action's frames for other keys so more behaviours show a
// fitting fox pose instead of falling back to idle.
const ALIAS = {
  idle: 'sitting',
  napping: 'sleeping', loaf: 'sleeping', sprawl: 'sleeping',
  curl: 'sleeping', flop: 'sleeping',
  pounce: 'zoomies', happy: 'tail-wag',
};

// The sheet has an opaque near-white background (no alpha). Flood-fill it to
// transparent starting from the borders; the fox's own white fur is enclosed by
// dark outlines, so the fill can't reach it and it stays opaque.
function removeBackground(data, info) {
  const W = info.width, H = info.height, ch = 4;
  const removable = (i) =>
    data[i + 3] < 20 || (data[i] >= 228 && data[i + 1] >= 228 && data[i + 2] >= 228);
  const visited = new Uint8Array(W * H);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const p = y * W + x;
    if (!visited[p]) { visited[p] = 1; stack.push(p); }
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    const i = p * ch;
    if (!removable(i)) continue;
    data[i + 3] = 0;
    const x = p % W, y = (p / W) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
}

async function sliceAction(key, col, row) {
  const dir = path.join(OUT, key);
  await fs.mkdir(dir, { recursive: true });
  for (let f = 0; f < 3; f++) {
    const left = col * PANEL_W + FX[f];
    const top = row * PANEL_H + BAND;
    const { data, info } = await sharp(SRC)
      .extract({ left, top, width: FRAME_W, height: FRAME_H })
      .resize(SIZE, SIZE, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 255 } })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    removeBackground(data, info);
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(path.join(dir, `${f + 1}.png`));
  }
  return key;
}

async function copyFrames(fromKey, toKey) {
  const from = path.join(OUT, fromKey);
  const to = path.join(OUT, toKey);
  await fs.mkdir(to, { recursive: true });
  for (let f = 1; f <= 3; f++) {
    await fs.copyFile(path.join(from, `${f}.png`), path.join(to, `${f}.png`));
  }
}

const made = [];
for (const [col, row, key] of MAP) {
  if (!key) continue;
  made.push(await sliceAction(key, col, row));
}
for (const [toKey, fromKey] of Object.entries(ALIAS)) {
  await copyFrames(fromKey, toKey);
  made.push(`${toKey} (=${fromKey})`);
}

// Drop frames that aren't clean loop frames. 앉기 frame 3 is a back-view shot,
// which makes the idle/sitting fox keep spinning around.
const DROP = [['sitting', 3], ['idle', 3]];
for (const [key, frame] of DROP) {
  await fs.rm(path.join(OUT, key, `${frame}.png`), { force: true });
}

console.log(`sliced/aliased ${made.length} actions (dropped ${DROP.length} back-view frames):\n  ${made.join('\n  ')}`);
