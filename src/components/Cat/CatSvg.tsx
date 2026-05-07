import type { CatAction } from '../../state/useAppStore';

interface CatSvgProps {
  action: CatAction;
  frame: number;
}

const stroke = '#222';
const sw = 2.5;
const fill = '#fff';

/**
 * Multi-frame SVG cat. Each action has subtle per-frame transforms
 * (tail wag, breathing, leg cycle, etc) so animation works even
 * without PNG sprite frames.
 */
export function CatSvg({ action, frame }: CatSvgProps) {
  if (action === 'sleeping' || action === 'in-house') return <SleepingCat frame={frame} />;
  if (action === 'walking') return <WalkingCat frame={frame} />;
  if (action === 'jumping') return <JumpingCat frame={frame} />;
  if (action === 'play-cursor') return <PlayCursorCat frame={frame} />;
  if (action === 'eating') return <EatingCat frame={frame} />;
  if (action === 'drinking') return <DrinkingCat frame={frame} />;
  if (action === 'stretching') return <StretchingCat frame={frame} />;
  if (action === 'yawning') return <YawningCat frame={frame} />;
  if (action === 'grooming') return <GroomingCat frame={frame} />;
  if (action === 'tail-wag') return <TailWagCat frame={frame} />;
  if (action === 'curious') return <CuriousCat frame={frame} />;
  if (action === 'startled') return <StartledCat frame={frame} />;
  return <SittingCat frame={frame} />;
}

// Building blocks ───────────────────────────────────────────────────────────

function Ears() {
  return (
    <>
      <path d="M28 28 L36 18 L44 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M56 28 L64 18 L72 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </>
  );
}

function Whiskers() {
  return (
    <>
      <path d="M30 52 L22 50 M30 56 L22 58" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M70 52 L78 50 M70 56 L78 58" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
    </>
  );
}

function Face({ blink = false, mouthOpen = 0 }: { blink?: boolean; mouthOpen?: number }) {
  return (
    <>
      {blink ? (
        <>
          <path d="M37 47 L43 49" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M57 49 L63 47" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="40" cy="48" r="2.5" fill={stroke} />
          <circle cx="60" cy="48" r="2.5" fill={stroke} />
        </>
      )}
      {mouthOpen > 0 ? (
        <ellipse cx="50" cy="58" rx={2 + mouthOpen * 3} ry={1 + mouthOpen * 3} fill="#f08aa6" stroke={stroke} strokeWidth={1.4} />
      ) : (
        <path d="M48 56 Q50 58 52 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      )}
    </>
  );
}

// Per-action poses ──────────────────────────────────────────────────────────

function SittingCat({ frame }: { frame: number }) {
  // Subtle breathing: body scales 1.0 / 1.02 / 1.0
  const scale = 1 + (frame % 3 === 1 ? 0.02 : 0);
  const tailRot = frame % 2 === 0 ? -10 : 10;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <Ears />
      <g transform={`translate(50 50) scale(${scale}) translate(-50 -50)`}>
        <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
        <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      </g>
      <Face />
      <Whiskers />
      <g transform={`rotate(${tailRot} 78 70)`}>
        <path d="M72 78 Q86 70 84 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function WalkingCat({ frame }: { frame: number }) {
  // 4-frame leg cycle + body bob
  const bob = frame % 2 === 0 ? 0 : -1.5;
  const legA = frame % 4 < 2 ? 0 : 8;
  const legB = frame % 4 < 2 ? 8 : 0;
  return (
    <svg viewBox="0 0 120 80" width="100%" height="100%">
      {/* Default-facing-right: mirror the side profile so head ends up on the right. */}
      <g transform="translate(120 0) scale(-1 1)">
        <g transform={`translate(0 ${bob})`}>
          <path d="M22 22 L28 12 L36 22 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M40 22 L46 12 L54 22 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <ellipse cx="38" cy="32" rx="18" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="72" cy="46" rx="32" ry="18" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="32" cy="32" r="2" fill={stroke} />
          <circle cx="44" cy="32" r="2" fill={stroke} />
          <path d="M36 38 Q38 40 40 38" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d="M22 32 L14 30 M22 36 L14 38" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M100 40 Q112 30 108 18" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </g>
        <line x1="52" y1={60} x2="52" y2={70 - legA} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="62" y1={60} x2="62" y2={70 - legB} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="82" y1={60} x2="82" y2={70 - legB} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="92" y1={60} x2="92" y2={70 - legA} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </g>
    </svg>
  );
}

function JumpingCat({ frame }: { frame: number }) {
  // 3 frames: crouch, in-air, land
  const dy = frame === 1 ? -16 : frame === 2 ? -2 : 4;
  const stretch = frame === 1 ? 1.15 : 1;
  return (
    <svg viewBox="0 0 120 90" width="100%" height="100%">
      <g transform="translate(120 0) scale(-1 1)">
        <g transform={`translate(0 ${dy}) scale(1 ${stretch})`}>
          <path d="M22 38 L28 28 L36 38 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M40 38 L46 28 L54 38 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <ellipse cx="38" cy="48" rx="18" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="72" cy="62" rx="32" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="32" cy="48" r="2" fill={stroke} />
          <circle cx="44" cy="48" r="2" fill={stroke} />
          <path d="M104 56 Q116 36 108 24" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </g>
        {frame === 1 && (
          <ellipse cx="60" cy="84" rx="22" ry="3" fill="rgba(0,0,0,0.15)" />
        )}
      </g>
    </svg>
  );
}

function PlayCursorCat({ frame }: { frame: number }) {
  // Paw raised, leaning forward
  const lean = (frame % 4) * 2;
  const paw = frame % 2 === 0 ? 0 : -8;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g transform={`translate(${lean} 0)`}>
        <Ears />
        <ellipse cx="50" cy="50" rx="26" ry="24" fill={fill} stroke={stroke} strokeWidth={sw} />
        <ellipse cx="50" cy="78" rx="22" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        <Face />
        <Whiskers />
        <line x1="40" y1="68" x2={40} y2={80 + paw} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="60" y1="68" x2={60} y2={80} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </g>
    </svg>
  );
}

// Side-profile cat hunched over a bowl on its right. Used for eating and
// drinking — the parent flips horizontally via facing for the water bowl.
function EatingCat({ frame }: { frame: number }) {
  const dip = (frame % 4) * 2;
  return <SideHunchedCat dip={dip} />;
}

function DrinkingCat({ frame }: { frame: number }) {
  const dip = frame === 1 ? 4 : frame === 2 ? 2 : 0;
  return <SideHunchedCat dip={dip} drip={frame === 2} />;
}

function SideHunchedCat({ dip, drip = false }: { dip: number; drip?: boolean }) {
  return (
    <svg viewBox="0 0 120 80" width="100%" height="100%">
      {/* Body */}
      <ellipse cx="50" cy="56" rx="34" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Head dipped toward the right (the bowl side) */}
      <g transform={`translate(${78 + dip * 0.2} ${44 + dip})`}>
        <ellipse cx="0" cy="0" rx="16" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        <path d="M-12 -10 L-8 -20 L-4 -10 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M4 -10 L8 -20 L12 -10 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <circle cx="-4" cy="0" r="1.6" fill={stroke} />
        <circle cx="6" cy="0" r="1.6" fill={stroke} />
        <path d="M-3 6 Q1 8 5 6" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M-14 0 L-20 -2 M-14 4 L-20 6" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" />
        {drip && (
          <line x1="2" y1="10" x2="2" y2="14" stroke="#6aa8d8" strokeWidth={2} strokeLinecap="round" />
        )}
      </g>
      {/* Tail curling up at the back */}
      <path d="M16 56 Q4 46 8 36" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      {/* Legs */}
      <line x1="32" y1="68" x2="32" y2="76" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="62" y1="68" x2="62" y2="76" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

function SleepingCat({ frame }: { frame: number }) {
  const breathe = frame % 3 === 1 ? 1.04 : 1;
  return (
    <svg viewBox="0 0 120 70" width="100%" height="100%">
      <g transform="translate(120 0) scale(-1 1)">
        <g transform={`translate(60 42) scale(1 ${breathe}) translate(-60 -42)`}>
          <ellipse cx="70" cy="42" rx="42" ry="22" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="28" cy="36" rx="20" ry="18" fill={fill} stroke={stroke} strokeWidth={sw} />
        </g>
        <path d="M16 26 L22 16 L30 26 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M30 28 L36 18 L42 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M22 36 Q24 38 26 36" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M30 38 Q32 40 34 38" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M14 40 L8 38 M14 44 L8 46" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
        <path d="M108 38 Q120 30 110 22" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      </g>
      {frame === 0 && (
        <text x="14" y="14" fontSize="10" fill={stroke}>z</text>
      )}
      {frame === 2 && (
        <text x="12" y="10" fontSize="12" fill={stroke}>Z</text>
      )}
    </svg>
  );
}

function StretchingCat({ frame }: { frame: number }) {
  const stretchX = 1 + frame * 0.05;
  return (
    <svg viewBox="0 0 140 70" width="100%" height="100%">
      <g transform="translate(140 0) scale(-1 1)">
        <path d="M14 30 L20 20 L28 30 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M30 30 L36 20 L42 30 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <ellipse cx="28" cy="40" rx="20" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        <g transform={`translate(80 44) scale(${stretchX} 1) translate(-80 -44)`}>
          <ellipse cx="80" cy="44" rx="36" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        </g>
        <circle cx="22" cy="40" r="2" fill={stroke} />
        <circle cx="34" cy="40" r="2" fill={stroke} />
        <path d="M118 38 Q128 18 122 6" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function YawningCat({ frame }: { frame: number }) {
  const open = frame === 0 ? 1 : 0;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <Ears />
      <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      <Face blink={open === 1} mouthOpen={open} />
      <Whiskers />
    </svg>
  );
}

function GroomingCat({ frame }: { frame: number }) {
  // Lick paw — paw to mouth
  const pawY = 56 - frame * 2;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <Ears />
      <ellipse cx="50" cy="50" rx="26" ry="24" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      <Face blink mouthOpen={0.3} />
      <Whiskers />
      <ellipse cx="46" cy={pawY} rx="6" ry="4" fill={fill} stroke={stroke} strokeWidth={sw} />
    </svg>
  );
}

function TailWagCat({ frame }: { frame: number }) {
  const tail = (frame - 1) * 14;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <Ears />
      <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      <Face />
      <Whiskers />
      <g transform={`rotate(${tail} 78 72)`}>
        <path d="M72 78 Q88 66 86 50" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function CuriousCat({ frame }: { frame: number }) {
  const tilt = frame === 0 ? -8 : 8;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g transform={`rotate(${tilt} 50 50)`}>
        <Ears />
        <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
        <Face />
        <Whiskers />
      </g>
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      <text x="78" y="22" fontSize="14" fill={stroke}>?</text>
    </svg>
  );
}

function StartledCat({ frame }: { frame: number }) {
  const puff = frame === 0 ? 1.08 : 1;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g transform={`translate(50 56) scale(${puff}) translate(-50 -56)`}>
        <Ears />
        <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
        <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
        <Face mouthOpen={0.6} />
        <Whiskers />
      </g>
      <text x="14" y="22" fontSize="14" fill={stroke}>!</text>
      <text x="78" y="22" fontSize="14" fill={stroke}>!</text>
    </svg>
  );
}
