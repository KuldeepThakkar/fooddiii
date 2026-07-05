import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../lib/constants';
import type { Place } from '../types';

interface FavoritesState {
  favoriteIds: string[];
  
  // Actions
  toggleFavorite: (placeId: string) => void;
  isFavorite: (placeId: string) => boolean;
  getFavoritePlaces: (allPlaces: Place[]) => Place[];
  clearFavorites: () => void;
}

// Zustand doesn't serialize Sets, so we use array
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (placeId: string) => {
        const { favoriteIds } = get();
        const index = favoriteIds.indexOf(placeId);

        if (index > -1) {
          // Remove if exists
          set({
            favoriteIds: favoriteIds.filter((id) => id !== placeId),
          });
        } else {
          // Add if not exists
          set({
            favoriteIds: [...favoriteIds, placeId],
          });
        }
      },

      isFavorite: (placeId: string) => {
        return get().favoriteIds.includes(placeId);
      },

      getFavoritePlaces: (allPlaces: Place[]) => {
        const { favoriteIds } = get();
        return allPlaces.filter((place) =>
          favoriteIds.includes(place.id) && place.status === 'active'
        );
      },

      clearFavorites: () => {
        set({ favoriteIds: [] });
      },
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
    }
  )
);
