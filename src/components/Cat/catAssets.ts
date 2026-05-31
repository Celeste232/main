import type { CatAction } from '../../state/useAppStore';

/**
 * External SVG assets are no longer used — every pose is now hand-coded in
 * CatSvg.tsx so the line weight and proportions stay consistent across all
 * actions. Kept as an empty resolver so Cat.tsx's lookup still type-checks;
 * returning null means "fall through to CatSvg".
 */
export function getAssetSvg(_action: CatAction): string | null {
  return null;
}
