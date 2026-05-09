import { useEffect, useRef, useState } from 'react';

interface DraggableOptions {
  onDragStart?: () => void;
  onDrag?: (pos: { x: number; y: number }, delta: { dx: number; dy: number }) => void;
  onDragEnd?: (pos: { x: number; y: number }) => void;
  onClick?: () => void;
  dragThreshold?: number;
}

export function useDraggable(
  initial: { x: number; y: number },
  opts: DraggableOptions = {},
) {
  const { onDragStart, onDrag, onDragEnd, onClick, dragThreshold = 4 } = opts;
  const [pos, setPos] = useState(initial);
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    lastX: number;
    lastY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    setPos(initial);
  }, [initial.x, initial.y]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
      lastX: pos.x,
      lastY: pos.y,
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
      onDragStart?.();
    }
    if (s.moved) {
      const nx = s.originX + dx;
      const ny = s.originY + dy;
      const stepDx = nx - s.lastX;
      const stepDy = ny - s.lastY;
      s.lastX = nx;
      s.lastY = ny;
      setPos({ x: nx, y: ny });
      onDrag?.({ x: nx, y: ny }, { dx: stepDx, dy: stepDy });
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
