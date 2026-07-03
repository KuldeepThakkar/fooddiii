interface CatAvatarProps {
  furColor?: string;
  eyeColor?: string;
  accessory?: string;
  size?: number;
}

const DEFAULT_PROPS = {
  furColor: '#1A1A1A',
  eyeColor: '#FFD700',
  accessory: 'none' as const,
  size: 120,
};

export function CatAvatar({
  furColor = DEFAULT_PROPS.furColor,
  eyeColor = DEFAULT_PROPS.eyeColor,
  accessory = DEFAULT_PROPS.accessory,
  size = DEFAULT_PROPS.size,
}: CatAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className="transition-[transform,fill] duration-200"
    >
      <defs>
        <radialGradient id="furShine" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <path d="M 25 45 L 10 15 L 40 35" fill={furColor} stroke="#000" strokeWidth="2" />
      <path d="M 25 40 L 15 20 L 35 35" fill="#FFB6C1" stroke="none" />
      <path d="M 95 45 L 110 15 L 80 35" fill={furColor} stroke="#000" strokeWidth="2" />
      <path d="M 95 40 L 105 20 L 85 35" fill="#FFB6C1" stroke="none" />

      {/* Head */}
      <circle cx="60" cy="65" r="35" fill={furColor} stroke="#000" strokeWidth="2" />
      <circle cx="60" cy="65" r="35" fill="url(#furShine)" />

      {/* Eyes */}
      <circle cx="45" cy="60" r="8" fill={eyeColor} stroke="#000" strokeWidth="1" />
      <circle cx="75" cy="60" r="8" fill={eyeColor} stroke="#000" strokeWidth="1" />
      <circle cx="45" cy="60" r="3" fill="#000" />
      <circle cx="75" cy="60" r="3" fill="#000" />
      <circle cx="43" cy="58" r="1.5" fill="white" opacity="0.8" />
      <circle cx="73" cy="58" r="1.5" fill="white" opacity="0.8" />

      {/* Nose */}
      <path d="M 57 72 L 63 72 L 60 78 Z" fill="#FFB6C1" stroke="#000" strokeWidth="1" />

      {/* Mouth */}
      <path d="M 60 78 Q 55 85 50 82" fill="none" stroke="#000" strokeWidth="1.5" />
      <path d="M 60 78 Q 65 85 70 82" fill="none" stroke="#000" strokeWidth="1.5" />

      {/* Whiskers */}
      <line x1="25" y1="70" x2="45" y2="72" stroke="#FFF" strokeWidth="1.5" />
      <line x1="25" y1="75" x2="45" y2="75" stroke="#FFF" strokeWidth="1.5" />
      <line x1="25" y1="80" x2="45" y2="78" stroke="#FFF" strokeWidth="1.5" />
      <line x1="95" y1="70" x2="75" y2="72" stroke="#FFF" strokeWidth="1.5" />
      <line x1="95" y1="75" x2="75" y2="75" stroke="#FFF" strokeWidth="1.5" />
      <line x1="95" y1="80" x2="75" y2="78" stroke="#FFF" strokeWidth="1.5" />

      {/* Accessories */}
      {accessory === 'bow' && (
        <g>
          <ellipse cx="60" cy="50" rx="8" ry="5" fill="#FF6B6B" stroke="#E05555" strokeWidth="1" />
          <circle cx="60" cy="50" r="3" fill="#E05555" />
          <ellipse cx="50" cy="50" rx="7" ry="4" fill="#FF6B6B" stroke="#E05555" strokeWidth="0.5" />
          <ellipse cx="70" cy="50" rx="7" ry="4" fill="#FF6B6B" stroke="#E05555" strokeWidth="0.5" />
        </g>
      )}
      {accessory === 'glasses' && (
        <g>
          <circle cx="45" cy="60" r="10" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="75" cy="60" r="10" fill="none" stroke="#333" strokeWidth="2" />
          <line x1="55" y1="60" x2="65" y2="60" stroke="#333" strokeWidth="2" />
          <line x1="35" y1="60" x2="25" y2="58" stroke="#333" strokeWidth="1.5" />
          <line x1="85" y1="60" x2="95" y2="58" stroke="#333" strokeWidth="1.5" />
        </g>
      )}
      {accessory === 'shades' && (
        <g>
          <ellipse cx="45" cy="60" rx="12" ry="8" fill="#1A1A1A" stroke="#333" strokeWidth="1.5" />
          <ellipse cx="75" cy="60" rx="12" ry="8" fill="#1A1A1A" stroke="#333" strokeWidth="1.5" />
          <line x1="57" y1="60" x2="63" y2="60" stroke="#333" strokeWidth="2" />
          <line x1="33" y1="58" x2="25" y2="56" stroke="#333" strokeWidth="1.5" />
          <line x1="87" y1="58" x2="95" y2="56" stroke="#333" strokeWidth="1.5" />
          <ellipse cx="43" cy="58" rx="4" ry="2" fill="white" opacity="0.15" />
          <ellipse cx="73" cy="58" rx="4" ry="2" fill="white" opacity="0.15" />
        </g>
      )}
      {accessory === 'hat' && (
        <g>
          <ellipse cx="60" cy="32" rx="22" ry="6" fill="#4A4A4A" stroke="#333" strokeWidth="1" />
          <rect x="46" y="12" width="28" height="21" rx="3" fill="#4A4A4A" stroke="#333" strokeWidth="1" />
          <rect x="52" y="18" width="16" height="3" fill="#6B6B6B" rx="1" />
        </g>
      )}
      {accessory === 'crown' && (
        <g>
          <path d="M 38 35 L 45 18 L 55 30 L 60 12 L 65 30 L 75 18 L 82 35 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1.5" />
          <circle cx="45" cy="22" r="2" fill="#FF4444" />
          <circle cx="60" cy="16" r="2" fill="#4169E1" />
          <circle cx="75" cy="22" r="2" fill="#32CD32" />
          <rect x="38" y="33" width="44" height="4" rx="2" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
        </g>
      )}
      {accessory === 'scarf' && (
        <g>
          <path d="M 35 70 Q 40 78 60 80 Q 80 78 85 70" fill="none" stroke="#DC143C" strokeWidth="8" strokeLinecap="round" />
          <path d="M 55 78 Q 52 92 48 105" fill="none" stroke="#DC143C" strokeWidth="7" strokeLinecap="round" />
          <path d="M 35 70 Q 40 78 60 80 Q 80 78 85 70" fill="none" stroke="#FF6B6B" strokeWidth="4" strokeLinecap="round" />
          <line x1="48" y1="102" x2="48" y2="105" stroke="#DC143C" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {accessory === 'star' && (
        <g>
          <path d="M 60 15 L 64 28 L 78 28 L 67 36 L 71 50 L 60 42 L 49 50 L 53 36 L 42 28 L 56 28 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
          <path d="M 60 15 L 64 28 L 78 28 L 67 36 L 71 50 L 60 42 L 49 50 L 53 36 L 42 28 L 56 28 Z" fill="url(#furShine)" />
        </g>
      )}
    </svg>
  );
}
