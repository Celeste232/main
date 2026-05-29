import { useEffect, useRef } from 'react';
import { useAppStore, type CatAction } from '../state/useAppStore';
import { getT } from '../i18n/strings';

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
  superman: [10000, 30000],
  dangle: [1500, 2500],
  climb: [1500, 2200],
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
    'superman', 'superman',
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
    'superman',
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

  // Random window-edge mishap while walking in 'front' mode. Fakes the cat
  // running off the edge of an invisible app window: slip → dangle → climb.
  useEffect(() => {
    if (cat.action !== 'walking') return;
    if (settings?.windowLayer !== 'front') return;
    if (cat.locked) return;
    const id = setTimeout(() => {
      const c = useAppStore.getState().cat;
      if (c.action !== 'walking') return;
      const roll = Math.random();
      const t = getT(settings?.language ?? 'ko');
      if (roll < 0.12) {
        // Full near-fall sequence
        target.current = null;
        setCat({ action: 'slip', message: t.msgUhOh });
        setTimeout(() => {
          if (useAppStore.getState().cat.action === 'slip') {
            setCat({ action: 'dangle', message: t.msgWhat });
          }
        }, 900);
        setTimeout(() => {
          if (useAppStore.getState().cat.action === 'dangle') {
            setCat({ action: 'climb', message: t.msgHeave });
          }
        }, 2800);
        setTimeout(() => {
          const cur = useAppStore.getState().cat;
          if (cur.action === 'climb') setCat({ message: null });
        }, 4400);
      } else if (roll < 0.22) {
        // Just a slip
        target.current = null;
        setCat({ action: 'slip', message: t.msgUhOh });
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
        const t = getT(useAppStore.getState().settings?.language ?? 'ko');
        setCat({ action: 'happy', message: t.msgYum });
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

  // Random chatter — every 20-50 seconds the cat blurts something cute.
  useEffect(() => {
    if (!settings?.showSpeechBubble) return;
    if (settings?.hideCat || settings?.paused) return;

    const tick = () => {
      const c = useAppStore.getState().cat;
      const s = useAppStore.getState().settings;
      if (!s || c.locked === 'held' || c.message) return;
      const t = getT(s.language ?? 'ko');
      const name = s.catName || '나비';
      const phrases = [
        t.msgPlayWith(name),
        t.msgHmph,
        t.msgWhatever,
        t.msgGoing,
        t.msgMeow,
        t.msgBored,
        t.msgNap,
        t.msgDontStare,
      ];
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      setCat({ message: phrase });
      setTimeout(() => {
        const cur = useAppStore.getState().cat;
        if (cur.message === phrase) setCat({ message: null });
      }, 2200);
    };

    const id = setInterval(() => {
      if (Math.random() < 0.35) tick();
    }, 18000);
    return () => clearInterval(id);
  }, [settings?.showSpeechBubble, settings?.hideCat, settings?.paused, setCat]);

  // Hunger / thirst alerts — when a bowl is empty, periodically nag.
  useEffect(() => {
    if (!settings?.showSpeechBubble) return;
    if (settings?.hideCat || settings?.paused) return;

    const id = setInterval(() => {
      const s = useAppStore.getState().settings;
      const c = useAppStore.getState().cat;
      if (!s || c.message || c.locked === 'held') return;
      const t = getT(s.language ?? 'ko');
      if ((s.foodLevel ?? 1) <= 0.05 && Math.random() < 0.6) {
        setCat({ message: t.msgFeedMe });
        setTimeout(() => {
          const cur = useAppStore.getState().cat;
          if (cur.message === t.msgFeedMe) setCat({ message: null });
        }, 2200);
        return;
      }
      if ((s.waterLevel ?? 1) <= 0.05 && Math.random() < 0.6) {
        setCat({ message: t.msgNoWater });
        setTimeout(() => {
          const cur = useAppStore.getState().cat;
          if (cur.message === t.msgNoWater) setCat({ message: null });
        }, 2200);
      }
    }, 12000);
    return () => clearInterval(id);
  }, [settings?.showSpeechBubble, settings?.hideCat, settings?.paused, setCat]);

  const callToHouse = () => {
    const t = getT(settings?.language ?? 'ko');
    target.current = { x: housePos.x + 20, y: housePos.y + 40 };
    setCat({ action: 'walking', message: t.msgComing, locked: null });
    setTimeout(() => setCat({ message: null }), 1500);
  };

  const startle = () => {
    const t = getT(settings?.language ?? 'ko');
    setCat({ action: 'startled', message: t.msgWhoops });
    setTimeout(() => setCat({ message: null }), 1200);
  };

  const putInHouse = () => {
    // Cat sprite is 80×80, house door arch sits around (x=44..76, y=90..114)
    // of the 120×120 house viewBox. Center the cat horizontally and slide it
    // down so the head + paws appear within the door silhouette.
    setCat({
      action: 'in-house',
      x: housePos.x + 20,
      y: housePos.y + 55,
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
    const t = getT(settings?.language ?? 'ko');
    setCat({ action: 'jumping', message: t.msgFoundMe });
    setTimeout(() => setCat({ message: null }), 1500);
    // Cycle through jumping 3 times for visibility, then resume.
    setTimeout(() => {
      const c = useAppStore.getState().cat;
      if (c.action === 'jumping') setCat({ action: original });
    }, 2200);
  };

  return { callToHouse, startle, putInHouse, releaseFromHouse, findCat };
}
