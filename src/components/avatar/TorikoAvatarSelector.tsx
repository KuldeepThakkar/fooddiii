import { useState } from 'react';
import { TorikoAvatar } from './TorikoAvatar';
import { TORIKO_CHARACTERS, TorikoCharacter } from './characterData';
import { Check } from 'lucide-react';

interface TorikoAvatarSelectorProps {
  selectedCharacter?: TorikoCharacter;
  onSelect: (character: TorikoCharacter) => void;
}

export function TorikoAvatarSelector({ selectedCharacter = 'toriko', onSelect }: TorikoAvatarSelectorProps) {
  const [previewChar, setPreviewChar] = useState<TorikoCharacter>(selectedCharacter);

  const characters = Object.keys(TORIKO_CHARACTERS) as TorikoCharacter[];

  const handleSelect = (char: TorikoCharacter) => {
    setPreviewChar(char);
    onSelect(char);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-black text-slate-900 text-center">🍖 Choose Your Gourmet Hunter</h2>

      {/* Character Grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {characters.map((char) => {
          const data = TORIKO_CHARACTERS[char];
          const isSelected = previewChar === char;
          return (
            <button
              key={char}
              onClick={() => handleSelect(char)}
              className={`relative flex-shrink-0 rounded-2xl border-4 transition-all ${
                isSelected
                  ? 'border-[#004F30] ring-2 ring-offset-2 ring-white scale-110'
                  : 'border-slate-200 hover:scale-105'
              }`}
              style={{
                borderColor: isSelected ? data.colors.accent : undefined,
                boxShadow: isSelected ? `0 0 20px ${data.colors.accent}40` : undefined
              }}
            >
              <TorikoAvatar character={char} size={80} isAnimated={false} />
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#004F30] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <div className="flex flex-col items-center space-y-4 p-6 bg-slate-50 rounded-2xl">
        <TorikoAvatar character={previewChar} size={200} isAnimated={true} />
        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-900">{TORIKO_CHARACTERS[previewChar].name}</h3>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{TORIKO_CHARACTERS[previewChar].title}</p>
          <p className="text-lg text-[#004F30] font-semibold mt-1">"{TORIKO_CHARACTERS[previewChar].tagline}"</p>
        </div>
      </div>

      {/* Select Button */}
      <button
        onClick={() => onSelect(previewChar)}
        className="w-full py-4 rounded-2xl bg-[#004F30] text-white text-sm font-black hover:bg-[#005C39] transition-colors shadow-lg"
      >
        Select This Hunter
      </button>
    </div>
  );
}
