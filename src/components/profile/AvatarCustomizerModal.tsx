import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { AvatarCustomizer } from './AvatarCustomizer';

export function AvatarCustomizerModal() {
  const { activeModal, closeModal, addToast } = useUIStore();
  const user = useAuthStore((state) => state.user);
  const updateAvatarConfig = useAuthStore((state) => state.updateAvatarConfig);

  if (activeModal !== 'avatarCustomizer') return null;

  const avatarType = user?.avatarConfig?.type || (user?.catAvatar ? 'cat' : user?.torikoAvatar ? 'anime' : 'cat');

  const handleSave = (config: { type: 'cat' | 'anime'; furColor?: string; eyeColor?: string; accessory?: string; character?: string; bgColor?: string }) => {
    updateAvatarConfig(config);
    closeModal();
    if (config.type === 'cat') {
      addToast({ type: 'success', title: 'Meow! Looking good 😺' });
    } else {
      addToast({ type: 'success', title: `Hunter ${config.character} selected! 🍖` });
    }
  };

  return (
    <AvatarCustomizer
      initialType={avatarType}
      initialFurColor={user?.avatarConfig?.furColor || user?.catAvatar?.furColor}
      initialEyeColor={user?.avatarConfig?.eyeColor || user?.catAvatar?.eyeColor}
      initialAccessory={user?.avatarConfig?.accessory || user?.catAvatar?.accessory}
      initialCharacter={user?.avatarConfig?.character || user?.torikoAvatar?.character || 'toriko'}
      initialBgColor={user?.avatarConfig?.bgColor || '#DC143C'}
      onSave={handleSave}
      onClose={closeModal}
    />
  );
}
