import { useAppStore } from '../../state/useAppStore';

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
      onClick={refill}
      title="밥 채우기"
    >
      <div className="bowl-placeholder">
        <div className="rim" />
        {level > 0 && (
          <div
            className="bowl-food"
            style={{ height: `${Math.max(level * 22, 4)}px` }}
          />
        )}
      </div>
    </div>
  );
}
