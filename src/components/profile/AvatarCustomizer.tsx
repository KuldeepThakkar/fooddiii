import { CatAvatar } from './CatAvatar';

interface AvatarCustomizerProps {
  furColor: string;
  eyeColor: string;
  accessory: 'none' | 'bow' | 'glasses' | 'hat' | 'crown';
  onUpdate: (config: { furColor: string; eyeColor: string; accessory: 'none' | 'bow' | 'glasses' | 'hat' | 'crown' }) => void;
}

const FUR_COLORS = [
  { name: 'Black', value: '#1A1A1A' },
  { name: 'Orange', value: '#FF8C00' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Gray', value: '#808080' },
];

const EYE_COLORS = [
  { name: 'Yellow', value: '#FFD700' },
  { name: 'Blue', value: '#4169E1' },
  { name: 'Green', value: '#32CD32' },
  { name: 'Purple', value: '#9370DB' },
];

const ACCESSORIES = [
  { name: 'None', value: 'none' as const, icon: '❌' },
  { name: 'Bow', value: 'bow' as const, icon: '🎀' },
  { name: 'Glasses', value: 'glasses' as const, icon: '🕶️' },
  { name: 'Hat', value: 'hat' as const, icon: '🎩' },
  { name: 'Crown', value: 'crown' as const, icon: '👑' },
];

export function AvatarCustomizer({ furColor, eyeColor, accessory, onUpdate }: AvatarCustomizerProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
      {/* Preview */}
      <div className="flex justify-center mb-4">
        <CatAvatar furColor={furColor} eyeColor={eyeColor} accessory={accessory} size={160} />
      </div>

      {/* Fur Color */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Fur Color
        </label>
        <div className="flex gap-3">
          {FUR_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdate({ ...{ furColor, eyeColor, accessory }, furColor: color.value })}
              className={`w-12 h-12 rounded-full border-4 transition-all ${
                furColor === color.value ? 'border-[#004F30] scale-110' : 'border-slate-200 hover:border-slate-300'
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
        <div className="flex gap-3">
          {EYE_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdate({ ...{ furColor, eyeColor, accessory }, eyeColor: color.value })}
              className={`w-12 h-12 rounded-full border-4 transition-all ${
                eyeColor === color.value ? 'border-[#004F30] scale-110' : 'border-slate-200 hover:border-slate-300'
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
          Accessory
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ACCESSORIES.map((acc) => (
            <button
              key={acc.value}
              onClick={() => onUpdate({ ...{ furColor, eyeColor, accessory }, accessory: acc.value })}
              className={`p-3 rounded-xl border-2 text-2xl transition-all ${
                accessory === acc.value
                  ? 'border-[#004F30] bg-emerald-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title={acc.name}
            >
              {acc.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
