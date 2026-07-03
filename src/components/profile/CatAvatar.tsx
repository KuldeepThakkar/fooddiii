interface CatAvatarProps {
  furColor?: string;
  eyeColor?: string;
  accessory?: 'none' | 'bow' | 'glasses' | 'hat' | 'crown';
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
      className="transition-transform hover:scale-105"
    >
      {/* Ears */}
      <path
        d="M 25 45 L 10 15 L 40 35"
        fill={furColor}
        stroke="#000"
        strokeWidth="2"
      />
      <path
        d="M 25 40 L 15 20 L 35 35"
        fill="#FFB6C1"
        stroke="none"
      />
      <path
        d="M 95 45 L 110 15 L 80 35"
        fill={furColor}
        stroke="#000"
        strokeWidth="2"
      />
      <path
        d="M 95 40 L 105 20 L 85 35"
        fill="#FFB6C1"
        stroke="none"
      />

      {/* Head */}
      <circle
        cx="60"
        cy="65"
        r="35"
        fill={furColor}
        stroke="#000"
        strokeWidth="2"
      />

      {/* Eyes */}
      <circle cx="45" cy="60" r="8" fill={eyeColor} stroke="#000" strokeWidth="1" />
      <circle cx="75" cy="60" r="8" fill={eyeColor} stroke="#000" strokeWidth="1" />
      <circle cx="45" cy="60" r="3" fill="#000" />
      <circle cx="75" cy="60" r="3" fill="#000" />

      {/* Nose */}
      <path
        d="M 57 72 L 63 72 L 60 78 Z"
        fill="#FFB6C1"
        stroke="#000"
        strokeWidth="1"
      />

      {/* Mouth */}
      <path
        d="M 60 78 Q 55 85 50 82"
        fill="none"
        stroke="#000"
        strokeWidth="1.5"
        className="group-hover:stroke-[#004F30]"
      />
      <path
        d="M 60 78 Q 65 85 70 82"
        fill="none"
        stroke="#000"
        strokeWidth="1.5"
        className="group-hover:stroke-[#004F30]"
      />

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
          <ellipse cx="60" cy="50" rx="8" ry="5" fill="#FF6B6B" />
          <circle cx="60" cy="50" r="3" fill="#FF6B6B" />
          <ellipse cx="52" cy="50" rx="6" ry="4" fill="#FF6B6B" />
          <ellipse cx="68" cy="50" rx="6" ry="4" fill="#FF6B6B" />
        </g>
      )}
      {accessory === 'glasses' && (
        <g>
          <circle cx="45" cy="60" r="10" fill="none" stroke="#333" strokeWidth="2" />
          <circle cx="75" cy="60" r="10" fill="none" stroke="#333" strokeWidth="2" />
          <line x1="55" y1="60" x2="65" y2="60" stroke="#333" strokeWidth="2" />
        </g>
      )}
      {accessory === 'hat' && (
        <g>
          <ellipse cx="60" cy="32" rx="20" ry="5" fill="#4A4A4A" />
          <rect x="48" y="15" width="24" height="18" fill="#4A4A4A" />
        </g>
      )}
      {accessory === 'crown' && (
        <g>
          <path
            d="M 40 35 L 45 20 L 55 30 L 60 15 L 65 30 L 75 20 L 80 35 Z"
            fill="#FFD700"
            stroke="#DAA520"
            strokeWidth="1"
          />
        </g>
      )}
    </svg>
  );
}
