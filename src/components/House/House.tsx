import { useAppStore } from '../../state/useAppStore';
import { useDraggable } from '../../hooks/useDraggable';

interface HouseProps {
  onCall: () => void;
  onDragStart: () => void;
}

export function House({ onCall, onDragStart }: HouseProps) {
  const housePos = useAppStore((s) => s.housePos);
  const setHousePos = useAppStore((s) => s.setHousePos);
  const toggleSettings = useAppStore((s) => s.toggleSettings);

  const { pos, handlers } = useDraggable(housePos, {
    onDragEnd: (p) => setHousePos(p),
    onClick: () => onCall(),
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    onDragStart();
    handlers.onPointerDown(e);
  };

  return (
    <div
      className="house house-sprite interactive"
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
    >
      <div className="house-placeholder">
        <div className="roof" />
        <div className="body" />
        <div className="door" />
      </div>
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
