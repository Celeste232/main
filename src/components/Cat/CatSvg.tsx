import type { CatAction } from '../../state/useAppStore';

interface CatSvgProps {
  action: CatAction;
}

/**
 * Minimal SVG cat with a few hand-drawn poses keyed off action.
 * Acts as a fallback when no PNG sprite frames are available.
 */
export function CatSvg({ action }: CatSvgProps) {
  if (action === 'sleeping' || action === 'in-house') return <SleepingCat />;
  if (action === 'walking' || action === 'play-cursor' || action === 'jumping')
    return <WalkingCat />;
  if (action === 'eating' || action === 'drinking') return <EatingCat />;
  if (action === 'stretching') return <StretchingCat />;
  return <SittingCat />;
}

const stroke = '#222';
const sw = 2.5;
const fill = '#fff';

function SittingCat() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path
        d="M28 28 L36 18 L44 28 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path
        d="M56 28 L64 18 L72 28 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      <circle cx="40" cy="48" r="2.5" fill={stroke} />
      <circle cx="60" cy="48" r="2.5" fill={stroke} />
      <path d="M48 56 Q50 58 52 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M30 52 L22 50 M30 56 L22 58" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M70 52 L78 50 M70 56 L78 58" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
      <path
        d="M72 78 Q86 70 84 56"
        stroke={stroke}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WalkingCat() {
  return (
    <svg viewBox="0 0 120 80" width="100%" height="100%">
      <path d="M22 22 L28 12 L36 22 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M40 22 L46 12 L54 22 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <ellipse cx="38" cy="32" rx="18" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="72" cy="46" rx="32" ry="18" fill={fill} stroke={stroke} strokeWidth={sw} />
      <circle cx="32" cy="32" r="2" fill={stroke} />
      <circle cx="44" cy="32" r="2" fill={stroke} />
      <path d="M36 38 Q38 40 40 38" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M52 60 L52 70 M62 60 L62 70 M82 60 L82 70 M92 60 L92 70" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M100 40 Q112 30 108 18" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M22 32 L14 30 M22 36 L14 38" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function SleepingCat() {
  return (
    <svg viewBox="0 0 120 70" width="100%" height="100%">
      <ellipse cx="70" cy="42" rx="42" ry="22" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="28" cy="36" rx="20" ry="18" fill={fill} stroke={stroke} strokeWidth={sw} />
      <path d="M16 26 L22 16 L30 26 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M30 28 L36 18 L42 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M22 36 Q24 38 26 36" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M30 38 Q32 40 34 38" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M14 40 L8 38 M14 44 L8 46" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M108 38 Q120 30 110 22" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
    </svg>
  );
}

function StretchingCat() {
  return (
    <svg viewBox="0 0 130 70" width="100%" height="100%">
      <path d="M14 30 L20 20 L28 30 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M30 30 L36 20 L42 30 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <ellipse cx="28" cy="40" rx="20" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="80" cy="44" rx="36" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
      <circle cx="22" cy="40" r="2" fill={stroke} />
      <circle cx="34" cy="40" r="2" fill={stroke} />
      <path d="M114 38 Q124 18 118 8" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M58 56 L58 64 M66 56 L66 64 M94 56 L94 64 M102 56 L102 64" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

function EatingCat() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M28 32 L34 22 L42 32 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M58 32 L64 22 L72 32 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <ellipse cx="50" cy="52" rx="26" ry="24" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="80" rx="22" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
      <path d="M42 56 Q44 54 46 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M54 56 Q56 54 58 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="64" rx="3" ry="2" fill={stroke} />
    </svg>
  );
}
