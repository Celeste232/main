interface BowlProps {
  /** 0..1, fraction of bowl content remaining */
  level: number;
  variant: 'food' | 'water';
}

/**
 * Oval bowl with a content layer that shrinks as level decreases.
 */
export function BowlSvg({ level, variant }: BowlProps) {
  const stroke = '#222';
  const sw = 2.5;
  const fill = '#fff';
  const clamped = Math.max(0, Math.min(1, level));

  return (
    <svg viewBox="0 0 80 64" width="100%" height="100%">
      {/* Bowl body */}
      <path
        d="M6 32 Q6 56 40 56 Q74 56 74 32 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      {/* Cat icon on the bowl */}
      <g transform="translate(40 46)">
        <ellipse cx="0" cy="0" rx="6" ry="4.5" fill={fill} stroke={stroke} strokeWidth={1.6} />
        <path d="M-5 -4 L-6 -7 L-3 -7 Z" fill={fill} stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M5 -4 L6 -7 L3 -7 Z" fill={fill} stroke={stroke} strokeWidth={1.6} strokeLinejoin="round" />
      </g>
      {/* Rim */}
      <ellipse cx="40" cy="32" rx="34" ry="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Content */}
      {clamped > 0 && variant === 'food' && (
        <FoodPellets level={clamped} />
      )}
      {clamped > 0 && variant === 'water' && (
        <WaterFill level={clamped} />
      )}
    </svg>
  );
}

function FoodPellets({ level }: { level: number }) {
  // Stack pellets in two rows; show fewer as level drops
  const all = [
    { cx: 18, cy: 28, r: 3 },
    { cx: 26, cy: 26, r: 3.2 },
    { cx: 34, cy: 24, r: 3 },
    { cx: 42, cy: 24, r: 3.4 },
    { cx: 50, cy: 26, r: 3 },
    { cx: 58, cy: 28, r: 3 },
    { cx: 22, cy: 32, r: 2.8 },
    { cx: 30, cy: 30, r: 3 },
    { cx: 38, cy: 28, r: 3 },
    { cx: 46, cy: 28, r: 3 },
    { cx: 54, cy: 30, r: 3 },
    { cx: 62, cy: 32, r: 2.8 },
  ];
  const visible = Math.ceil(all.length * level);
  return (
    <g>
      {all.slice(0, visible).map((p, i) => (
        <circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill="#d9b97a"
          stroke="#222"
          strokeWidth={1.4}
        />
      ))}
    </g>
  );
}

function WaterFill({ level }: { level: number }) {
  const top = 32 - level * 4;
  return (
    <g>
      <ellipse cx="40" cy={top} rx="30" ry="3.5" fill="rgba(120,180,230,0.85)" stroke="#6aa8d8" strokeWidth={1.6} />
      <path d="M40 28 L37 34 Q40 36 43 34 Z" fill="#6aa8d8" />
    </g>
  );
}
