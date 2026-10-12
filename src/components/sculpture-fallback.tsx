export function SculptureFallback() {
  return (
    <svg
      className="sculpture-fallback"
      viewBox="0 0 600 600"
      role="img"
      aria-label="An abstract interlocking metallic sculpture"
    >
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e9eddd" />
          <stop offset=".16" stopColor="#7b8173" />
          <stop offset=".32" stopColor="#272b24" />
          <stop offset=".49" stopColor="#c5ceaf" />
          <stop offset=".58" stopColor="#f7faec" />
          <stop offset=".74" stopColor="#414a34" />
          <stop offset="1" stopColor="#9fa98d" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="20" stdDeviation="18" floodOpacity=".4" />
        </filter>
      </defs>
      <g
        fill="none"
        stroke="url(#metal)"
        strokeWidth="70"
        filter="url(#shadow)"
        transform="translate(300 300) rotate(-28)"
      >
        <ellipse rx="166" ry="92" transform="rotate(20)" />
        <ellipse rx="166" ry="92" transform="rotate(80)" />
        <ellipse rx="166" ry="92" transform="rotate(140)" />
      </g>
    </svg>
  );
}
