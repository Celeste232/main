import { useAppStore } from '../../state/useAppStore';
import { BowlSvg } from './BowlSvg';

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
      onPointerUp={(e) => {
        e.stopPropagation();
        refill();
      }}
      onClick={(e) => {
        e.stopPropagation();
        refill();
      }}
      title="물 채우기"
    >
      <BowlSvg level={level} variant="water" />
    </div>
  );
}
