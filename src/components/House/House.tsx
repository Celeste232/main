import { useAppStore } from '../../state/useAppStore';
import { useDraggable } from '../../hooks/useDraggable';
import { HouseSvg } from './HouseSvg';

interface HouseProps {
  onCall: () => void;
  onDragStart: () => void;
  onDragStep: (delta: { dx: number; dy: number }) => void;
}

export function House({ onCall, onDragStart, onDragStep }: HouseProps) {
  const housePos = useAppStore((s) => s.housePos);
  const setHousePos = useAppStore((s) => s.setHousePos);
  const toggleSettings = useAppStore((s) => s.toggleSettings);

  const { pos, handlers } = useDraggable(housePos, {
    onDragStart,
    onDrag: (_p, delta) => onDragStep(delta),
    onDragEnd: (p) => setHousePos(p),
    onClick: () => onCall(),
  });

  return (
    <div
      className="house house-sprite interactive"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
    >
      <HouseSvg />
      <button
        className="house-roof-button interactive"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          toggleSettings();
        }}
        aria-label="Settings"
      >
        ⚙
      </button>
    </div>
  );
}
