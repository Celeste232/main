/**
 * Cute SVG cat house: pitched roof, chimney, arched door, paw-shaped icon.
 */
export function HouseSvg() {
  const stroke = '#222';
  // 50% thicker than before (2.5 → 3.75) to match the bolder cat lines.
  const sw = 3.75;
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
      {/* Doodle fish nameplate — sits between the roof and the door so it
          reads as a sign mounted on the wall. Sized up for legibility. */}
      <g transform="translate(60 56)">
        {/* Body */}
        <path
          d="M-14 0 Q-9 -9 3 -9 Q15 -9 18 0 Q15 9 3 9 Q-9 9 -14 0 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        {/* Tail */}
        <path
          d="M18 0 L26 -7 L26 7 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        {/* Eye */}
        <circle cx="-5" cy="-1.5" r="1.6" fill={stroke} />
        {/* Smile */}
        <path d="M-10 3 Q-7 6 -4 3" stroke={stroke} strokeWidth={2.1} fill="none" strokeLinecap="round" />
        {/* Gill */}
        <path d="M7 -4 Q5 0 7 4" stroke={stroke} strokeWidth={2.1} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
