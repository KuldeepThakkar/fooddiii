import { CatAuthModal } from './auth/CatAuthModal';
import { DeleteConfirmModal } from './places/DeleteConfirmModal';
import { EditPlaceModal } from './places/EditPlaceModal';

export function ModalHost() {
  return (
    <>
      <CatAuthModal />
      <DeleteConfirmModal />
      <EditPlaceModal />
    </>
  );
}
