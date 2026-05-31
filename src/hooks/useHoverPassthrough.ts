import { useEffect } from 'react';

/**
 * Toggle Electron click-through based on whether the cursor is over (or near)
 * an interactive element. The window is transparent and ignores the mouse
 * everywhere else so clicks fall through to the desktop.
 *
 * The main process owns the sampling clock and pushes the live OS cursor
 * position here (~60x/sec) via onCursorMove. We just hit-test each sample and
 * toggle passthrough. This is reliable regardless of whether macOS is currently
 * forwarding mousemove to an ignoring window — which is what made the old
 * mousemove-only approach drop clicks intermittently. mousemove/pointermove are
 * still wired as a fast path for when the window already owns the cursor.
 */
export function useHoverPassthrough() {
  useEffect(() => {
    let ignoring = true;

    // Treat anything within this many px of an .interactive element as
    // interactive, so the cursor crossing a thin transparent gap (house →
    // settings panel) doesn't flip passthrough back on mid-gesture.
    const MARGIN = 20;

    const isInteractiveAt = (x: number, y: number): boolean => {
      if (document.elementFromPoint(x, y)?.closest('.interactive')) return true;
      for (const [dx, dy] of [
        [MARGIN, 0], [-MARGIN, 0], [0, MARGIN], [0, -MARGIN],
        [MARGIN, MARGIN], [-MARGIN, -MARGIN], [MARGIN, -MARGIN], [-MARGIN, MARGIN],
      ]) {
        if (document.elementFromPoint(x + dx, y + dy)?.closest('.interactive')) return true;
      }
      return false;
    };

    const apply = (x: number, y: number) => {
      // Off-window coords: make sure we're passing through.
      const inside = x >= 0 && y >= 0 && x <= window.innerWidth && y <= window.innerHeight;
      const interactive = inside && isInteractiveAt(x, y);
      if (interactive && ignoring) {
        ignoring = false;
        window.api.setIgnoreMouse(false);
      } else if (!interactive && !ignoring) {
        ignoring = true;
        window.api.setIgnoreMouse(true);
      }
    };

    // Reliable path: main process pushes the OS cursor on its own clock.
    const offCursor = window.api.onCursorMove(({ x, y }) => apply(x, y));

    // Fast path: native move events while the window already receives the mouse.
    const onMove = (e: MouseEvent) => apply(e.clientX, e.clientY);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('pointermove', onMove as (e: Event) => void);
    window.addEventListener('mousedown', onMove, true);

    return () => {
      offCursor();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointermove', onMove as (e: Event) => void);
      window.removeEventListener('mousedown', onMove, true);
    };
  }, []);
}
