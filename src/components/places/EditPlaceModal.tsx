import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { usePlacesStore } from '../../stores/placesStore';
import { PLACE_CATEGORIES } from '../../lib/constants';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { modalBackdropVariants, modalCatVariants } from '../../lib/animations';
import type { Place, PlaceCategory } from '../../types';

export function EditPlaceModal() {
  const { activeModal, modalData, closeModal, addToast } = useUIStore();
  const updatePlace = usePlacesStore((state) => state.updatePlace);
  const reducedMotion = usePrefersReducedMotion();

  const isOpen = activeModal === 'editPlace';
  const place = modalData?.place as Place | undefined;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeModal]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!place) return;

    const form = new FormData(e.currentTarget);
    const updates = {
      name: form.get('name') as string,
      description: form.get('description') as string,
      category: form.get('category') as PlaceCategory,
      openTime: form.get('openTime') as string,
      closeTime: form.get('closeTime') as string,
    };

    updatePlace(place.id, updates);
    addToast({
      type: 'success',
      title: 'Spot updated',
      message: `${updates.name} has been saved.`,
    });
    closeModal();
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
            onClick={closeModal}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-place-title"
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            variants={reducedMotion ? undefined : modalCatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="edit-place-title" className="text-xl font-black text-slate-900">
                Edit Spot
              </h2>
              <button
                onClick={closeModal}
                className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-slate-100"
                aria-label="Close edit modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Name
                </label>
                <input
                  id="edit-name"
                  name="name"
                  defaultValue={place.name}
                  required
                  className="w-full h-12 px-4 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  defaultValue={place.description || ''}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label htmlFor="edit-category" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Category
                </label>
                <select
                  id="edit-category"
                  name="category"
                  defaultValue={place.category}
                  className="w-full h-12 px-4 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {PLACE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-open" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                    Opens
                  </label>
                  <input
                    id="edit-open"
                    name="openTime"
                    type="time"
                    defaultValue={place.openTime}
                    required
                    className="w-full h-12 px-4 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-close" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                    Closes
                  </label>
                  <input
                    id="edit-close"
                    name="closeTime"
                    type="time"
                    defaultValue={place.closeTime}
                    required
                    className="w-full h-12 px-4 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-colors mt-2"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
