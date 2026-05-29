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
      {/* Doodle fish nameplate above the door */}
      <g transform="translate(60 64)">
        {/* Body */}
        <path
          d="M-10 0 Q-6 -6 2 -6 Q10 -6 12 0 Q10 6 2 6 Q-6 6 -10 0 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        {/* Tail */}
        <path
          d="M12 0 L18 -5 L18 5 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        {/* Eye */}
        <circle cx="-3" cy="-1" r="1.2" fill={stroke} />
        {/* Smile */}
        <path d="M-7 2 Q-5 4 -3 2" stroke={stroke} strokeWidth={1.2} fill="none" strokeLinecap="round" />
        {/* Gill */}
        <path d="M5 -3 Q3 0 5 3" stroke={stroke} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
