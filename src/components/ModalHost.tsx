import { CatAuthModal } from './auth/CatAuthModal';
import { DeleteConfirmModal } from './places/DeleteConfirmModal';
import { EditPlaceModal } from './places/EditPlaceModal';
import { AvatarCustomizerModal } from './profile/AvatarCustomizerModal';

export function ModalHost() {
  return (
    <>
      <CatAuthModal />
      <DeleteConfirmModal />
      <EditPlaceModal />
      <AvatarCustomizerModal />
    </>
  );
}
