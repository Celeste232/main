import { useEffect } from 'react';

/**
 * Toggle Electron click-through based on whether the cursor is over (or near)
 * an interactive element. The window is transparent and ignores the mouse
 * everywhere else so clicks fall through to the desktop.
 *
 * Key subtlety: while the window is ignoring the mouse, the renderer does NOT
 * receive mousedown/click events at all — the OS routes them straight to
 * whatever is behind us. So we can't rely on a click to "wake up" the window;
 * passthrough has to already be OFF by the time the user presses down. We
 * achieve that by:
 *   - syncing on every mousemove AND pointermove (cheap, fires constantly), and
 *   - treating a small margin AROUND each .interactive element as interactive,
 *     so brief trips across transparent gaps (house → settings panel) don't
 *     flip passthrough back on mid-gesture and swallow the next click.
 */
export function useHoverPassthrough() {
  useEffect(() => {
    let ignoring = true;
    let lastX = 0;
    let lastY = 0;

    // Treat anything within this many px of an .interactive element as
    // interactive, so the cursor crossing a transparent gap between the house
    // and the settings panel doesn't briefly re-enable passthrough.
    const MARGIN = 24;

    const isInteractiveAt = (x: number, y: number): boolean => {
      const el = document.elementFromPoint(x, y);
      if (el?.closest('.interactive')) return true;
      // Probe a ring of points around the cursor; if any lands on an
      // interactive element we keep passthrough off. Cheap and robust against
      // thin gaps and sub-pixel edges.
      for (const [dx, dy] of [
        [MARGIN, 0], [-MARGIN, 0], [0, MARGIN], [0, -MARGIN],
        [MARGIN, MARGIN], [-MARGIN, -MARGIN], [MARGIN, -MARGIN], [-MARGIN, MARGIN],
      ]) {
        const probe = document.elementFromPoint(x + dx, y + dy);
        if (probe?.closest('.interactive')) return true;
      }
      return false;
    };

    const sync = (x: number, y: number) => {
      lastX = x;
      lastY = y;
      const interactive = isInteractiveAt(x, y);
      if (interactive && ignoring) {
        ignoring = false;
        window.api.setIgnoreMouse(false);
      } else if (!interactive && !ignoring) {
        ignoring = true;
        window.api.setIgnoreMouse(true);
      }
    };

    const onMove = (e: MouseEvent) => sync(e.clientX, e.clientY);
    const onPointerMove = (e: PointerEvent) => sync(e.clientX, e.clientY);
    const onFocus = () => sync(lastX, lastY);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('mousedown', onMove, true);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousedown', onMove, true);
      window.removeEventListener('focus', onFocus);
    };
  }, []);
}
