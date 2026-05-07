import { useEffect, useRef, useState } from 'react';

interface DraggableOptions {
  onDragEnd?: (pos: { x: number; y: number }) => void;
  onClick?: () => void;
  dragThreshold?: number;
}

export function useDraggable(
  initial: { x: number; y: number },
  opts: DraggableOptions = {},
) {
  const { onDragEnd, onClick, dragThreshold = 4 } = opts;
  const [pos, setPos] = useState(initial);
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    setPos(initial);
  }, [initial.x, initial.y]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.moved && Math.hypot(dx, dy) > dragThreshold) {
      s.moved = true;
    }
    if (s.moved) {
      setPos({ x: s.originX + dx, y: s.originY + dy });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (s.moved) {
      onDragEnd?.(pos);
    } else {
      onClick?.();
    }
    dragState.current = null;
  };

  return {
    pos,
    setPos,
    handlers: { onPointerDown, onPointerMove, onPointerUp },
    isDragging: () => dragState.current?.moved ?? false,
  };
}
