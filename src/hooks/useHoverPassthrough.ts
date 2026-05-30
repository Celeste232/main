import { useEffect } from 'react';

/**
 * Toggle Electron click-through based on whether the cursor is over an
 * interactive element. The window stays transparent everywhere else.
 *
 * Beyond mousemove we also re-check on mousedown and when the window
 * regains focus — otherwise switching to another app and coming back
 * with the cursor parked on a button leaves passthrough stuck "on"
 * (no mousemove fires) and the button looks dead until you wiggle.
 */
export function useHoverPassthrough() {
  useEffect(() => {
    let ignoring = true;

    const sync = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y);
      const interactive = !!el?.closest('.interactive');
      if (interactive && ignoring) {
        ignoring = false;
        window.api.setIgnoreMouse(false);
      } else if (!interactive && !ignoring) {
        ignoring = true;
        window.api.setIgnoreMouse(true);
      }
    };

    const onMove = (e: MouseEvent) => sync(e.clientX, e.clientY);
    const onDown = (e: MouseEvent) => sync(e.clientX, e.clientY);
    let lastX = 0;
    let lastY = 0;
    const trackPos = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onFocus = () => {
      // After regaining focus, recompute against the last known cursor
      // position — mousemove won't fire until the user actually moves.
      sync(lastX, lastY);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousemove', trackPos);
    window.addEventListener('mousedown', onDown, true);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousemove', trackPos);
      window.removeEventListener('mousedown', onDown, true);
      window.removeEventListener('focus', onFocus);
    };
  }, []);
}
