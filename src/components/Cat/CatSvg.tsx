import type { CatAction } from '../../state/useAppStore';

interface CatSvgProps {
  action: CatAction;
  frame: number;
}

const stroke = '#222';
const sw = 3.6;
const fill = '#fff';

/**
 * Multi-frame SVG cat. Each action has subtle per-frame transforms
 * (tail wag, breathing, leg cycle, etc) so animation works even
 * without PNG sprite frames.
 */
export function CatSvg({ action, frame }: CatSvgProps) {
  if (action === 'in-house') return <InHouseCat frame={frame} />;
  if (action === 'sleeping') return <SleepingCat frame={frame} />;
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
  if (action === 'superman') return <SupermanCat frame={frame} />;
  if (action === 'dangle') return <DangleCat frame={frame} />;
  if (action === 'climb') return <ClimbCat frame={frame} />;
  if (action === 'box') return <BoxCat frame={frame} />;
  if (action === 'zoomies') return <ZoomiesCat frame={frame} />;
  if (action === 'headbonk') return <HeadbonkCat frame={frame} />;
  if (action === 'peek') return <PeekCat frame={frame} />;
  if (action === 'napping') return <NappingCat frame={frame} />;
  if (action === 'knead') return <KneadCat frame={frame} />;
  if (action === 'sulk') return <SulkCat frame={frame} />;
  return <SittingCat frame={frame} />;
}

/* Cat peeking out of the house door — head + paws over an invisible sill.
   Sized so the head appears in the door opening when positioned at
   housePos + (20, 60). Sleepy half-closed eyes. */
function InHouseCat({ frame }: { frame: number }) {
  const blink = frame % 2 === 1;
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%">
      {/* Ears */}
      <path d="M28 36 L32 26 L38 36 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M42 36 L48 26 L52 36 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      {/* Head */}
      <ellipse cx="40" cy="46" rx="14" ry="13" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Closed/sleepy eyes */}
      {blink ? (
        <>
          <path d="M33 46 Q35 48 37 46" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d="M43 46 Q45 48 47 46" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="35" cy="46" r="1.6" fill={stroke} />
          <circle cx="45" cy="46" r="1.6" fill={stroke} />
        </>
      )}
      {/* Mouth */}
      <path d="M38 52 Q40 54 42 52" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      {/* Paws resting on the door edge */}
      <ellipse cx="33" cy="64" rx="4" ry="3" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="47" cy="64" rx="4" ry="3" fill={fill} stroke={stroke} strokeWidth={sw} />
    </svg>
  );
}

/* 엎드려 팔다리 쭉 — superman pose */
function SupermanCat({ frame }: { frame: number }) {
  const wiggle = frame % 2 === 0 ? 0 : 1;
  return (
    <svg viewBox="0 0 140 60" width="100%" height="100%">
      <g transform="translate(140 0) scale(-1 1)">
        {/* Tail straight back */}
        <line x1="2" y1="40" x2="14" y2="40" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* Body flat oval */}
        <ellipse cx="58" cy="40" rx="44" ry="10" fill={fill} stroke={stroke} strokeWidth={sw} />
        {/* Back legs stretching backward */}
        <line x1={28} y1="46" x2={14 + wiggle} y2="52" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1={28} y1="34" x2={14 + wiggle} y2="28" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* Front legs stretching forward */}
        <line x1={94} y1="42" x2={118 - wiggle} y2="46" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1={94} y1="38" x2={118 - wiggle} y2="34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* Ears */}
        <path d="M110 28 L116 18 L122 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M122 28 L128 18 L132 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        {/* Head on top of body */}
        <ellipse cx="120" cy="36" rx="14" ry="12" fill={fill} stroke={stroke} strokeWidth={sw} />
        <path d="M115 36 Q117 38 119 36" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M121 36 Q123 38 125 36" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M118 42 Q120 44 122 42" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* Hanging from an invisible ledge — paws gripping, body swinging */
function DangleCat({ frame }: { frame: number }) {
  const swing = [(-4), 0, 4][frame] ?? 0;
  return (
    <svg viewBox="0 0 80 110" width="100%" height="100%">
      {/* Invisible ledge line at the top */}
      <line x1="6" y1="10" x2="74" y2="10" stroke={stroke} strokeWidth={2.1} strokeDasharray="4 3" strokeLinecap="round" />
      <g transform={`translate(${swing} 0)`}>
        {/* Paws gripping the ledge */}
        <ellipse cx="28" cy="10" rx="5" ry="4" fill={fill} stroke={stroke} strokeWidth={sw} />
        <ellipse cx="52" cy="10" rx="5" ry="4" fill={fill} stroke={stroke} strokeWidth={sw} />
        {/* Front arms going up to paws */}
        <line x1="32" y1="14" x2="34" y2="36" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="48" y1="14" x2="46" y2="36" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* Body hanging */}
        <ellipse cx="40" cy="56" rx="20" ry="22" fill={fill} stroke={stroke} strokeWidth={sw} />
        {/* Ears */}
        <path d="M28 36 L32 26 L38 36 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M42 36 L48 26 L52 36 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        {/* Face wide-eyed */}
        <circle cx="34" cy="46" r="2.5" fill="none" stroke={stroke} strokeWidth={2.5} />
        <circle cx="46" cy="46" r="2.5" fill="none" stroke={stroke} strokeWidth={2.5} />
        <circle cx="34" cy="46" r="1" fill={stroke} />
        <circle cx="46" cy="46" r="1" fill={stroke} />
        <ellipse cx="40" cy="54" rx="2.5" ry="2" fill="#f08aa6" stroke={stroke} strokeWidth={2.5} />
        {/* Back legs dangling */}
        <line x1="32" y1="76" x2="28" y2="96" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="48" y1="76" x2="52" y2="96" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* Tail */}
        <path d="M58 70 Q70 78 66 92" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      </g>
      <text x="56" y="20" fontSize="11" fill={stroke}>!?</text>
    </svg>
  );
}

/* Climbing back up — body angled, paws reaching */
function ClimbCat({ frame }: { frame: number }) {
  const dy = [4, 0, -4][frame] ?? 0;
  return (
    <svg viewBox="0 0 100 110" width="100%" height="100%">
      <g transform={`translate(0 ${dy}) rotate(-10 50 60)`}>
        {/* Body */}
        <ellipse cx="50" cy="70" rx="20" ry="28" fill={fill} stroke={stroke} strokeWidth={sw} />
        {/* Tail */}
        <path d="M68 92 Q86 98 84 78" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        {/* Front paws reaching up */}
        <line x1="38" y1="48" x2="30" y2="22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="58" y1="48" x2="62" y2="20" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <ellipse cx="30" cy="20" rx="4" ry="3" fill={fill} stroke={stroke} strokeWidth={sw} />
        <ellipse cx="62" cy="18" rx="4" ry="3" fill={fill} stroke={stroke} strokeWidth={sw} />
        {/* Back paws pushing */}
        <line x1="42" y1="92" x2="38" y2="104" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="58" y1="92" x2="62" y2="104" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {/* Ears */}
        <path d="M36 42 L40 32 L46 42 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M50 42 L56 32 L60 42 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        {/* Head */}
        <ellipse cx="48" cy="50" rx="14" ry="12" fill={fill} stroke={stroke} strokeWidth={sw} />
        <circle cx="42" cy="50" r="2" fill={stroke} />
        <circle cx="52" cy="50" r="2" fill={stroke} />
        <ellipse cx="47" cy="56" rx="2" ry="1.5" fill="#f08aa6" stroke={stroke} strokeWidth={2.5} />
      </g>
      {/* Scratch marks on the wall — disappear when cat climbs above them */}
      {frame < 2 && (
        <>
          <path d="M22 88 L26 100" stroke={stroke} strokeWidth={2.0} strokeLinecap="round" />
          <path d="M28 88 L32 100" stroke={stroke} strokeWidth={2.0} strokeLinecap="round" />
          <path d="M70 90 L74 102" stroke={stroke} strokeWidth={2.0} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
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
          <ellipse cx="38" cy="46" rx="3" ry="2.5" fill="#f08aa6" stroke={stroke} strokeWidth={2.0} />
          {/* Paws flailing — splayed legs */}
          <line x1="56" y1="64" x2={50 + frame * 2} y2={78 + frame * 2} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="68" y1="64" x2={64 - frame * 2} y2={80} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="88" y1="64" x2={92 + frame} y2={80} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="100" y1="64" x2={106} y2={78 - frame} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </g>
      </g>
      {/* Skid lines under the back foot */}
      <path d="M30 84 L50 84 M58 86 L78 86" stroke={stroke} strokeWidth={2.3} fill="none" strokeLinecap="round" />
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
            stroke={stroke} strokeWidth={2.1} strokeLinecap="round" />
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
      <path d="M14 40 Q10 44 14 48" stroke={stroke} strokeWidth={2.3} fill="none" strokeLinecap="round" />
      <path d="M8 50 Q4 54 8 58" stroke={stroke} strokeWidth={2.3} fill="none" strokeLinecap="round" />
      <path d="M96 40 Q100 44 96 48" stroke={stroke} strokeWidth={2.3} fill="none" strokeLinecap="round" />
      <path d="M102 50 Q106 54 102 58" stroke={stroke} strokeWidth={2.3} fill="none" strokeLinecap="round" />
    </svg>
  );
}

function HappyCat({ frame }: { frame: number }) {
  // ^_^ eyes, slight tail swish, hearts
  const tail = frame % 2 === 0 ? -16 : 16;
  return (
    <svg viewBox="-7 5 127.9 100.6" width="100%" height="100%">
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
            fill="none" stroke={stroke} strokeWidth={2.3} strokeLinejoin="round" />
    </svg>
  );
}

function MeowCat({ frame }: { frame: number }) {
  // Mouth opening + sound waves
  const open = frame === 0 ? 0.3 : frame === 1 ? 1 : 0.6;
  const wave = frame === 1 ? 1 : 0;
  return (
    <svg viewBox="-3.9 5.6 127.9 100.6" width="100%" height="100%">
      <Ears />
      <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="22" ry="16" fill={fill} stroke={stroke} strokeWidth={sw} />
      <Face mouthOpen={open} />
      <Whiskers />
      {wave === 1 && (
        <>
          <path d="M86 44 Q94 48 86 52" stroke={stroke} strokeWidth={2.3} fill="none" strokeLinecap="round" />
          <path d="M92 38 Q104 48 92 58" stroke={stroke} strokeWidth={2.3} fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function FlopCat({ frame }: { frame: number }) {
  // Belly-up flop, paws in the air
  const wiggle = frame % 2 === 0 ? 0 : 2;
  return (
    // Cropped viewBox (was 140x80) so the cat fills the tile.
    <svg viewBox="-1.6 26.8 142.9 54.2" width="100%" height="100%">
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
      <circle cx="40" cy="48" r={wide} fill="none" stroke={stroke} strokeWidth={2.5} />
      <circle cx="60" cy="48" r={wide} fill="none" stroke={stroke} strokeWidth={2.5} />
      <circle cx="40" cy="48" r="1.4" fill={stroke} />
      <circle cx="60" cy="48" r="1.4" fill={stroke} />
      <ellipse cx="50" cy="58" rx="2" ry="2.5" fill="#f08aa6" stroke={stroke} strokeWidth={2.5} />
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
    <svg viewBox="8 15.5 129.8 61.9" width="100%" height="100%">
      {/* Body breathes vertically (not horizontally) so its left end never
          slides away from the head and opens a neck gap. */}
      <g transform={`translate(74 50) scale(1 ${breathe}) translate(-74 -50)`}>
        <ellipse cx="74" cy="50" rx="52" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
      </g>
      {/* Head overlapping the body's left bulk, vertically aligned with it */}
      <ellipse cx="32" cy="48" rx="16" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
      <path d="M20 36 L26 25 L33 37 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M33 37 L40 25 L45 37 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M27 48 Q30 51 33 48" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M37 48 Q40 51 43 48" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
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
      <path d="M30 52 L22 50 M30 56 L22 58" stroke={stroke} strokeWidth={2.1} strokeLinecap="round" />
      <path d="M70 52 L78 50 M70 56 L78 58" stroke={stroke} strokeWidth={2.1} strokeLinecap="round" />
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
        <ellipse cx="50" cy="58" rx={2 + mouthOpen * 3} ry={1 + mouthOpen * 3} fill="#f08aa6" stroke={stroke} strokeWidth={2.0} />
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
    <svg viewBox="-9.4 6 127.9 100.6" width="100%" height="100%">
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
    <svg viewBox="3.2 2.8 109.6 74.8" width="100%" height="100%">
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
          <path d="M22 32 L14 30 M22 36 L14 38" stroke={stroke} strokeWidth={2.1} strokeLinecap="round" />
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
    <svg viewBox="1 3.6 106.6 75.6" width="100%" height="100%">
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
    <svg viewBox="-12 4.6 127.9 100.6" width="100%" height="100%">
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
    <svg viewBox="-0.8 18.2 102.8 65.4" width="100%" height="100%">
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
        <path d="M-14 0 L-20 -2 M-14 4 L-20 6" stroke={stroke} strokeWidth={2.0} strokeLinecap="round" />
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
    <svg viewBox="-2.4 1.7 122 77.4" width="100%" height="100%">
      <g transform="translate(120 0) scale(-1 1)">
        <g transform={`translate(60 42) scale(1 ${breathe}) translate(-60 -42)`}>
          <ellipse cx="70" cy="42" rx="42" ry="22" fill={fill} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="28" cy="36" rx="20" ry="18" fill={fill} stroke={stroke} strokeWidth={sw} />
        </g>
        <path d="M16 26 L22 16 L30 26 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M30 28 L36 18 L42 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M22 36 Q24 38 26 36" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M30 38 Q32 40 34 38" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M14 40 L8 38 M14 44 L8 46" stroke={stroke} strokeWidth={2.1} strokeLinecap="round" />
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
    // Cropped viewBox (was 140x70) so the long stretch fills the tile.
    <svg viewBox="4.1 -8.7 122.5 81.2" width="100%" height="100%">
      <g transform="translate(140 0) scale(-1 1)">
        {/* Tail curling up at the back */}
        <path d="M118 38 Q128 18 122 6" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        {/* Body stretches out — anchored on its left edge so stretching never
            pulls it away from the head and opens a neck gap. */}
        <g transform={`translate(48 44) scale(${stretchX} 1) translate(-48 -44)`}>
          <ellipse cx="84" cy="44" rx="40" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
        </g>
        {/* Ears + head overlapping the body's left end (no neck gap) */}
        <path d="M28 30 L34 20 L42 30 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M44 30 L50 20 L56 30 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <ellipse cx="42" cy="42" rx="21" ry="15" fill={fill} stroke={stroke} strokeWidth={sw} />
        <circle cx="36" cy="42" r="2" fill={stroke} />
        <circle cx="48" cy="42" r="2" fill={stroke} />
      </g>
    </svg>
  );
}

function YawningCat({ frame }: { frame: number }) {
  const open = frame === 0 ? 1 : 0;
  return (
    <svg viewBox="-14 5.6 127.9 100.6" width="100%" height="100%">
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
    <svg viewBox="-14 5.6 127.9 100.6" width="100%" height="100%">
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
    <svg viewBox="-9.5 5.6 127.9 100.6" width="100%" height="100%">
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
    <svg viewBox="-12.1 3.9 127.9 100.6" width="100%" height="100%">
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

/* 상자 안 — only the head + ears poke out over a box rim. 발그림 box. */
function BoxCat({ frame }: { frame: number }) {
  const peek = frame % 2 === 0 ? 0 : -2;
  return (
    <svg viewBox="0.2 27.2 99.5 77.4" width="100%" height="100%">
      {/* Head poking up behind the box */}
      <g transform={`translate(0 ${peek})`}>
        <path d="M34 50 L40 38 L46 50 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M54 50 L60 38 L66 50 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <ellipse cx="50" cy="56" rx="20" ry="17" fill={fill} stroke={stroke} strokeWidth={sw} />
        <circle cx="43" cy="56" r="2.2" fill={stroke} />
        <circle cx="57" cy="56" r="2.2" fill={stroke} />
        <path d="M47 63 Q50 66 53 63" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M30 56 L20 54 M30 60 L20 62" stroke={stroke} strokeWidth={2.1} strokeLinecap="round" />
        <path d="M70 56 L80 54 M70 60 L80 62" stroke={stroke} strokeWidth={2.1} strokeLinecap="round" />
      </g>
      {/* Box in front — front face + flaps */}
      <path d="M20 64 L80 64 L84 96 L16 96 Z" fill="#fff" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M20 64 L8 56 M80 64 L92 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M8 56 L14 64 M92 56 L86 64" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      {/* tape seam */}
      <line x1="50" y1="64" x2="50" y2="96" stroke={stroke} strokeWidth={2.0} strokeDasharray="3 3" />
    </svg>
  );
}

/* 우다다 — zoomies. Streaking forward with motion lines, legs flung out. */
function ZoomiesCat({ frame }: { frame: number }) {
  const dash = frame % 2 === 0 ? 0 : 4;
  return (
    // Cropped viewBox (was 140x80) so the running cat fills the tile.
    <svg viewBox="-4 10.2 132.6 67.3" width="100%" height="100%">
      <g transform="translate(140 0) scale(-1 1)">
        {/* Tail streaming straight back */}
        <path d="M104 44 Q124 40 134 46" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        {/* Stretched body mid-run */}
        <ellipse cx="72" cy="46" rx="38" ry="12" fill={fill} stroke={stroke} strokeWidth={sw} />
        {/* Ears swept back */}
        <path d="M24 30 L26 20 L34 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M38 28 L42 18 L48 28 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        {/* Head leading */}
        <ellipse cx="36" cy="38" rx="17" ry="15" fill={fill} stroke={stroke} strokeWidth={sw} />
        <path d="M30 38 L34 40 M30 38 L34 36" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <ellipse cx="38" cy="44" rx="2.5" ry="2" fill="#f08aa6" stroke={stroke} strokeWidth={2.5} />
        {/* Legs flung — front reaching, back kicking */}
        <line x1="52" y1="56" x2={40 - dash} y2="68" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="58" y1="56" x2={48 - dash} y2="70" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="88" y1="56" x2={100 + dash} y2="66" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="94" y1="54" x2={106 + dash} y2="62" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </g>
      {/* Speed lines trailing behind (right side, since cat faces right) */}
      <path d="M4 36 L24 36 M2 46 L20 46 M6 56 L22 56" stroke={stroke} strokeWidth={2.3} fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 부비부비 — headbonk. Leans head to one side with affection hearts. */
function HeadbonkCat({ frame }: { frame: number }) {
  const lean = frame === 0 ? -10 : frame === 1 ? -16 : -10;
  return (
    <svg viewBox="-18.4 5.8 123 98.8" width="100%" height="100%">
      <ellipse cx="50" cy="82" rx="22" ry="15" fill={fill} stroke={stroke} strokeWidth={sw} />
      <g transform={`rotate(${lean} 50 66) translate(0 6)`}>
        <Ears />
        <ellipse cx="50" cy="48" rx="25" ry="25" fill={fill} stroke={stroke} strokeWidth={sw} />
        {/* happy closed ^_^ eyes */}
        <path d="M36 48 Q40 44 44 48" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M56 48 Q60 44 64 48" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M46 56 Q50 59 54 56" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <Whiskers />
      </g>
      {/* affection hearts drifting up on the lean side */}
      <path d="M22 26 q-2.5 -3 -5 0 q0 3 5 6 q5 -3 5 -6 q-2.5 -3 -5 0 Z"
            fill="none" stroke={stroke} strokeWidth={2.1} strokeLinejoin="round" />
      {frame === 1 && (
        <path d="M14 14 q-2 -2.5 -4 0 q0 2.5 4 5 q4 -2.5 4 -5 q-2 -2.5 -4 0 Z"
              fill="none" stroke={stroke} strokeWidth={1.9} strokeLinejoin="round" />
      )}
    </svg>
  );
}

/* 빼꼼 — peeking in from the left edge, only half the cat visible. */
function PeekCat({ frame }: { frame: number }) {
  const out = frame === 0 ? -6 : frame === 1 ? 0 : -3;
  return (
    <svg viewBox="-12.3 0 98.4 97.8" width="100%" height="100%">
      {/* Vertical edge the cat peeks around */}
      <line x1="14" y1="6" x2="14" y2="94" stroke={stroke} strokeWidth={2.3} strokeDasharray="5 4" />
      <g transform={`translate(${out} 0)`}>
        {/* Only the right half of the head clears the edge */}
        <path d="M30 40 L36 28 L42 40 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <ellipse cx="36" cy="50" rx="20" ry="18" fill={fill} stroke={stroke} strokeWidth={sw} />
        {/* one paw gripping the edge */}
        <ellipse cx="22" cy="66" rx="5" ry="4" fill={fill} stroke={stroke} strokeWidth={sw} />
        {/* eyes looking out (toward the right) */}
        <circle cx="34" cy="50" r="2.4" fill={stroke} />
        <circle cx="44" cy="50" r="2.4" fill={stroke} />
        <path d="M37 58 Q40 60 43 58" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        <path d="M52 48 L60 46 M52 52 L60 54" stroke={stroke} strokeWidth={2.1} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* 낮잠냥 — lying on its back, front paws folded on the belly, eyes closed.
   Gentle breathing + a drifting z. */
function NappingCat({ frame }: { frame: number }) {
  const breathe = frame % 2 === 0 ? 1 : 1.04;
  return (
    // Tight viewBox so the cat fills the tile instead of floating small in a
    // wide 140-box.
    <svg viewBox="0 2.1 129.5 71.2" width="100%" height="100%">
      {/* Body — long oval, belly up */}
      <g transform={`translate(66 48) scale(1 ${breathe}) translate(-66 -48)`}>
        <ellipse cx="66" cy="48" rx="50" ry="17" fill={fill} stroke={stroke} strokeWidth={sw} />
      </g>
      {/* Head at the left, tilted back asleep */}
      <ellipse cx="24" cy="44" rx="16" ry="15" fill={fill} stroke={stroke} strokeWidth={sw} />
      <path d="M12 36 L16 24 L22 36 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M24 36 L30 24 L34 36 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      {/* closed eyes (happy arcs) */}
      <path d="M16 44 Q19 47 22 44" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M27 44 Q30 47 33 44" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="51" rx="2.4" ry="1.8" fill="#f08aa6" stroke={stroke} strokeWidth={1.8} />
      {/* Front paws folded on the belly */}
      <ellipse cx="64" cy="36" rx="7" ry="5" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="78" cy="36" rx="7" ry="5" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Tail curling at the right */}
      <path d="M114 48 Q126 40 120 28" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      {/* drifting zzz */}
      <text x="42" y="16" fontSize="12" fill={stroke}>{frame === 0 ? 'z' : frame === 1 ? 'Z' : 'z'}</text>
    </svg>
  );
}

/* 꾹꾹이 — making biscuits. Sitting upright, both front paws push down
   alternately (knead). */
function KneadCat({ frame }: { frame: number }) {
  // Alternate paws up/down each frame
  const leftY = frame % 2 === 0 ? 0 : 6;
  const rightY = frame % 2 === 0 ? 6 : 0;
  return (
    <svg viewBox="-14 6.1 127.9 100.6" width="100%" height="100%">
      <Ears />
      <ellipse cx="50" cy="48" rx="26" ry="26" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="50" cy="78" rx="24" ry="17" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* content half-closed eyes */}
      <path d="M37 47 Q40 49 43 47" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M57 47 Q60 49 63 47" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <path d="M47 55 Q50 57 53 55" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      <Whiskers />
      {/* Front legs + paws kneading (push down alternately) */}
      <line x1="40" y1="72" x2="40" y2={84 - leftY} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="60" y1="72" x2="60" y2={84 - rightY} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <ellipse cx="40" cy={86 - leftY} rx="6" ry="4" fill={fill} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="60" cy={86 - rightY} rx="6" ry="4" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* little motion ticks above the lifted paw */}
      {leftY === 6 && <path d="M36 70 L40 66 L44 70" stroke={stroke} strokeWidth={2.1} fill="none" strokeLinecap="round" />}
      {rightY === 6 && <path d="M56 70 L60 66 L64 70" stroke={stroke} strokeWidth={2.1} fill="none" strokeLinecap="round" />}
    </svg>
  );
}

/* 뿌잉뿌잉 — sulking. Back turned to the viewer, tail flicking side to side. */
function SulkCat({ frame }: { frame: number }) {
  const tail = [(-18), 0, 18, 0][frame] ?? 0;
  return (
    <svg viewBox="-3 7.5 118 92.9" width="100%" height="100%">
      {/* Ears seen from behind */}
      <path d="M30 34 L36 22 L44 34 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M56 34 L64 22 L70 34 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      {/* Rounded back of the head (no face) */}
      <ellipse cx="50" cy="44" rx="24" ry="22" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Back/body as a big rounded hump */}
      <path d="M22 86 L22 64 Q22 44 50 44 Q78 44 78 64 L78 86 Z"
            fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      {/* faint spine line */}
      <path d="M50 46 L50 62" stroke={stroke} strokeWidth={2.1} strokeLinecap="round" />
      {/* Tail flicking at the base, off to one side */}
      <g transform={`rotate(${tail} 78 84)`}>
        <path d="M76 84 Q92 80 90 62" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
      </g>
      {/* hmph mark */}
      <text x="78" y="30" fontSize="13" fill={stroke}>{frame % 2 === 0 ? '흥' : ''}</text>
    </svg>
  );
}
