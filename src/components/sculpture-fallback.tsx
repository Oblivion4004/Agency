import { useId } from "react";
export function SculptureFallback({ color = "#ff9669" }: { color?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="sculpture-fallback coffee-fallback"
      viewBox="0 0 600 600"
      role="img"
      aria-label="A floating ceramic coffee cup with latte art and a smile"
    >
      <defs>
        <linearGradient id={`${id}-cup`} x1="0" y1="0" x2="1" y2=".5">
          <stop stopColor={color} />
          <stop offset=".45" stopColor={color} />
          <stop offset="1" stopColor="#935c70" />
        </linearGradient>
        <linearGradient id={`${id}-saucer`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#e2d8ff" />
          <stop offset="1" stopColor="#8e74c5" />
        </linearGradient>
        <filter id={`${id}-shadow`}>
          <feDropShadow
            dx="0"
            dy="18"
            stdDeviation="15"
            floodColor="#080510"
            floodOpacity=".3"
          />
        </filter>
      </defs>
      <ellipse cx="304" cy="479" rx="137" ry="20" fill="#000" opacity=".2" />
      <g transform="rotate(-12 300 300)" filter={`url(#${id}-shadow)`}>
        <ellipse
          cx="296"
          cy="438"
          rx="173"
          ry="49"
          fill={`url(#${id}-saucer)`}
        />
        <ellipse cx="296" cy="427" rx="161" ry="37" fill="#d8c8ff" />
        <ellipse cx="296" cy="429" rx="99" ry="24" fill="#b5a0e1" />
        <path
          d="M412 246 C519 209 520 365 410 366"
          fill="none"
          stroke={color}
          strokeWidth="38"
        />
        <path
          d="M420 258 C487 245 485 338 420 345"
          fill="none"
          stroke="#ffe1bd"
          strokeWidth="6"
          opacity=".7"
        />
        <path
          d="M165 228 L187 372 C199 442 396 448 411 372 L436 228Z"
          fill={`url(#${id}-cup)`}
        />
        <ellipse cx="300" cy="228" rx="136" ry="53" fill="#ffe3c3" />
        <ellipse cx="300" cy="227" rx="118" ry="41" fill="#723b22" />
        <ellipse cx="300" cy="224" rx="110" ry="34" fill="#b97c4c" />
        <path
          d="M300 240 C224 207 271 188 300 218 C328 187 378 210 300 240"
          fill="#fff0cd"
        />
        <path d="M300 239 L300 202" stroke="#fff0cd" strokeWidth="3" />
        <g fill="#3c2929">
          <ellipse cx="265" cy="315" rx="9" ry="13" />
          <ellipse cx="326" cy="315" rx="9" ry="13" />
        </g>
        <path
          d="M265 348 Q296 383 330 348"
          fill="none"
          stroke="#3c2929"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M198 272 L210 351"
          stroke="#fff1d3"
          strokeWidth="9"
          opacity=".22"
          strokeLinecap="round"
        />
      </g>
      <g
        fill="none"
        stroke="#e6d7ff"
        strokeWidth="7"
        strokeLinecap="round"
        opacity=".6"
      >
        <path d="M255 169 C225 141 281 125 260 98" />
        <path d="M307 151 C280 123 337 108 316 77" />
        <path d="M356 168 C331 143 378 127 366 105" />
      </g>
    </svg>
  );
}
