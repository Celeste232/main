import { useEffect, useRef } from 'react';
import { useAppStore, type CatAction } from '../state/useAppStore';

const ACTION_DURATIONS: Record<CatAction, [number, number]> = {
  idle: [3000, 6000],
  walking: [3000, 7000],
  sitting: [4000, 9000],
  sleeping: [20000, 60000],
  grooming: [4000, 8000],
  stretching: [2000, 3500],
  yawning: [1500, 2500],
  'tail-wag': [3000, 6000],
  jumping: [1500, 2500],
  curious: [2000, 4000],
  eating: [4000, 6000],
  drinking: [3000, 5000],
  'play-cursor': [3000, 8000],
  'in-house': [10000, 60000],
  startled: [1500, 2500],
  loaf: [10000, 30000],
  sprawl: [10000, 40000],
  held: [600, 600],
  happy: [1500, 3000],
  meow: [1500, 2500],
  flop: [8000, 25000],
  sparkle: [1500, 3000],
  caught: [1500, 2500],
  sneeze: [800, 1400],
  pounce: [800, 1500],
  roll: [1500, 2500],
  shake: [600, 1200],
  slip: [900, 1500],
};

// Activity-level → weighted action pool. Repeated entries = higher weight.
const ACTIVITY_BIAS: Record<'calm' | 'normal' | 'energetic', CatAction[]> = {
  calm: [
    'sitting', 'sitting',
    'loaf', 'loaf', 'loaf',
    'sprawl', 'sprawl',
    'flop',
    'sleeping', 'sleeping',
    'grooming',
    'yawning',
    'walking',
    'meow',
    'sparkle',
    'sneeze',
    'shake',
  ],
  normal: [
    'walking', 'walking',
    'sitting',
    'loaf', 'loaf',
    'sprawl',
    'flop',
    'grooming',
    'stretching',
    'tail-wag',
    'yawning',
    'curious',
    'meow',
    'sparkle',
    'caught',
    'sneeze',
    'pounce',
    'roll',
    'shake',
    'sleeping',
  ],
  energetic: [
    'walking', 'walking', 'walking',
    'play-cursor', 'play-cursor',
    'jumping',
    'tail-wag',
    'stretching',
    'curious',
    'sitting',
    'loaf',
    'meow', 'meow',
    'caught',
    'sparkle',
    'pounce', 'pounce',
    'roll',
    'sneeze',
    'shake',
  ],
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
  const target = useRef<{ x: number; y: number; meta?: 'food' | 'water' } | null>(null);
  const lastAction = useRef<CatAction | null>(null);

  // Cat sprite is 80×80; bowls are 60×50 anchored at housePos+offset.
  const eatSpot = { x: housePos.x + 130 - 50, y: housePos.y + 70 - 30 };
  const drinkSpot = { x: housePos.x + 195 + 50, y: housePos.y + 70 - 30 };

  // Pick a wandering target inside the configured roam area.
  const pickWanderTarget = (): { x: number; y: number } => {
    if (!displayBounds) return { x: housePos.x, y: housePos.y };
    if (settings?.roamArea === 'at-house') {
      // Tiny radius — cat hangs right by the door.
      const radius = 80;
      const cx = housePos.x + 60;
      const cy = housePos.y + 90;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    }
    if (settings?.roamArea === 'near-house') {
      const radius = 350;
      const cx = housePos.x + 60;
      const cy = housePos.y + 60;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const tx = Math.max(20, Math.min(displayBounds.width - 100, cx + Math.cos(angle) * r));
      const ty = Math.max(120, Math.min(displayBounds.height - 120, cy + Math.sin(angle) * r));
      return { x: tx, y: ty };
    }
    if (settings?.roamArea === 'edges') {
      // Pick a random point along one of the four screen edges
      const margin = 60;
      const side = Math.floor(Math.random() * 4);
      switch (side) {
        case 0: // top
          return { x: Math.random() * (displayBounds.width - 100) + 50, y: margin };
        case 1: // right
          return { x: displayBounds.width - margin - 80, y: Math.random() * (displayBounds.height - 200) + 100 };
        case 2: // bottom
          return { x: Math.random() * (displayBounds.width - 100) + 50, y: displayBounds.height - margin - 80 };
        default: // left
          return { x: margin, y: Math.random() * (displayBounds.height - 200) + 100 };
      }
    }
    return {
      x: Math.random() * (displayBounds.width - 100) + 50,
      y: Math.random() * (displayBounds.height - 200) + 150,
    };
  };

  // Behavior scheduler — every cycle picks a next action.
  useEffect(() => {
    if (!settings || settings.hideCat) return;
    if (!displayBounds) return;
    if (cat.locked) return;

    const next = () => {
      if (timer.current) clearTimeout(timer.current);
      const bias = ACTIVITY_BIAS[settings.activityLevel];

      // Pick an action — but avoid repeating the same one back-to-back so it
      // doesn't feel like a loop.
      let action: CatAction;
      let tries = 0;
      do {
        action = pick(bias);
        tries++;
      } while (action === lastAction.current && tries < 4);
      lastAction.current = action;

      // Occasionally seek out a bowl if hungry/thirsty.
      const wantsFood = (settings.foodLevel ?? 0) > 0.05 && Math.random() < 0.18;
      const wantsWater = (settings.waterLevel ?? 0) > 0.05 && Math.random() < 0.12;
      if (wantsFood) {
        action = 'walking';
        target.current = { ...eatSpot, meta: 'food' };
      } else if (wantsWater) {
        action = 'walking';
        target.current = { ...drinkSpot, meta: 'water' };
      } else if (action === 'walking') {
        target.current = pickWanderTarget();
      }

      setCat({ action });

      const [min, max] = ACTION_DURATIONS[action];
      timer.current = setTimeout(next, min + Math.random() * (max - min));
    };

    next();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [settings, displayBounds, setCat, eatSpot.x, eatSpot.y, drinkSpot.x, drinkSpot.y, cat.locked]);

  // Random slip while walking on top of windows — fakes a near-fall at the
  // edge of an invisible app window. Only triggers in 'front' mode since the
  // cat is logically on top of other apps then.
  useEffect(() => {
    if (cat.action !== 'walking') return;
    if (settings?.windowLayer !== 'front') return;
    if (cat.locked) return;
    const id = setTimeout(() => {
      if (useAppStore.getState().cat.action !== 'walking') return;
      if (Math.random() < 0.18) {
        target.current = null;
        setCat({ action: 'slip', message: '어어!' });
        setTimeout(() => setCat({ message: null }), 1200);
      }
    }, 1500 + Math.random() * 2500);
    return () => clearTimeout(id);
  }, [cat.action, cat.locked, settings?.windowLayer, setCat]);

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
        const meta = t.meta;
        target.current = null;
        if (meta === 'food' && (settings?.foodLevel ?? 0) > 0) {
          setCat({ action: 'eating', facing: 'right' });
        } else if (meta === 'water' && (settings?.waterLevel ?? 0) > 0) {
          setCat({ action: 'drinking', facing: 'left' });
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
  }, [cat.action, cat.x, cat.y, setCat, settings]);

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
        setCat({ action: 'happy', message: '맛있어!' });
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

  // Look-at-cursor — when cursor is near, just turn to face it (no movement).
  useEffect(() => {
    const watchActions: CatAction[] = ['sitting', 'idle', 'loaf', 'tail-wag', 'curious', 'grooming'];
    if (!watchActions.includes(cat.action)) return;
    if (cat.locked) return;

    let alive = true;
    const tick = async () => {
      if (!alive) return;
      try {
        const p = await window.api.getCursorPos();
        const c = useAppStore.getState().cat;
        const dist = Math.hypot(p.x - (c.x + 40), p.y - (c.y + 40));
        if (dist < 200) {
          const wantFacing: 'left' | 'right' = p.x > c.x + 40 ? 'right' : 'left';
          if (c.facing !== wantFacing) setCat({ facing: wantFacing });
          // Small chance to perk up to 'curious' if cursor lingers very close
          if (dist < 80 && c.action !== 'curious' && Math.random() < 0.04) {
            setCat({ action: 'curious' });
          }
        }
      } catch {
        // ignore
      }
      setTimeout(tick, 250);
    };
    void tick();

    return () => {
      alive = false;
    };
  }, [cat.action, cat.locked, setCat]);

  const callToHouse = () => {
    target.current = { x: housePos.x + 20, y: housePos.y + 40 };
    setCat({ action: 'walking', message: '갈게~', locked: null });
    setTimeout(() => setCat({ message: null }), 1500);
  };

  const startle = () => {
    setCat({ action: 'startled', message: '엇!' });
    setTimeout(() => setCat({ message: null }), 1200);
  };

  const putInHouse = () => {
    setCat({
      action: 'in-house',
      x: housePos.x + 30,
      y: housePos.y + 30,
      locked: 'in-house',
    });
  };

  const releaseFromHouse = () => {
    setCat({ action: 'idle', locked: null, x: housePos.x + 130, y: housePos.y + 60 });
  };

  // Make the cat jump in place to draw attention. If the window is hidden
  // behind other apps, briefly bring it forward via the main process IPC.
  const findCat = () => {
    if (settings?.windowLayer === 'back') {
      window.api.flashToFront();
    }
    const original = useAppStore.getState().cat.action;
    setCat({ action: 'jumping', message: '여기야~!' });
    setTimeout(() => setCat({ message: null }), 1500);
    // Cycle through jumping 3 times for visibility, then resume.
    setTimeout(() => {
      const c = useAppStore.getState().cat;
      if (c.action === 'jumping') setCat({ action: original });
    }, 2200);
  };

  return { callToHouse, startle, putInHouse, releaseFromHouse, findCat };
}
