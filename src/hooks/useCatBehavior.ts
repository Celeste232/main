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
  'play-cursor': [3000, 6000],
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
  const patchSettings = useAppStore((s) => s.patchSettings);
  const housePos = useAppStore((s) => s.housePos);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkRaf = useRef<number | null>(null);
  const target = useRef<{ x: number; y: number } | null>(null);

  // Behavior scheduler — every cycle picks a next action.
  useEffect(() => {
    if (!settings || settings.hideCat) return;
    if (!displayBounds) return;

    const next = () => {
      if (timer.current) clearTimeout(timer.current);
      const bias = ACTIVITY_BIAS[settings.activityLevel];
      let action: CatAction = pick(bias);

      // Occasionally seek out a bowl if hungry/thirsty.
      const wantsFood = (settings.foodLevel ?? 0) > 0.05 && Math.random() < 0.18;
      const wantsWater = (settings.waterLevel ?? 0) > 0.05 && Math.random() < 0.12;
      if (wantsFood) {
        action = 'walking';
        target.current = { x: housePos.x + 130, y: housePos.y + 90 };
      } else if (wantsWater) {
        action = 'walking';
        target.current = { x: housePos.x + 195, y: housePos.y + 90 };
      } else if (action === 'walking') {
        const tx = Math.random() * (displayBounds.width - 100) + 50;
        const ty = Math.random() * (displayBounds.height - 200) + 150;
        target.current = { x: tx, y: ty };
      }

      setCat({ action });

      const [min, max] = ACTION_DURATIONS[action];
      timer.current = setTimeout(next, min + Math.random() * (max - min));
    };

    next();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [settings, displayBounds, setCat, housePos.x, housePos.y]);

  // Walking — move toward current target, then trigger eat/drink if at a bowl.
  useEffect(() => {
    if (cat.action !== 'walking' || !target.current) return;

    const step = () => {
      const t = target.current;
      if (!t) return;
      const dx = t.x - cat.x;
      const dy = t.y - cat.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 4) {
        target.current = null;
        // If we walked to a bowl, switch to eating/drinking
        const foodPos = { x: housePos.x + 130, y: housePos.y + 90 };
        const waterPos = { x: housePos.x + 195, y: housePos.y + 90 };
        if (Math.hypot(t.x - foodPos.x, t.y - foodPos.y) < 6 && (settings?.foodLevel ?? 0) > 0) {
          setCat({ action: 'eating' });
        } else if (Math.hypot(t.x - waterPos.x, t.y - waterPos.y) < 6 && (settings?.waterLevel ?? 0) > 0) {
          setCat({ action: 'drinking' });
        }
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
  }, [cat.action, cat.x, cat.y, setCat, settings, housePos.x, housePos.y]);

  // Eating / drinking — drain bowl while the action lasts.
  useEffect(() => {
    if (cat.action !== 'eating' && cat.action !== 'drinking') return;
    const isEating = cat.action === 'eating';
    const id = setInterval(() => {
      const s = useAppStore.getState().settings;
      if (!s) return;
      const current = isEating ? s.foodLevel : s.waterLevel;
      const next = Math.max(0, current - 0.05);
      const affinity = (s.affinity ?? 0) + 1;
      void patchSettings(
        isEating ? { foodLevel: next, affinity } : { waterLevel: next, affinity },
      );
      if (next <= 0) {
        setCat({ action: 'sitting', message: '맛있어!' });
        setTimeout(() => setCat({ message: null }), 1200);
      }
    }, 600);
    return () => clearInterval(id);
  }, [cat.action, patchSettings, setCat]);

  // Play-cursor — follow the real cursor through IPC polling.
  useEffect(() => {
    if (cat.action !== 'play-cursor') return;
    let alive = true;

    const tick = async () => {
      if (!alive) return;
      try {
        const p = await window.api.getCursorPos();
        const c = useAppStore.getState().cat;
        const dx = p.x - c.x;
        const dy = p.y - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 6) {
          const speed = 3;
          setCat({
            x: c.x + (dx / dist) * speed,
            y: c.y + (dy / dist) * speed,
            facing: dx >= 0 ? 'right' : 'left',
          });
        }
      } catch {
        // ignore
      }
      setTimeout(tick, 60);
    };
    void tick();

    return () => {
      alive = false;
    };
  }, [cat.action, setCat]);

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
