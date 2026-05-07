import { useEffect, useRef } from 'react';
import { useAppStore, type CatAction } from '../state/useAppStore';

const ACTION_DURATIONS: Record<CatAction, [number, number]> = {
  idle: [3000, 6000],
  walking: [4000, 9000],
  sitting: [4000, 8000],
  sleeping: [15000, 30000],
  grooming: [4000, 7000],
  stretching: [2000, 3500],
  yawning: [1500, 2500],
  'tail-wag': [3000, 5000],
  jumping: [1500, 2500],
  curious: [2000, 4000],
  eating: [4000, 6000],
  drinking: [3000, 5000],
  'play-cursor': [2000, 5000],
  'in-house': [10000, 25000],
  startled: [1500, 2500],
};

const ACTIVITY_BIAS: Record<'calm' | 'normal' | 'energetic', CatAction[]> = {
  calm: ['idle', 'sitting', 'sleeping', 'grooming', 'sitting', 'sleeping'],
  normal: ['idle', 'walking', 'sitting', 'grooming', 'stretching', 'tail-wag', 'walking'],
  energetic: ['walking', 'walking', 'jumping', 'play-cursor', 'tail-wag', 'stretching'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useCatBehavior(displayBounds: { width: number; height: number } | null) {
  const cat = useAppStore((s) => s.cat);
  const setCat = useAppStore((s) => s.setCat);
  const settings = useAppStore((s) => s.settings);
  const housePos = useAppStore((s) => s.housePos);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkRaf = useRef<number | null>(null);
  const target = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!settings || settings.hideCat) return;
    if (!displayBounds) return;

    const next = () => {
      if (timer.current) clearTimeout(timer.current);
      const bias = ACTIVITY_BIAS[settings.activityLevel];
      const action = pick(bias);
      setCat({ action });

      if (action === 'walking') {
        const tx = Math.random() * (displayBounds.width - 100) + 50;
        const ty = Math.random() * (displayBounds.height - 200) + 150;
        target.current = { x: tx, y: ty };
      }

      const [min, max] = ACTION_DURATIONS[action];
      timer.current = setTimeout(next, min + Math.random() * (max - min));
    };

    next();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [settings, displayBounds, setCat]);

  useEffect(() => {
    if (cat.action !== 'walking' || !target.current) return;

    const step = () => {
      const t = target.current;
      if (!t) return;
      const dx = t.x - cat.x;
      const dy = t.y - cat.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) {
        target.current = null;
        return;
      }
      const speed = settings?.activityLevel === 'energetic' ? 2.5 : 1.2;
      const nx = cat.x + (dx / dist) * speed;
      const ny = cat.y + (dy / dist) * speed;
      setCat({
        x: nx,
        y: ny,
        facing: dx >= 0 ? 'right' : 'left',
      });
      walkRaf.current = requestAnimationFrame(step);
    };

    walkRaf.current = requestAnimationFrame(step);
    return () => {
      if (walkRaf.current) cancelAnimationFrame(walkRaf.current);
    };
  }, [cat.action, cat.x, cat.y, setCat, settings?.activityLevel]);

  const callToHouse = () => {
    target.current = { x: housePos.x + 30, y: housePos.y + 60 };
    setCat({ action: 'walking', message: '갈게~' });
    setTimeout(() => setCat({ message: null }), 1500);
  };

  const startle = () => {
    setCat({ action: 'startled', message: '엇!' });
    setTimeout(() => setCat({ message: null }), 1200);
  };

  return { callToHouse, startle };
}
