import { useEffect } from 'react';

/**
 * Toggle Electron click-through based on whether the cursor is over an
 * interactive element. The window stays transparent everywhere else.
 */
export function useHoverPassthrough() {
  useEffect(() => {
    let ignoring = true;

    const update = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = !!el?.closest('.interactive');
      if (interactive && ignoring) {
        ignoring = false;
        window.api.setIgnoreMouse(false);
      } else if (!interactive && !ignoring) {
        ignoring = true;
        window.api.setIgnoreMouse(true);
      }
    };

    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, []);
}
