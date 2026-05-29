#!/usr/bin/env bash
# Double-click this file in Finder to update Cat House to the latest code,
# rebuild the macOS app, and (re)install it into /Applications.
#
# What it does:
#   1. cd to this script's directory (the cat-house repo root)
#   2. git pull
#   3. npm install (only if package-lock changed)
#   4. npm run build  → release/CatHouse-*.dmg
#   5. Quit any running CatHouse, trash the old /Applications/CatHouse.app
#   6. Mount the matching dmg, copy CatHouse.app to /Applications, unmount
#   7. Remove macOS Gatekeeper quarantine flag
#   8. Launch CatHouse
#
# Errors stop the script; the Terminal window stays open so you can read them.

set -e

# Resolve repo dir = directory holding this script.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "─── Cat House: update + rebuild + install ──────────────────────"
echo "    repo: $SCRIPT_DIR"
echo ""

# 1. Pull (stash any local changes first so the pull never fails)
echo "[1/7] git pull"
STASH_MSG="auto-stash by update-and-install $(date +%s)"
STASHED=0
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "    local changes detected — stashing them as '$STASH_MSG'"
  git stash push -u -m "$STASH_MSG" >/dev/null
  STASHED=1
fi
git pull --ff-only
if [ "$STASHED" = "1" ]; then
  echo "    your local changes are saved in 'git stash list'. Restore with:"
  echo "    git stash pop"
fi

# 2. npm install (only if lockfile changed in this pull)
echo ""
echo "[2/7] npm install (skipped if up to date)"
npm install --no-audit --no-fund

# 3. Build
echo ""
echo "[3/7] npm run build  (this takes 1–3 min)"
npm run build

# 4. Find the right dmg for this Mac
echo ""
echo "[4/7] Finding dmg for $(uname -m)"
ARCH="$(uname -m)"
case "$ARCH" in
  arm64) DMG_PATTERN="release/CatHouse-*-arm64.dmg" ;;
  x86_64) DMG_PATTERN="release/CatHouse-*-x64.dmg" ;;
  *) echo "Unknown arch: $ARCH"; exit 1 ;;
esac
# shellcheck disable=SC2086
DMG_PATH="$(ls -t $DMG_PATTERN 2>/dev/null | head -n1 || true)"
if [ -z "$DMG_PATH" ]; then
  # Fall back to any dmg
  DMG_PATH="$(ls -t release/CatHouse-*.dmg 2>/dev/null | head -n1 || true)"
fi
if [ -z "$DMG_PATH" ]; then
  echo "No dmg found in release/. Build may have failed."
  exit 1
fi
echo "    using: $DMG_PATH"

# 5. Quit any running CatHouse and remove existing install
echo ""
echo "[5/7] Quitting and removing old install"
osascript -e 'tell application "CatHouse" to quit' 2>/dev/null || true
sleep 1
if [ -d "/Applications/CatHouse.app" ]; then
  rm -rf "/Applications/CatHouse.app"
fi

# 6. Mount, copy, unmount.
#    hdiutil's tabular output uses TAB separators; the last field of a row
#    that contains a /Volumes/ path is the mount point. We drop -quiet so we
#    can actually parse the output.
echo ""
echo "[6/7] Mounting dmg and copying app"
MOUNT_LOG="$(mktemp)"
if ! hdiutil attach -nobrowse -readonly "$DMG_PATH" > "$MOUNT_LOG" 2>&1; then
  echo "hdiutil attach failed:"
  cat "$MOUNT_LOG"
  rm -f "$MOUNT_LOG"
  exit 1
fi
MOUNT_POINT="$(awk -F'\t' '/\/Volumes\// { gsub(/[[:space:]]+$/, "", $NF); print $NF }' "$MOUNT_LOG" | tail -n1)"
rm -f "$MOUNT_LOG"
if [ -z "$MOUNT_POINT" ] || [ ! -d "$MOUNT_POINT" ]; then
  echo "Could not find /Volumes mount point in hdiutil output."
  hdiutil info
  exit 1
fi
echo "    mounted at: $MOUNT_POINT"
APP_IN_DMG="$(ls -d "$MOUNT_POINT"/*.app 2>/dev/null | head -n1)"
if [ -z "$APP_IN_DMG" ]; then
  hdiutil detach "$MOUNT_POINT" -quiet || true
  echo "No .app found inside dmg"
  exit 1
fi
cp -R "$APP_IN_DMG" /Applications/
hdiutil detach "$MOUNT_POINT" -quiet

# 7. Strip quarantine + launch
echo ""
echo "[7/7] Stripping quarantine and launching"
xattr -dr com.apple.quarantine /Applications/CatHouse.app 2>/dev/null || true
open /Applications/CatHouse.app

echo ""
echo "─── Done. Cat House is running. ─────────────────────────────────"
echo "    You can close this Terminal window."
echo ""
