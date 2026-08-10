export function Grassbot({
  size = 96,
  mood = 'idle',
  className = '',
}: {
  size?: number
  mood?: 'idle' | 'wave' | 'happy'
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`grassbot grassbot-${mood} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="gb-body" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#58c58a" />
          <stop offset="70%" stopColor="#29725f" />
          <stop offset="100%" stopColor="#1f5c4c" />
        </radialGradient>
        <radialGradient id="gb-blush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f0befa" />
          <stop offset="100%" stopColor="#f0befa" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* grass tufts */}
      <g fill="#29725f" className="grassbot-tufts">
        <path d="M20 30 C18 16 26 12 30 6 C31 14 32 18 38 24 C34 28 28 30 20 30 Z" />
        <path d="M62 18 C60 6 66 1 72 2 C71 12 74 14 80 18 C74 20 68 20 62 18 Z" />
        <path d="M84 22 C86 14 94 10 98 16 C96 22 92 26 84 22 Z" />
      </g>

      {/* blob body */}
      <path
        d="M50 12 C70 8 88 18 90 40 C92 62 80 86 50 92 C20 86 8 62 10 40 C12 18 30 8 50 12 Z"
        fill="url(#gb-body)"
      />

      {/* belly highlight */}
      <ellipse cx="50" cy="58" rx="28" ry="22" fill="#1c5c4c" opacity="0.25" />

      {/* eyes */}
      <g fill="#0f2020">
        <circle cx="36" cy="46" r="4.5" />
        <circle cx="64" cy="46" r="4.5" />
      </g>
      <g fill="#ffffff">
        <circle cx="37.5" cy="44" r="1.6" />
        <circle cx="65.5" cy="44" r="1.6" />
      </g>

      {/* blush */}
      <ellipse cx="26" cy="52" rx="6" ry="4" fill="url(#gb-blush)" />
      <ellipse cx="74" cy="52" rx="6" ry="4" fill="url(#gb-blush)" />

      {/* mouth */}
      {mood === 'happy' ? (
        <path
          d="M38 54 Q50 66 62 54"
          fill="none"
          stroke="#0f2020"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : (
        <path d="M42 55 Q50 51 58 55" fill="none" stroke="#0f2020" strokeWidth="3" strokeLinecap="round" />
      )}

      {/* waving arm */}
      {mood === 'wave' && (
        <g className="grassbot-arm" stroke="#29725f" strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M16 56 Q8 46 12 32" />
        </g>
      )}
    </svg>
  )
}