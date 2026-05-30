import type { CatAction } from '../../state/useAppStore';

/**
 * Mapping from CatAction → external SVG asset (in /public/sprites/svg/).
 * These SVGs ship their own CSS keyframe animations, so we just load the
 * image and let it animate itself. For actions not listed here, the
 * existing hand-coded CatSvg.tsx takes over.
 */
const ASSET_MAP: Partial<Record<CatAction, string>> = {
  'tail-wag': '01_tail_wag.svg',
  walking: '02_tiny_walk.svg',
  sitting: '03_sit_blink.svg',
  idle: '03_sit_blink.svg',
  loaf: '04_loaf_breathe.svg',
  jumping: '05_jump.svg',
  sleeping: '06_sleep_zzz.svg',
  'play-cursor': '07_paw_wave.svg',
  sprawl: '08_curled_ball.svg',
  flop: '09_belly_up.svg',
  curious: '10_peek.svg',
  eating: '11_eating.svg',
  drinking: '11_eating.svg',
  happy: '12_love.svg',
  sparkle: '12_love.svg',
};

export function getAssetSvg(action: CatAction): string | null {
  const file = ASSET_MAP[action];
  return file ? `./sprites/svg/${file}` : null;
}
