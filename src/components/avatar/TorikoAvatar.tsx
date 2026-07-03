import { TORIKO_CHARACTERS, TorikoCharacter } from './characterData';

interface TorikoAvatarProps {
  character: TorikoCharacter;
  size?: number;
  isAnimated?: boolean;
  className?: string;
}

export function TorikoAvatar({
  character,
  size = 160,
  isAnimated = true,
  className = ''
}: TorikoAvatarProps) {
  const data = TORIKO_CHARACTERS[character];
  const scale = size / 200;
  const animationClass = isAnimated ? 'animate-pulse' : '';

  const renderToriko = () => (
    <>
      {/* Spiky blue hair */}
      <path d="M60 50 L50 20 L70 25 L90 15 L110 25 L130 20 L140 50" fill={data.colors.hair} />
      <path d="M70 25 L75 40 L90 15 L95 35" fill="#4169E1" />
      <path d="M110 25 L105 40 L90 15 L85 35" fill="#4169E1" />
      {/* Head */}
      <ellipse cx="100" cy="80" rx="45" ry="50" fill={data.colors.skin} />
      {/* Eyes */}
      <ellipse cx="80" cy="75" rx="12" ry="15" fill="white" />
      <ellipse cx="120" cy="75" rx="12" ry="15" fill="white" />
      <circle cx="82" cy="75" r="8" fill={data.colors.eyes} />
      <circle cx="122" cy="75" r="8" fill={data.colors.eyes} />
      <circle cx="84" cy="72" r="3" fill="white" />
      <circle cx="124" cy="72" r="3" fill="white" />
      {/* Confident grin */}
      <path d="M85 100 Q100 115 115 100" fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
      {/* Red vest */}
      <path d="M55 120 L145 120 L155 180 L45 180 Z" fill={data.colors.outfit} />
    </>
  );

  const renderKomatsu = () => (
    <>
      {/* Chef hat */}
      <ellipse cx="100" cy="35" rx="35" ry="25" fill={data.colors.outfit} />
      <rect x="85" y="35" width="30" height="20" fill={data.colors.outfit} />
      {/* Short brown hair */}
      <path d="M65 55 Q100 45 135 55 L130 65 L70 65 Z" fill={data.colors.hair} />
      {/* Round face */}
      <ellipse cx="100" cy="85" rx="40" ry="45" fill={data.colors.skin} />
      {/* Gentle eyes */}
      <ellipse cx="82" cy="80" rx="10" ry="12" fill="white" />
      <ellipse cx="118" cy="80" rx="10" ry="12" fill="white" />
      <circle cx="84" cy="80" r="6" fill={data.colors.eyes} />
      <circle cx="120" cy="80" r="6" fill={data.colors.eyes} />
      <circle cx="86" cy="77" r="2" fill="white" />
      <circle cx="122" cy="77" r="2" fill="white" />
      {/* Gentle smile */}
      <path d="M90 105 Q100 110 110 105" fill="none" stroke="#CD853F" strokeWidth="2" strokeLinecap="round" />
      {/* White outfit */}
      <path d="M60 125 L140 125 L150 180 L50 180 Z" fill={data.colors.outfit} />
    </>
  );

  const renderSunny = () => (
    <>
      {/* Flowing pink hair */}
      <path d="M50 40 Q70 20 100 25 Q130 20 150 40 L145 70 Q100 50 55 70 Z" fill={data.colors.hair} />
      <path d="M45 70 Q60 60 80 75 Q100 55 120 75 Q140 60 155 70" fill={data.colors.hair} />
      {/* Beautiful face */}
      <ellipse cx="100" cy="90" rx="42" ry="48" fill={data.colors.skin} />
      {/* Large eyes */}
      <ellipse cx="80" cy="85" rx="14" ry="18" fill="white" />
      <ellipse cx="120" cy="85" rx="14" ry="18" fill="white" />
      <circle cx="82" cy="85" r="10" fill={data.colors.eyes} />
      <circle cx="122" cy="85" r="10" fill={data.colors.eyes} />
      <circle cx="85" cy="82" r="4" fill="white" />
      <circle cx="125" cy="82" r="4" fill="white" />
      {/* Narcissistic smile */}
      <path d="M85 115 Q100 125 115 115" fill="none" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round" />
      {/* Rainbow aura */}
      <circle cx="100" cy="100" r="70" fill="none" stroke="url(#rainbow)" strokeWidth="4" opacity="0.5" />
      <defs>
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF0000" />
          <stop offset="20%" stopColor="#FF7F00" />
          <stop offset="40%" stopColor="#FFFF00" />
          <stop offset="60%" stopColor="#00FF00" />
          <stop offset="80%" stopColor="#0000FF" />
          <stop offset="100%" stopColor="#8B00FF" />
        </linearGradient>
      </defs>
      {/* Pink outfit */}
      <path d="M58 130 L142 130 L152 180 L48 180 Z" fill={data.colors.outfit} />
    </>
  );

  const renderZebra = () => (
    <>
      {/* Bald head */}
      <ellipse cx="100" cy="80" rx="48" ry="52" fill={data.colors.skin} />
      {/* Scars */}
      <path d="M70 60 L85 75" stroke={data.colors.accent} strokeWidth="3" />
      <path d="M130 65 L115 80" stroke={data.colors.accent} strokeWidth="3" />
      <path d="M75 90 L90 100" stroke={data.colors.accent} strokeWidth="2" />
      {/* Aggressive eyes */}
      <ellipse cx="80" cy="75" rx="10" ry="8" fill="white" />
      <ellipse cx="120" cy="75" rx="10" ry="8" fill="white" />
      <circle cx="82" cy="75" r="6" fill={data.colors.eyes} />
      <circle cx="122" cy="75" r="6" fill={data.colors.eyes} />
      {/* Aggressive expression */}
      <path d="M70 70 L90 72" stroke="#000" strokeWidth="2" />
      <path d="M130 70 L110 72" stroke="#000" strokeWidth="2" />
      <path d="M85 105 Q100 100 115 105" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
      {/* Black outfit */}
      <path d="M52 125 L148 125 L158 180 L42 180 Z" fill={data.colors.outfit} />
    </>
  );

  const renderCoco = () => (
    <>
      {/* Green hair */}
      <path d="M55 45 Q100 30 145 45 L140 65 Q100 50 60 65 Z" fill={data.colors.hair} />
      <path d="M60 65 Q80 55 100 65 Q120 55 140 65" fill={data.colors.hair} />
      {/* Calm face */}
      <ellipse cx="100" cy="90" rx="42" ry="48" fill={data.colors.skin} />
      {/* Calm eyes */}
      <ellipse cx="82" cy="85" rx="11" ry="14" fill="white" />
      <ellipse cx="118" cy="85" rx="11" ry="14" fill="white" />
      <circle cx="84" cy="85" r="7" fill={data.colors.eyes} />
      <circle cx="120" cy="85" r="7" fill={data.colors.eyes} />
      <circle cx="86" cy="82" r="3" fill="white" />
      <circle cx="122" cy="82" r="3" fill="white" />
      {/* Mysterious smile */}
      <path d="M90 110 Q100 115 110 110" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
      {/* Poison droplets */}
      <circle cx="50" cy="60" r="5" fill={data.colors.accent} opacity="0.6" />
      <circle cx="150" cy="70" r="4" fill={data.colors.accent} opacity="0.6" />
      <circle cx="45" cy="100" r="3" fill={data.colors.accent} opacity="0.6" />
      {/* Purple cloak */}
      <path d="M55 130 L145 130 L155 180 L45 180 Z" fill={data.colors.outfit} />
    </>
  );

  const renderCharacter = () => {
    switch (character) {
      case 'toriko': return renderToriko();
      case 'komatsu': return renderKomatsu();
      case 'sunny': return renderSunny();
      case 'zebra': return renderZebra();
      case 'coco': return renderCoco();
      default: return renderToriko();
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`${animationClass} ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      {renderCharacter()}
    </svg>
  );
}
