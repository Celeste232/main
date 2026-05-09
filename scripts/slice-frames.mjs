#!/usr/bin/env node
/**
 * Slice reference sheets into per-action PNG frames.
 *
 *  Inputs:
 *    src/assets/reference/<sheet>.png      — one or more grid sheets
 *    src/assets/reference/layout.json      — coordinates for each frame
 *
 *  Output:
 *    src/assets/cat/<action>/<n>.png       — extracted frames
 *
 *  layout.json format
 *  ──────────────────
 *  {
 *    "outputSize": 512,
 *    "trim": true,
 *    "sheets": [
 *      {
 *        "file": "sheet-1.png",
 *        "frames": [
 *          { "action": "walking", "frame": 1, "x":   0, "y":   0, "w": 200, "h": 200 },
 *          { "action": "walking", "frame": 2, "x": 200, "y":   0, "w": 200, "h": 200 },
 *          ...
 *        ]
 *      }
 *    ]
 *  }
 *
 *  A "grid" shorthand is also supported: instead of listing every frame, give
 *  a row/col origin and let the script enumerate them.
 *
 *      { "action": "walking",
 *        "grid":   { "x":  0, "y":  0, "w": 200, "h": 200, "cols": 4, "rows": 1 } }
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REFERENCE_DIR = path.resolve(__dirname, '..', 'src', 'assets', 'reference');
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'assets', 'cat');

async function readJson(file) {
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw);
}

function expandFrames(entry) {
  if (entry.grid) {
    const { x, y, w, h, cols, rows = 1, gapX = 0, gapY = 0, startFrame = 1 } = entry.grid;
    const out = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          action: entry.action,
          frame: startFrame + r * cols + c,
          x: x + c * (w + gapX),
          y: y + r * (h + gapY),
          w,
          h,
        });
      }
    }
    return out;
  }
  if (Array.isArray(entry.frames)) return entry.frames;
  return [{ ...entry }];
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function main() {
  const layoutPath = path.join(REFERENCE_DIR, 'layout.json');
  let layout;
  try {
    layout = await readJson(layoutPath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.log(`No layout at ${layoutPath} — nothing to slice.`);
      console.log(`Drop sheet PNGs into ${REFERENCE_DIR} and create a layout.json.`);
      process.exit(0);
    }
    throw e;
  }

  const outputSize = layout.outputSize ?? 512;
  const trim = layout.trim ?? true;

  let totalFrames = 0;
  for (const sheet of layout.sheets ?? []) {
    const sheetPath = path.join(REFERENCE_DIR, sheet.file);
    const meta = await sharp(sheetPath).metadata();
    console.log(`\n→ ${sheet.file}  (${meta.width}×${meta.height})`);

    const entries = (sheet.frames ?? []).flatMap(expandFrames);
    for (const f of entries) {
      const dir = path.join(OUT_DIR, f.action);
      await ensureDir(dir);
      const dest = path.join(dir, `${f.frame}.png`);

      let pipeline = sharp(sheetPath).extract({
        left: f.x,
        top: f.y,
        width: f.w,
        height: f.h,
      });
      if (trim) pipeline = pipeline.trim({ background: '#ffffff', threshold: 10 });
      pipeline = pipeline.resize({
        width: outputSize,
        height: outputSize,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });

      await pipeline.png().toFile(dest);
      console.log(`   ✓ ${f.action}/${f.frame}.png`);
      totalFrames++;
    }
  }

  console.log(`\nDone — sliced ${totalFrames} frames into ${path.relative(process.cwd(), OUT_DIR)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
