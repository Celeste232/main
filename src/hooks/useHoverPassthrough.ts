import { useEffect } from 'react';

/**
 * Toggle Electron click-through based on whether the cursor is over (or near)
 * an interactive element. The window is transparent and ignores the mouse
 * everywhere else so clicks fall through to the desktop.
 *
 * Why polling instead of just mousemove: while the window ignores the mouse,
 * macOS only forwards move events unreliably, so relying on mousemove to turn
 * passthrough OFF means a button sometimes stays "dead" and the click leaks to
 * whatever is behind us. Instead we poll the real OS cursor position (via
 * getCursorPos, already used for look-at-cursor) on a short interval, which
 * keeps working regardless of event forwarding. mousemove is kept as a fast
 * path for snappier response while the window already has the mouse.
 */
export function useHoverPassthrough() {
  useEffect(() => {
    let ignoring = true;
    let alive = true;

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
      // Off-window / off-screen coords: make sure we're passing through.
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

    // Fast path: pointer moving while the window already receives events.
    const onMove = (e: MouseEvent) => apply(e.clientX, e.clientY);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('pointermove', onMove as (e: Event) => void);
    window.addEventListener('mousedown', onMove, true);

    // Reliable path: poll the OS cursor so passthrough stays correct even when
    // macOS stops forwarding move events to an ignoring window.
    const poll = async () => {
      while (alive) {
        try {
          const p = await window.api.getCursorPos();
          if (p) apply(p.x, p.y);
        } catch {
          /* ignore transient IPC errors */
        }
        await new Promise((r) => setTimeout(r, 40));
      }
    };
    void poll();

    return () => {
      alive = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointermove', onMove as (e: Event) => void);
      window.removeEventListener('mousedown', onMove, true);
    };
  }, []);
}
