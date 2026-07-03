import { useState } from 'react';
import { CatAvatar } from './CatAvatar';
import { AnimeSelector } from '../avatar/AnimeSelector';
import { X, Save } from 'lucide-react';

interface AvatarCustomizerProps {
  initialType?: 'cat' | 'anime';
  initialFurColor?: string;
  initialEyeColor?: string;
  initialAccessory?: string;
  initialCharacter?: string;
  initialBgColor?: string;
  onSave: (config: {
    type: 'cat' | 'anime';
    furColor?: string;
    eyeColor?: string;
    accessory?: string;
    character?: string;
    bgColor?: string;
  }) => void;
  onClose: () => void;
}

export const CAT_FUR_COLORS = [
  { name: 'Black', value: '#1A1A1A' },
  { name: 'Orange', value: '#FF8C00' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Gray', value: '#808080' },
  { name: 'Brown', value: '#8B4513' },
  { name: 'Pink', value: '#FF69B4' },
  { name: 'Blue', value: '#4169E1' },
  { name: 'Green', value: '#228B22' },
];

export const CAT_EYE_COLORS = [
  { name: 'Yellow', value: '#FFD700' },
  { name: 'Blue', value: '#4169E1' },
  { name: 'Green', value: '#32CD32' },
  { name: 'Red', value: '#DC143C' },
  { name: 'Purple', value: '#9370DB' },
  { name: 'Pink', value: '#FF69B4' },
  { name: 'White', value: '#FFFFFF' },
];

export const CAT_ACCESSORIES = [
  { name: 'None', value: 'none', icon: '❌' },
  { name: 'Bow', value: 'bow', icon: '🎀' },
  { name: 'Shades', value: 'shades', icon: '🕶️' },
  { name: 'Hat', value: 'hat', icon: '🎩' },
  { name: 'Crown', value: 'crown', icon: '👑' },
  { name: 'Scarf', value: 'scarf', icon: '🧣' },
  { name: 'Star', value: 'star', icon: '⭐' },
];

export const ANIME_BG_COLORS = [
  { name: 'Red', value: '#DC143C' },
  { name: 'Blue', value: '#4169E1' },
  { name: 'Green', value: '#228B22' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Purple', value: '#4B0082' },
  { name: 'Black', value: '#1A1A1A' },
  { name: 'White', value: '#FFFFFF' },
];

export function AvatarCustomizer({
  initialType = 'cat',
  initialFurColor = '#1A1A1A',
  initialEyeColor = '#FFD700',
  initialAccessory = 'none',
  initialCharacter = 'toriko',
  initialBgColor = '#DC143C',
  onSave,
  onClose,
}: AvatarCustomizerProps) {
  const [tab, setTab] = useState<'cat' | 'anime'>(initialType);
  const [furColor, setFurColor] = useState(initialFurColor);
  const [eyeColor, setEyeColor] = useState(initialEyeColor);
  const [accessory, setAccessory] = useState(initialAccessory);
  const [character, setCharacter] = useState(initialCharacter);
  const [bgColor, setBgColor] = useState(initialBgColor);
  const [winking, setWinking] = useState(false);

  const handleSave = () => {
    if (tab === 'cat') {
      setWinking(true);
      setTimeout(() => setWinking(false), 400);
    }
    onSave({
      type: tab,
      furColor,
      eyeColor,
      accessory,
      character,
      bgColor,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">
            {tab === 'cat' ? '🐱 Customize Your Cat' : '🍖 Choose Your Hunter'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tab Switch */}
        <div className="flex mx-6 mt-2 bg-slate-100 rounded-2xl p-1">
          <button
            onClick={() => setTab('cat')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'cat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            😺 Cat
          </button>
          <button
            onClick={() => setTab('anime')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'anime' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🍖 Anime
          </button>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-6">
          {tab === 'cat' ? (
            <>
              {/* Cat Preview */}
              <div className="flex justify-center">
                <div className={`transition-transform duration-200 ${winking ? 'scale-110' : 'scale-100'}`}>
                  <CatAvatar
                    furColor={furColor}
                    eyeColor={eyeColor}
                    accessory={accessory}
                    size={140}
                  />
                </div>
              </div>

              {/* Fur Color */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Fur Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {CAT_FUR_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFurColor(color.value)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        furColor === color.value
                          ? 'border-[#004F30] scale-110 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Eye Color */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Eye Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {CAT_EYE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setEyeColor(color.value)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        eyeColor === color.value
                          ? 'border-[#004F30] scale-110 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Accessories
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {CAT_ACCESSORIES.map((acc) => (
                    <button
                      key={acc.value}
                      onClick={() => setAccessory(acc.value)}
                      className={`p-2.5 rounded-xl border-2 text-xl transition-all ${
                        accessory === acc.value
                          ? 'border-[#004F30] bg-emerald-50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      title={acc.name}
                    >
                      {acc.icon}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <AnimeSelector
              selectedCharacter={character}
              selectedBgColor={bgColor}
              onCharacterChange={setCharacter}
              onBgColorChange={setBgColor}
            />
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-[#004F30] text-white text-sm font-black hover:bg-[#005C39] transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
