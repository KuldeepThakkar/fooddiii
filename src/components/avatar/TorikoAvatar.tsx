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
      <path d="M55 45 L45 15 L70 20 L90 10 L110 20 L135 15 L145 45" fill={data.colors.hair} />
      <path d="M65 20 L75 35 L90 10 L95 30" fill="#4169E1" />
      <path d="M115 20 L105 35 L90 10 L85 30" fill="#4169E1" />
      {/* Head */}
      <ellipse cx="100" cy="75" rx="45" ry="50" fill={data.colors.skin} />
      {/* Eyes */}
      <ellipse cx="80" cy="70" rx="12" ry="15" fill="white" />
      <ellipse cx="120" cy="70" rx="12" ry="15" fill="white" />
      <circle cx="82" cy="70" r="8" fill={data.colors.eyes} />
      <circle cx="122" cy="70" r="8" fill={data.colors.eyes} />
      <circle cx="84" cy="67" r="3" fill="white" />
      <circle cx="124" cy="67" r="3" fill="white" />
      {/* Confident grin */}
      <path d="M85 95 Q100 110 115 95" fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
      {/* Red vest */}
      <path d="M55 115 L145 115 L155 180 L45 180 Z" fill={data.colors.outfit} />
    </>
  );

  const renderKomatsu = () => (
    <>
      {/* Chef hat */}
      <ellipse cx="100" cy="30" rx="35" ry="25" fill={data.colors.outfit} />
      <rect x="85" y="30" width="30" height="20" fill={data.colors.outfit} />
      {/* Short brown hair */}
      <path d="M65 50 Q100 40 135 50 L130 60 L70 60 Z" fill={data.colors.hair} />
      {/* Round face */}
      <ellipse cx="100" cy="80" rx="40" ry="45" fill={data.colors.skin} />
      {/* Gentle eyes */}
      <ellipse cx="82" cy="75" rx="10" ry="12" fill="white" />
      <ellipse cx="118" cy="75" rx="10" ry="12" fill="white" />
      <circle cx="84" cy="75" r="6" fill={data.colors.eyes} />
      <circle cx="120" cy="75" r="6" fill={data.colors.eyes} />
      <circle cx="86" cy="72" r="2" fill="white" />
      <circle cx="122" cy="72" r="2" fill="white" />
      {/* Gentle smile */}
      <path d="M90 100 Q100 105 110 100" fill="none" stroke="#CD853F" strokeWidth="2" strokeLinecap="round" />
      {/* White outfit */}
      <path d="M60 120 L140 120 L150 180 L50 180 Z" fill={data.colors.outfit} />
    </>
  );

  const renderSunny = () => (
    <>
      {/* Flowing pink hair */}
      <path d="M45 35 Q65 15 100 20 Q135 15 155 35 L150 65 Q100 45 50 65 Z" fill={data.colors.hair} />
      <path d="M40 65 Q55 55 75 70 Q100 50 125 70 Q145 55 160 65" fill={data.colors.hair} />
      {/* Beautiful face */}
      <ellipse cx="100" cy="85" rx="42" ry="48" fill={data.colors.skin} />
      {/* Large eyes */}
      <ellipse cx="80" cy="80" rx="14" ry="18" fill="white" />
      <ellipse cx="120" cy="80" rx="14" ry="18" fill="white" />
      <circle cx="82" cy="80" r="10" fill={data.colors.eyes} />
      <circle cx="122" cy="80" r="10" fill={data.colors.eyes} />
      <circle cx="85" cy="77" r="4" fill="white" />
      <circle cx="125" cy="77" r="4" fill="white" />
      {/* Narcissistic smile */}
      <path d="M85 110 Q100 120 115 110" fill="none" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round" />
      {/* Rainbow aura */}
      <circle cx="100" cy="95" r="70" fill="none" stroke="url(#rainbow)" strokeWidth="4" opacity="0.5" />
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
      <path d="M55 125 L145 125 L155 180 L45 180 Z" fill={data.colors.outfit} />
    </>
  );

  const renderZebra = () => (
    <>
      {/* Bald head */}
      <ellipse cx="100" cy="75" rx="48" ry="52" fill={data.colors.skin} />
      {/* Scars */}
      <path d="M70 55 L85 70" stroke={data.colors.accent} strokeWidth="3" />
      <path d="M130 60 L115 75" stroke={data.colors.accent} strokeWidth="3" />
      <path d="M75 85 L90 95" stroke={data.colors.accent} strokeWidth="2" />
      {/* Aggressive eyes */}
      <ellipse cx="80" cy="70" rx="10" ry="8" fill="white" />
      <ellipse cx="120" cy="70" rx="10" ry="8" fill="white" />
      <circle cx="82" cy="70" r="6" fill={data.colors.eyes} />
      <circle cx="122" cy="70" r="6" fill={data.colors.eyes} />
      {/* Aggressive expression */}
      <path d="M70 65 L90 67" stroke="#000" strokeWidth="2" />
      <path d="M130 65 L110 67" stroke="#000" strokeWidth="2" />
      <path d="M85 100 Q100 95 115 100" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
      {/* Black outfit */}
      <path d="M52 120 L148 120 L158 180 L42 180 Z" fill={data.colors.outfit} />
    </>
  );

  const renderCoco = () => (
    <>
      {/* Green hair */}
      <path d="M50 40 Q100 25 150 40 L145 60 Q100 45 55 60 Z" fill={data.colors.hair} />
      <path d="M55 60 Q75 50 100 60 Q125 50 145 60" fill={data.colors.hair} />
      {/* Calm face */}
      <ellipse cx="100" cy="85" rx="42" ry="48" fill={data.colors.skin} />
      {/* Calm eyes */}
      <ellipse cx="82" cy="80" rx="11" ry="14" fill="white" />
      <ellipse cx="118" cy="80" rx="11" ry="14" fill="white" />
      <circle cx="84" cy="80" r="7" fill={data.colors.eyes} />
      <circle cx="120" cy="80" r="7" fill={data.colors.eyes} />
      <circle cx="86" cy="77" r="3" fill="white" />
      <circle cx="122" cy="77" r="3" fill="white" />
      {/* Mysterious smile */}
      <path d="M90 105 Q100 110 110 105" fill="none" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
      {/* Poison droplets */}
      <circle cx="45" cy="55" r="5" fill={data.colors.accent} opacity="0.6" />
      <circle cx="155" cy="65" r="4" fill={data.colors.accent} opacity="0.6" />
      <circle cx="40" cy="95" r="3" fill={data.colors.accent} opacity="0.6" />
      {/* Purple cloak */}
      <path d="M55 125 L145 125 L155 180 L45 180 Z" fill={data.colors.outfit} />
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
