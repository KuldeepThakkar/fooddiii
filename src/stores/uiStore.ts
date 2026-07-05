import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Toast } from '../types';
import { generateUUID } from '../lib/utils';
import { STORAGE_KEYS } from '../lib/constants';

type ModalType = 'auth' | 'editPlace' | 'deleteConfirm' | 'avatarCustomizer' | null;

interface UIState {
  theme: 'light' | 'dark' | 'system';
  activeModal: ModalType;
  modalData: Record<string, any>;
  toasts: Toast[];

  // Actions
  setTheme: (theme: UIState['theme']) => void;
  openModal: (modal: ModalType, data?: Record<string, any>) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      activeModal: null,
      modalData: {},
      toasts: [],

      setTheme: (theme) => {
        set({ theme });
      },

      openModal: (modal, data = {}) => {
        set({
          activeModal: modal,
          modalData: data,
        });
      },

      closeModal: () => {
        set({
          activeModal: null,
          modalData: {},
        });
      },

      addToast: (toast) => {
        const id = generateUUID();
        const newToast: Toast = {
          id,
          ...toast,
          duration: toast.duration || 4000,
        };

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto-remove after duration
        setTimeout(() => {
          get().removeToast(id);
        }, newToast.duration);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.UI_THEME,
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
