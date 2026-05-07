import { useEffect, useState } from 'react';
import { useAppStore } from '../../state/useAppStore';
import { FRAME_SPECS, getFrames } from './catFrames';
import { CatSvg } from './CatSvg';

export function Cat() {
  const cat = useAppStore((s) => s.cat);
  const settings = useAppStore((s) => s.settings);
  const [frame, setFrame] = useState(0);

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

  return (
    <div
      className="cat cat-sprite"
      style={{
        left: cat.x,
        top: cat.y,
        transform: `scaleX(${cat.facing === 'left' ? -1 : 1})`,
      }}
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
