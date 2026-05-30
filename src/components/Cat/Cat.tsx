import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../state/useAppStore';
import { FRAME_SPECS, getFrames } from './catFrames';
import { CatSvg } from './CatSvg';
import { getAssetSvg } from './catAssets';
import { useT } from '../../i18n/strings';

export function Cat() {
  const cat = useAppStore((s) => s.cat);
  const settings = useAppStore((s) => s.settings);
  const setCat = useAppStore((s) => s.setCat);
  const t = useT();
  const [frame, setFrame] = useState(0);
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
    prevAction: typeof cat.action;
  } | null>(null);

  useEffect(() => {
    setFrame(0);
    const spec = FRAME_SPECS[cat.action];
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % spec.count);
    }, spec.intervalMs);
    return () => clearInterval(id);
  }, [cat.action]);

  if (settings?.hideCat) return null;
  const useDoodle = settings?.catSkin === 'svg-doodle';
  const frames = useDoodle ? [] : getFrames(cat.action);
  const frameUrl = frames[frame % Math.max(frames.length, 1)];
  // Prefer an external animated SVG asset when one exists for this action.
  // These ship their own @keyframes so we don't need the frame counter.
  const assetUrl = useDoodle ? getAssetSvg(cat.action) : null;

  const onPointerDown = (e: React.PointerEvent) => {
    // Don't capture pointer here — only capture if we actually start a drag.
    // Otherwise short clicks should fall through to whatever is below the cat
    // (typically a bowl).
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: cat.x,
      originY: cat.y,
      moved: false,
      prevAction: cat.action,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.moved && Math.hypot(dx, dy) > 4) {
      s.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setCat({ action: 'held', locked: 'held' });
    }
    if (s.moved) {
      setCat({ x: s.originX + dx, y: s.originY + dy });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s) return;
    dragState.current = null;
    if (s.moved) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // capture may have already been released
      }
      setCat({ action: 'startled', locked: null, message: t.msgPutDown });
      setTimeout(() => setCat({ message: null }), 1200);
      return;
    }
    // Short click without drag — forward to the element below the cat so
    // bowls / house / settings can still be clicked when the cat is on top.
    const catEl = e.currentTarget as HTMLElement;
    const prevPE = catEl.style.pointerEvents;
    catEl.style.pointerEvents = 'none';
    const elBelow = document.elementFromPoint(e.clientX, e.clientY);
    catEl.style.pointerEvents = prevPE;
    if (elBelow && elBelow !== catEl && !catEl.contains(elBelow)) {
      elBelow.dispatchEvent(
        new MouseEvent('click', { bubbles: true, clientX: e.clientX, clientY: e.clientY }),
      );
    }
  };

  return (
    <div
      className="cat cat-sprite interactive"
      style={{
        left: cat.x,
        top: cat.y,
        cursor: 'grab',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Only the sprite itself flips with facing — the speech bubble
          must stay readable. */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scaleX(${cat.facing === 'left' ? -1 : 1})`,
        }}
      >
        {assetUrl ? (
          <img src={assetUrl} alt="" draggable={false} style={{ width: '100%', height: '100%' }} />
        ) : frameUrl ? (
          <img src={frameUrl} alt="" draggable={false} style={{ width: '100%', height: '100%' }} />
        ) : (
          <CatSvg action={cat.action} frame={frame} />
        )}
      </div>
      {settings?.showSpeechBubble && cat.message && (
        <div className="speech-bubble">{cat.message}</div>
      )}
    </div>
  );
}
