import { ANIME_CHARACTERS } from './characterData';
import { ANIME_BG_COLORS } from '../profile/AvatarCustomizer';
import { Check } from 'lucide-react';

interface AnimeSelectorProps {
  selectedCharacter?: string;
  selectedBgColor?: string;
  onCharacterChange: (character: string) => void;
  onBgColorChange: (color: string) => void;
}

export function AnimeSelector({
  selectedCharacter = 'toriko',
  selectedBgColor = '#DC143C',
  onCharacterChange,
  onBgColorChange,
}: AnimeSelectorProps) {
  const selectedChar = ANIME_CHARACTERS.find(c => c.id === selectedCharacter) || ANIME_CHARACTERS[0];

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="flex justify-center">
        <div
          className="rounded-full p-2 transition-colors duration-200"
          style={{ backgroundColor: selectedBgColor }}
        >
          <div
            className="rounded-full overflow-hidden ring-4 ring-white shadow-lg w-24 h-24"
          >
            <img
              src={selectedChar.image}
              alt={selectedChar.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Character Grid */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Choose Your Gourmet Hunter
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ANIME_CHARACTERS.map((char) => {
            const isSelected = selectedCharacter === char.id;
            return (
              <button
                key={char.id}
                onClick={() => onCharacterChange(char.id)}
                className="relative flex flex-col items-center p-2 rounded-2xl border-2 transition-all focus:outline-none"
                style={{
                  borderColor: isSelected ? char.accentColor : 'transparent',
                  boxShadow: isSelected ? `0 0 20px ${char.accentColor}40` : 'none',
                }}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-700 mt-1">
                  {char.name}
                </span>
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: char.accentColor }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Background Color
        </label>
        <div className="flex flex-wrap gap-2">
          {ANIME_BG_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onBgColorChange(color.value)}
              className={`w-10 h-10 rounded-full border-4 transition-all ${
                selectedBgColor === color.value
                  ? 'border-[#004F30] scale-110 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
