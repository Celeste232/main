/**
 * Cute SVG cat house: pitched roof, chimney, arched door, paw-shaped icon.
 */
export function HouseSvg() {
  const stroke = '#222';
  const sw = 2.5;
  const fill = '#fff';

  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      {/* Body */}
      <rect
        x="14"
        y="56"
        width="92"
        height="58"
        rx="6"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
      />
      {/* Roof */}
      <path
        d="M6 60 L60 16 L114 60 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      {/* Chimney */}
      <rect
        x="86"
        y="22"
        width="10"
        height="22"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
      />
      {/* Arched door */}
      <path
        d="M44 114 L44 90 Q60 76 76 90 L76 114"
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      {/* Cat icon above door (paw print style) */}
      <g transform="translate(60 64)">
        <ellipse cx="0" cy="0" rx="9" ry="7" fill={fill} stroke={stroke} strokeWidth={sw} />
        <path d="M-7 -6 L-9 -10 L-5 -10 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M7 -6 L9 -10 L5 -10 Z" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      </g>
    </svg>
  );
}
