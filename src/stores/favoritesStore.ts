import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { queryClient } from '../lib/queryClient';

interface FavoritesState {
    favoriteIds: Set<string>;
    isLoading: boolean;
    toggle: (placeId: string, userId: string) => Promise<void>;
    syncFromSupabase: (userId: string) => Promise<void>;
    isFavorite: (placeId: string) => boolean;
}

// Zustand doesn't serialize Sets, so we use a serialized form
interface PersistedFavorites {
    favoriteIdsList: string[];
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favoriteIds: new Set<string>(),
            isLoading: false,

            isFavorite: (placeId: string) => get().favoriteIds.has(placeId),

            toggle: async (placeId: string, userId: string) => {
                const current = get().favoriteIds;
                const isFav = current.has(placeId);

                // Optimistic update
                const newSet = new Set(current);
                if (isFav) {
                    newSet.delete(placeId);
                } else {
                    newSet.add(placeId);
                }
                set({ favoriteIds: newSet });

                // Sync to Supabase
                if (isSupabaseConfigured()) {
                    try {
                        if (isFav) {
                            await supabase
                                .from('favorites')
                                .delete()
                                .match({ user_id: userId, place_id: placeId });
                        } else {
                            await supabase
                                .from('favorites')
                                .insert({ user_id: userId, place_id: placeId });
                        }
                        // Invalidate favorites query
                        queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
                    } catch (err) {
                        // Revert on error
                        console.warn('Failed to sync favorite, reverting:', err);
                        set({ favoriteIds: current });
                    }
                }
            },

            syncFromSupabase: async (userId: string) => {
                if (!isSupabaseConfigured()) return;

                set({ isLoading: true });
                try {
                    const { data, error } = await supabase
                        .from('favorites')
                        .select('place_id')
                        .eq('user_id', userId);

                    if (!error && data) {
                        set({ favoriteIds: new Set(data.map(f => f.place_id)) });
                    }
                } catch (err) {
                    console.warn('Failed to sync favorites:', err);
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'foodiespot-favorites',
            // Serialize/deserialize Set as array
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    const parsed: { state: PersistedFavorites; version: number } = JSON.parse(str);
                    return {
                        state: { favoriteIds: new Set(parsed.state.favoriteIdsList || []) },
                        version: parsed.version,
                    };
                },
                setItem: (name, value) => {
                    const serialized = {
                        state: { favoriteIdsList: Array.from(value.state.favoriteIds) },
                        version: value.version,
                    };
                    localStorage.setItem(name, JSON.stringify(serialized));
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
            partialize: (state) => ({ favoriteIds: state.favoriteIds }),
        }
    )
);
