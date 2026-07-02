import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { usePlacesStore } from '../../stores/placesStore';
import { CatFace } from '../auth/CatFace';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { modalBackdropVariants, modalCatVariants } from '../../lib/animations';
import type { Place } from '../../types';

export function DeleteConfirmModal() {
  const { activeModal, modalData, closeModal, addToast } = useUIStore();
  const deletePlace = usePlacesStore((state) => state.deletePlace);
  const reducedMotion = usePrefersReducedMotion();
  const [catMood, setCatMood] = useState<'worried' | 'success' | 'typing-password'>('worried');
  const [isDeleting, setIsDeleting] = useState(false);

  const isOpen = activeModal === 'deleteConfirm';
  const place = modalData?.place as Place | undefined;

  useEffect(() => {
    if (isOpen) {
      setCatMood('worried');
      setIsDeleting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCatMood('success');
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeModal]);

  const handleKeep = () => {
    setCatMood('success');
    setTimeout(() => closeModal(), 300);
  };

  const handleDelete = () => {
    if (!place) return;
    setCatMood('typing-password');
    setIsDeleting(true);

    setTimeout(() => {
      deletePlace(place.id);
      addToast({
        type: 'success',
        title: 'Spot deleted',
        message: `${place.name} has been removed.`,
      });
      closeModal();
      setIsDeleting(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && place && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={handleKeep}
            aria-hidden="true"
          />

          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-desc"
            className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            variants={reducedMotion ? undefined : modalCatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-center mb-4">
              <CatFace mood={catMood === 'success' ? 'success' : catMood} />
            </div>

            <motion.div
              animate={reducedMotion ? {} : { rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: isDeleting ? 0 : Infinity, repeatDelay: 2 }}
              className="flex justify-center mb-4"
            >
              <Trash2 className="w-8 h-8 text-red-400" />
            </motion.div>

            <h2 id="delete-title" className="text-xl font-black text-slate-900 text-center mb-2">
              Are you sure?
            </h2>
            <p id="delete-desc" className="text-slate-500 text-sm text-center mb-6">
              This spot will be gone forever... 😿
              <br />
              <span className="font-semibold text-slate-700">{place.name}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleKeep}
                className="flex-1 min-h-[48px] bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors"
                aria-label="Keep this spot"
              >
                Keep it
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 min-h-[48px] bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors disabled:opacity-60"
                aria-label="Delete this spot forever"
              >
                {isDeleting ? 'Deleting...' : 'Delete forever'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
