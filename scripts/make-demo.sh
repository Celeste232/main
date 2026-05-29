#!/usr/bin/env bash
# make-demo.sh — Record a short demo of Meow Mode for marketing.
#
# Usage:
#   ./scripts/make-demo.sh [seconds]
#
# Defaults to 20 seconds. Produces:
#   demo/meow-mode-demo.mp4   (high quality, for Twitter/Threads/landing page)
#   demo/meow-mode-demo.gif   (smaller, for Discord/forums/email)
#
# Requirements:
#   - macOS (uses screencapture which is built in)
#   - ffmpeg (install with `brew install ffmpeg` if you don't have it)
#   - Meow Mode already running and visible on screen

set -e

SECONDS_TO_RECORD="${1:-20}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT_DIR="$REPO_DIR/demo"

mkdir -p "$OUT_DIR"
MP4_OUT="$OUT_DIR/meow-mode-demo.mp4"
GIF_OUT="$OUT_DIR/meow-mode-demo.gif"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install it with:"
  echo "    brew install ffmpeg"
  exit 1
fi

echo "─── Meow Mode demo recorder ─────────────────────────────────────"
echo "    Will record the entire screen for $SECONDS_TO_RECORD seconds."
echo "    Make sure Meow Mode is running, the cat is visible, and the"
echo "    desktop background behind it is not embarrassing."
echo ""
read -r -p "Press Enter to start recording (Ctrl+C to abort)..."

echo ""
echo "[1/3] Recording for $SECONDS_TO_RECORD seconds..."
# Record the main display in mp4. -t = duration.
screencapture -v -V "$SECONDS_TO_RECORD" "$MP4_OUT.tmp.mov" || true

echo ""
echo "[2/3] Encoding mp4 (h264, 1080p max, capped 30fps)..."
ffmpeg -y -i "$MP4_OUT.tmp.mov" \
  -vf "scale='min(1920,iw)':-2:flags=lanczos,fps=30" \
  -c:v libx264 -pix_fmt yuv420p -crf 22 -preset slow \
  -movflags +faststart \
  "$MP4_OUT" >/dev/null 2>&1

echo ""
echo "[3/3] Encoding gif (palette, capped 720p / 15fps, looped)..."
PALETTE="$OUT_DIR/_palette.png"
ffmpeg -y -i "$MP4_OUT" \
  -vf "fps=15,scale='min(1280,iw)':-2:flags=lanczos,palettegen=stats_mode=diff" \
  "$PALETTE" >/dev/null 2>&1
ffmpeg -y -i "$MP4_OUT" -i "$PALETTE" \
  -filter_complex "fps=15,scale='min(1280,iw)':-2:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" \
  -loop 0 "$GIF_OUT" >/dev/null 2>&1
rm -f "$PALETTE" "$MP4_OUT.tmp.mov"

echo ""
echo "─── Done. ───────────────────────────────────────────────────────"
echo "    mp4 → $MP4_OUT"
echo "    gif → $GIF_OUT"
echo ""
echo "    Twitter / Threads: drop the mp4 (auto-loops, no upload size issue)"
echo "    Discord / email:   use the gif (universal)"
