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
  if (action === 'loaf') return <LoafCat frame={frame} />;
  if (action === 'sprawl') return <SprawlCat frame={frame} />;
  if (action === 'held') return <HeldCat frame={frame} />;
  if (action === 'happy') return <HappyCat frame={frame} />;
  if (action === 'meow') return <MeowCat frame={frame} />;
  if (action === 'flop') return <FlopCat frame={frame} />;
  if (action === 'sparkle') return <SparkleCat frame={frame} />;
  if (action === 'caught') return <CaughtCat frame={frame} />;
  if (action === 'sneeze') return <SneezeCat frame={frame} />;
  if (action === 'pounce') return <PounceCat frame={frame} />;
  if (action === 'roll') return <RollCat frame={frame} />;
  if (action === 'shake') return <ShakeCat frame={frame} />;
  if (action === 'slip') return <SlipCat frame={frame} />;
  return <SittingCat frame={frame} />;
}

function SlipCat({ frame }: { frame: number }) {
  // 어어어! — body sliding, paws flailing, recover. Mirrored so it faces right.
  const tilt = [12, -8, 0][frame] ?? 0;
  const dx = [0, 6, 2][frame] ?? 0;
  return (
    <svg viewBox="0 0 140 90" width="100%" height="100%">
      <g transform="translate(140 0) scale(-1 1)">
        <g transform={`translate(${dx} 0) rotate(${tilt} 70 60)`}>
          {/* Tail straight up in panic */}
          <path d="M108 50 Q116 30 110 14" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          {/* Body in back */}
          <ellipse cx="78" cy="52" rx="32" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
          {/* Ears */}
          <path d="M22 28 L28 18 L36 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M40 28 L46 18 L54 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          {/* Head on top of body so the face leads */}
          <ellipse cx="38" cy="38" rx="18" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="32" cy="38" r="2.5" fill={stroke} />
          <circle cx="44" cy="38" r="2.5" fill={stroke} />
          <ellipse cx="38" cy="46" rx="3" ry="2.5" fill="#f08aa6" stroke={stroke} strokeWidth={1.4} />
          {/* Paws flailing — splayed legs */}
          <line x1="56" y1="64" x2={50 + frame * 2} y2={78 + frame * 2} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="68" y1="64" x2={64 - frame * 2} y2={80} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="88" y1="64" x2={92 + frame} y2={80} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="100" y1="64" x2={106} y2={78 - frame} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </g>
      </g>
      {/* Skid lines under the back foot */}
      <path d="M30 84 L50 84 M58 86 L78 86" stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <text x="86" y="20" fontSize="11" fill={stroke}>어어!</text>
    </svg>
  );
}

function SneezeCat({ frame }: { frame: number }) {
  // Build-up → SNEEZE → recover
  const headBack = frame === 0 ? -3 : frame === 1 ? 6 : 0;
  const open = frame === 1 ? 1 : 0;
  return (
    <svg viewBox="0 0 110 110" width="100%" height="100%">
      <Ears />
      <g transform={`translate(0 ${headBack})`}>
        <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
        <Face mouthOpen={open} blink={frame === 1} />
        <Whiskers />
      </g>
      <ellipse cx="50" cy="80" rx="22" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
      {frame === 1 && (
        <>
          <text x="80" y="22" fontSize="12" fill={stroke}>에취!</text>
          {/* Droplets */}
          <circle cx="84" cy="50" r="2" fill={stroke} />
          <circle cx="92" cy="46" r="1.5" fill={stroke} />
          <circle cx="96" cy="54" r="1.2" fill={stroke} />
        </>
      )}
    </svg>
  );
}

function PounceCat({ frame }: { frame: number }) {
  // Crouch → spring forward → land
  const dy = frame === 0 ? 6 : frame === 1 ? -10 : 2;
  const lean = frame === 0 ? -4 : frame === 1 ? 6 : 0;
  return (
    <svg viewBox="0 0 120 90" width="100%" height="100%">
      <g transform={`translate(${lean} ${dy})`}>
        <path d="M104 56 Q116 36 108 24" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <ellipse cx="74" cy="60" rx="32" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        <path d="M22 36 L28 26 L36 36 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M40 36 L46 26 L54 36 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <ellipse cx="38" cy="46" rx="18" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
        <circle cx="32" cy="46" r="2" fill={stroke} />
        <circle cx="44" cy="46" r="2" fill={stroke} />
        <ellipse cx="38" cy="54" rx="2" ry="1.5" fill="#f08aa6" />
      </g>
      {frame === 1 && (
        <ellipse cx="58" cy="84" rx="22" ry="3" fill="rgba(0,0,0,0.15)" />
      )}
    </svg>
  );
}

function RollCat({ frame }: { frame: number }) {
  // 4-frame roll: side → belly → other side → upright
  const rot = frame * 90;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g transform={`rotate(${rot} 50 60)`}>
        <Ears />
        <ellipse cx="50" cy="48" rx="26" ry="22" fill={fill} stroke={stroke} strokeWidth={sw} />
        <ellipse cx="50" cy="74" rx="22" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        <path d="M44 48 Q46 50 48 48" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M52 48 Q54 50 56 48" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M48 56 Q50 58 52 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      </g>
      {/* motion lines under */}
      <path d="M20 92 L26 92 M34 92 L40 92 M48 92 L54 92 M62 92 L68 92 M76 92 L82 92"
            stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function ShakeCat({ frame }: { frame: number }) {
  // Tilt left-right-left-right with motion lines
  const tilt = [(-6), 6, (-4), 4][frame] ?? 0;
  return (
    <svg viewBox="0 0 110 100" width="100%" height="100%">
      <g transform={`rotate(${tilt} 50 60)`}>
        <Ears />
        <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
        <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
        <Face blink />
        <Whiskers />
      </g>
      {/* motion squiggles on both sides */}
      <path d="M14 40 Q10 44 14 48" stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M8 50 Q4 54 8 58" stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M96 40 Q100 44 96 48" stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M102 50 Q106 54 102 58" stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </svg>
  );
}

function HappyCat({ frame }: { frame: number }) {
  // ^_^ eyes, slight tail swish, hearts
  const tail = frame % 2 === 0 ? -16 : 16;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <Ears />
      <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* ^_^ */}
      <path d="M36 48 Q40 44 44 48" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M56 48 Q60 44 64 48" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M46 56 Q50 60 54 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <Whiskers />
      <g transform={`rotate(${tail} 78 70)`}>
        <path d="M72 78 Q88 66 86 50" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      </g>
      {/* tiny heart */}
      <path d="M80 18 q-3 -4 -6 0 q0 4 6 8 q6 -4 6 -8 q-3 -4 -6 0 Z"
            fill="none" stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
}

function MeowCat({ frame }: { frame: number }) {
  // Mouth opening + sound waves
  const open = frame === 0 ? 0.3 : frame === 1 ? 1 : 0.6;
  const wave = frame === 1 ? 1 : 0;
  return (
    <svg viewBox="0 0 110 100" width="100%" height="100%">
      <Ears />
      <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      <Face mouthOpen={open} />
      <Whiskers />
      {wave === 1 && (
        <>
          <path d="M86 44 Q94 48 86 52" stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <path d="M92 38 Q104 48 92 58" stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function FlopCat({ frame }: { frame: number }) {
  // Belly-up flop, paws in the air
  const wiggle = frame % 2 === 0 ? 0 : 2;
  return (
    <svg viewBox="0 0 140 80" width="100%" height="100%">
      {/* Body — wider oval since cat is belly-up */}
      <ellipse cx="70" cy="56" rx="56" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Head at left, facing up */}
      <ellipse cx="20" cy="56" rx="14" ry="13" fill={fill} stroke={stroke} strokeWidth={sw} />
      <path d="M10 48 L14 38 L20 48 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M22 48 L28 38 L32 48 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      {/* closed-content eyes */}
      <path d="M14 56 Q16 58 18 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M24 56 Q26 58 28 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      {/* Paws in the air */}
      <line x1={60} y1="38" x2={62 + wiggle} y2="48" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1={72} y1="36" x2={74 - wiggle} y2="48" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1={92} y1="38" x2={94 + wiggle} y2="48" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1={104} y1="40" x2={106 - wiggle} y2="50" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M126 56 Q138 50 132 38" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SparkleCat({ frame }: { frame: number }) {
  // Sitting cat with sparkle ✨ around — used as a cute moment
  const stars = ['12,8', '82,12', '90,76', '6,72'];
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <Ears />
      <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* sparkle eyes */}
      <path d="M38 46 L40 48 L42 46 L40 50 Z" fill={stroke} />
      <path d="M58 46 L60 48 L62 46 L60 50 Z" fill={stroke} />
      <path d="M48 56 Q50 58 52 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <Whiskers />
      {stars.map((s, i) => {
        const [cx, cy] = s.split(',').map(Number);
        const show = (frame + i) % 3 !== 2;
        if (!show) return null;
        return (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            <path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill={stroke} />
          </g>
        );
      })}
    </svg>
  );
}

function CaughtCat({ frame }: { frame: number }) {
  // Surprised "caught in the act" face — wide eyes, ! mark
  const wide = frame % 2 === 0 ? 4 : 3.5;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <Ears />
      <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      <circle cx="40" cy="48" r={wide} fill="none" stroke={stroke} strokeWidth={1.8} />
      <circle cx="60" cy="48" r={wide} fill="none" stroke={stroke} strokeWidth={1.8} />
      <circle cx="40" cy="48" r="1.4" fill={stroke} />
      <circle cx="60" cy="48" r="1.4" fill={stroke} />
      <ellipse cx="50" cy="58" rx="2" ry="2.5" fill="#f08aa6" stroke={stroke} strokeWidth={1.2} />
      <Whiskers />
      <text x="80" y="20" fontSize="14" fill={stroke}>!</text>
    </svg>
  );
}

function LoafCat({ frame }: { frame: number }) {
  // 식빵 — paws tucked, body a rounded loaf, content blink
  const breathe = frame % 2 === 0 ? 1 : 1.04;
  return (
    <svg viewBox="0 0 100 90" width="100%" height="100%">
      <Ears />
      <g transform={`translate(50 56) scale(1 ${breathe}) translate(-50 -56)`}>
        <path
          d="M16 78 L16 56 Q16 30 50 30 Q84 30 84 56 L84 78 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </g>
      <Face blink={frame % 2 === 1} />
      <Whiskers />
      <path d="M82 78 Q90 76 86 64" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SprawlCat({ frame }: { frame: number }) {
  // 퍼져있음 — long horizontal blob, paws splayed
  const breathe = frame % 2 === 0 ? 1 : 1.05;
  return (
    <svg viewBox="0 0 140 70" width="100%" height="100%">
      <g transform={`translate(70 50) scale(${breathe} 1) translate(-70 -50)`}>
        <ellipse cx="70" cy="50" rx="56" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
      </g>
      <ellipse cx="20" cy="42" rx="14" ry="12" fill={fill} stroke={stroke} strokeWidth={sw} />
      <path d="M10 32 L14 22 L20 32 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M22 32 L28 22 L32 32 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M16 42 Q18 44 20 42" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M24 42 Q26 44 28 42" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M124 50 Q138 42 132 30" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      {/* splayed back legs */}
      <line x1="100" y1="60" x2="106" y2="68" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="92" y1="60" x2="86" y2="68" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

function HeldCat({ frame }: { frame: number }) {
  // Dangling cat — limbs hanging down with wobble
  const wobble = frame % 2 === 0 ? -2 : 2;
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      <g transform={`rotate(${wobble} 50 50)`}>
        <Ears />
        <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
        <ellipse cx="50" cy="80" rx="22" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        <Face mouthOpen={0.4} />
        <Whiskers />
        <line x1="40" y1="92" x2="38" y2="100" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="60" y1="92" x2="62" y2="100" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </g>
      <text x="14" y="22" fontSize="14" fill={stroke}>!</text>
    </svg>
  );
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
          {/* Tail at the back */}
          <path d="M100 40 Q112 30 108 18" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          {/* Body */}
          <ellipse cx="72" cy="46" rx="32" ry="18" fill={fill} stroke={stroke} strokeWidth={sw} />
          {/* Ears (head will cover their base) */}
          <path d="M22 22 L28 12 L36 22 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M40 22 L46 12 L54 22 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          {/* Head on top of body so the face stays visible */}
          <ellipse cx="38" cy="32" rx="18" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="32" cy="32" r="2" fill={stroke} />
          <circle cx="44" cy="32" r="2" fill={stroke} />
          <path d="M36 38 Q38 40 40 38" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d="M22 32 L14 30 M22 36 L14 38" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
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
          <path d="M104 56 Q116 36 108 24" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <ellipse cx="72" cy="62" rx="32" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d="M22 38 L28 28 L36 38 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M40 38 L46 28 L54 38 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <ellipse cx="38" cy="48" rx="18" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx="32" cy="48" r="2" fill={stroke} />
          <circle cx="44" cy="48" r="2" fill={stroke} />
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
        {/* Tail curling up at the back */}
        <path d="M118 38 Q128 18 122 6" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        {/* Body stretches out */}
        <g transform={`translate(80 44) scale(${stretchX} 1) translate(-80 -44)`}>
          <ellipse cx="80" cy="44" rx="36" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        </g>
        {/* Ears + head on top so the face is always visible */}
        <path d="M14 30 L20 20 L28 30 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M30 30 L36 20 L42 30 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <ellipse cx="28" cy="40" rx="20" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        <circle cx="22" cy="40" r="2" fill={stroke} />
        <circle cx="34" cy="40" r="2" fill={stroke} />
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
