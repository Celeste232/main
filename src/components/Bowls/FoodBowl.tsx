import { useAppStore } from '../../state/useAppStore';
import { BowlSvg } from './BowlSvg';

interface FoodBowlProps {
  x: number;
  y: number;
}

export function FoodBowl({ x, y }: FoodBowlProps) {
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);

  const level = settings?.foodLevel ?? 0;
  const refill = () => void patch({ foodLevel: 1 });

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
      title="밥 채우기"
    >
      <BowlSvg level={level} variant="food" />
    </div>
  );
}
