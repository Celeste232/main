import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../state/useAppStore';
import { FRAME_SPECS, getFrames } from './catFrames';
import { CatSvg } from './CatSvg';

export function Cat() {
  const cat = useAppStore((s) => s.cat);
  const settings = useAppStore((s) => s.settings);
  const setCat = useAppStore((s) => s.setCat);
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

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
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
      setCat({ action: 'held', locked: 'held' });
    }
    if (s.moved) {
      setCat({ x: s.originX + dx, y: s.originY + dy });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // capture may have already been released
    }
    dragState.current = null;
    if (s.moved) {
      setCat({ action: 'startled', locked: null, message: '내려놔!' });
      setTimeout(() => setCat({ message: null }), 1200);
    }
  };

  return (
    <div
      className="cat cat-sprite interactive"
      style={{
        left: cat.x,
        top: cat.y,
        transform: `scaleX(${cat.facing === 'left' ? -1 : 1})`,
        cursor: 'grab',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {frameUrl ? (
        <img src={frameUrl} alt="" draggable={false} style={{ width: '100%', height: '100%' }} />
      ) : (
        <CatSvg action={cat.action} frame={frame} />
      )}
      {settings?.showSpeechBubble && cat.message && (
        <div className="speech-bubble">{cat.message}</div>
      )}
    </div>
  );
}
