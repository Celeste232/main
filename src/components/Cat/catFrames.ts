import type { CatAction } from '../../state/useAppStore';

/**
 * Each action maps to a sprite sequence. Drop PNG frames into
 * src/assets/cat/<action>/<n>.png with matching counts.
 *
 * If a frame import fails the component falls back to a CSS placeholder.
 */
export interface FrameSpec {
  count: number;
  intervalMs: number;
}

export const FRAME_SPECS: Record<CatAction, FrameSpec> = {
  idle: { count: 3, intervalMs: 400 },
  walking: { count: 4, intervalMs: 100 },
  sitting: { count: 2, intervalMs: 600 },
  sleeping: { count: 3, intervalMs: 800 },
  grooming: { count: 3, intervalMs: 200 },
  stretching: { count: 3, intervalMs: 200 },
  yawning: { count: 2, intervalMs: 400 },
  'tail-wag': { count: 3, intervalMs: 150 },
  jumping: { count: 3, intervalMs: 120 },
  curious: { count: 2, intervalMs: 400 },
  eating: { count: 4, intervalMs: 200 },
  drinking: { count: 3, intervalMs: 250 },
  'play-cursor': { count: 4, intervalMs: 120 },
  'in-house': { count: 3, intervalMs: 800 },
  startled: { count: 2, intervalMs: 150 },
  loaf: { count: 2, intervalMs: 1200 },
  sprawl: { count: 2, intervalMs: 1500 },
  held: { count: 2, intervalMs: 200 },
  happy: { count: 2, intervalMs: 300 },
  meow: { count: 3, intervalMs: 200 },
  flop: { count: 2, intervalMs: 1200 },
  sparkle: { count: 3, intervalMs: 200 },
  caught: { count: 2, intervalMs: 250 },
  sneeze: { count: 3, intervalMs: 120 },
  pounce: { count: 3, intervalMs: 150 },
  roll: { count: 4, intervalMs: 180 },
  shake: { count: 4, intervalMs: 100 },
};

/**
 * Resolve sprite urls via Vite's import.meta.glob. PNG frames placed at
 * src/assets/cat/<action>/<n>.png are picked up automatically; missing
 * actions return an empty list so the placeholder is used.
 */
const modules = import.meta.glob('../../assets/cat/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export function getFrames(action: CatAction): string[] {
  const prefix = `../../assets/cat/${action}/`;
  return Object.entries(modules)
    .filter(([k]) => k.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, v]) => v);
}
