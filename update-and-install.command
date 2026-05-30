#!/usr/bin/env bash
# Double-click this file in Finder to update Meow Mode to the latest code,
# rebuild the macOS app, and (re)install it into /Applications.
#
# What it does:
#   1. cd to this script's directory (the cat-house repo root)
#   2. git pull
#   3. npm install (only if package-lock changed)
#   4. npm run build  → release/MeowMode-*.dmg
#   5. Quit any running MeowMode, trash the old /Applications/MeowMode.app
#   6. Mount the matching dmg, copy MeowMode.app to /Applications, unmount
#   7. Remove macOS Gatekeeper quarantine flag
#   8. Launch MeowMode
#
# Errors stop the script; the Terminal window stays open so you can read them.

set -e

# Resolve repo dir = directory holding this script.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Surface a Finder popup if we exit before finishing — the user doesn't read
# Terminal logs, so a dialog is the only reliable way to flag a failure.
INSTALL_OK=0
on_exit() {
  if [ "$INSTALL_OK" != "1" ]; then
    osascript -e 'display dialog "Meow Mode 설치가 끝까지 못 갔어. 이 Terminal 창의 마지막 줄 메시지를 스크린샷 찍어서 보내주면 바로 고쳐줄게." with title "Meow Mode" buttons {"OK"} default button "OK" with icon caution' >/dev/null 2>&1 || true
  fi
}
trap on_exit EXIT

echo ""
echo "─── Meow Mode: update + rebuild + install ──────────────────────"
echo "    repo: $SCRIPT_DIR"
echo ""

# 1. Pull (stash any local changes first so the pull never fails)
echo "[1/7] git pull"
SELF_HASH_BEFORE="$(shasum "$0" 2>/dev/null | awk '{print $1}')"
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

# If this script itself changed in the pull, relaunch the new version now so
# the fix applies on the first double-click instead of the next one.
SELF_HASH_AFTER="$(shasum "$0" 2>/dev/null | awk '{print $1}')"
if [ -n "$SELF_HASH_BEFORE" ] && [ "$SELF_HASH_BEFORE" != "$SELF_HASH_AFTER" ]; then
  echo "    update script changed — relaunching new version…"
  trap - EXIT
  exec "$0" "$@"
fi

# 2. npm install (only if lockfile changed in this pull)
echo ""
echo "[2/7] npm install (skipped if up to date)"
npm install --no-audit --no-fund

# 3. Build
echo ""
echo "[3/7] npm run build  (this takes 1–3 min)"
npm run build

# 4. Find the right dmg for this Mac.
#    productName is "Meow Mode" (with a space), so electron-builder names the
#    file "Meow Mode-<version>-<arch>.dmg". Match on the arch suffix only so the
#    space never trips up globbing or word-splitting.
echo ""
echo "[4/7] Finding dmg for $(uname -m)"
ARCH="$(uname -m)"
case "$ARCH" in
  arm64)  ARCH_SUFFIX="arm64" ;;
  x86_64) ARCH_SUFFIX="x64" ;;
  *) echo "Unknown arch: $ARCH"; exit 1 ;;
esac
DMG_PATH="$(ls -t release/*"$ARCH_SUFFIX".dmg 2>/dev/null | head -n1 || true)"
if [ -z "$DMG_PATH" ]; then
  # Fall back to any dmg in release/
  DMG_PATH="$(ls -t release/*.dmg 2>/dev/null | head -n1 || true)"
fi
if [ -z "$DMG_PATH" ]; then
  echo "No dmg found in release/. The build step above probably failed."
  exit 1
fi
echo "    using: $DMG_PATH"

# 5. Quit any running app and remove existing install.
#    productName has a space ("Meow Mode") so the .app gets the space too.
echo ""
echo "[5/7] Quitting and removing old install"
osascript -e 'tell application "Meow Mode" to quit' 2>/dev/null || true
# Also try the old name, in case the user is upgrading from CatHouse
osascript -e 'tell application "CatHouse" to quit' 2>/dev/null || true
osascript -e 'tell application "MeowMode" to quit' 2>/dev/null || true
sleep 1
for OLD in "/Applications/Meow Mode.app" "/Applications/MeowMode.app" "/Applications/CatHouse.app"; do
  if [ -d "$OLD" ]; then
    rm -rf "$OLD"
  fi
done

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

# Resolve the actual installed app path (handles space in productName).
INSTALLED_APP="$(ls -td /Applications/*.app 2>/dev/null | grep -Ei '/(Meow Mode|MeowMode|CatHouse)\.app$' | head -n1)"
if [ -z "$INSTALLED_APP" ] || [ ! -d "$INSTALLED_APP" ]; then
  echo "Couldn't find the installed .app inside /Applications. Open it manually."
  exit 1
fi
echo "    installed at: $INSTALLED_APP"

# 7. Strip quarantine, refresh icon cache, launch
echo ""
echo "[7/7] Stripping quarantine, busting icon cache, launching"
xattr -dr com.apple.quarantine "$INSTALLED_APP" 2>/dev/null || true

# macOS aggressively caches app icons. touch + killall Dock is usually
# enough, but sometimes the icon services cache wins. We layer multiple
# tricks so at least one of them lands:
#   1. touch bumps the mtime (Finder/Dock cue)
#   2. chflags toggle pings the file system attributes
#   3. mv-out-and-back forces Finder to re-register the bundle
#   4. killall Dock + Finder reload their per-process icon caches
touch "$INSTALLED_APP"
chflags hidden "$INSTALLED_APP" 2>/dev/null && chflags nohidden "$INSTALLED_APP" 2>/dev/null
PARENT_DIR="$(dirname "$INSTALLED_APP")"
APP_NAME="$(basename "$INSTALLED_APP")"
TMP_PATH="/tmp/_meowmode_iconbust_$$_$APP_NAME"
if mv "$INSTALLED_APP" "$TMP_PATH" 2>/dev/null; then
  sleep 0.3
  mv "$TMP_PATH" "$PARENT_DIR/$APP_NAME"
  INSTALLED_APP="$PARENT_DIR/$APP_NAME"
fi
killall Dock 2>/dev/null || true
killall Finder 2>/dev/null || true
sleep 1
open "$INSTALLED_APP"

INSTALL_OK=1
echo ""
echo "─── Done. Meow Mode is running. ─────────────────────────────────"
echo "    You can close this Terminal window."
echo ""
