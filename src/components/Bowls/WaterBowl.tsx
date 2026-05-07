import { useAppStore } from '../../state/useAppStore';

interface WaterBowlProps {
  x: number;
  y: number;
}

export function WaterBowl({ x, y }: WaterBowlProps) {
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);

  const level = settings?.waterLevel ?? 0;
  const refill = () => void patch({ waterLevel: 1 });

  return (
    <div
      className="bowl bowl-sprite interactive"
      style={{ left: x, top: y }}
      onClick={refill}
      title="물 채우기"
    >
      <div className="bowl-placeholder">
        <div className="rim" />
        {level > 0 && (
          <div
            className="bowl-water"
            style={{ height: `${Math.max(level * 18, 4)}px` }}
          />
        )}
      </div>
    </div>
  );
}
