import { useEffect } from 'react';
import { usePlacesStore } from '../stores/placesStore';
import { useFavoritesStore } from '../stores/favoritesStore';

/**
 * Convenience hook combining places and favorites stores
 * Auto-initializes places store on mount
 */
export function usePlaces() {
  const places = usePlacesStore((state) => state.places);
  const isHydrated = usePlacesStore((state) => state.isHydrated);
  const isLoading = usePlacesStore((state) => state.isLoading);
  const error = usePlacesStore((state) => state.error);
  const initialize = usePlacesStore((state) => state.initialize);
  const addPlace = usePlacesStore((state) => state.addPlace);
  const updatePlace = usePlacesStore((state) => state.updatePlace);
  const deletePlace = usePlacesStore((state) => state.deletePlace);
  const getPlaceById = usePlacesStore((state) => state.getPlaceById);
  const getNearbyPlaces = usePlacesStore((state) => state.getNearbyPlaces);
  const getOpenNow = usePlacesStore((state) => state.getOpenNow);
  const searchPlaces = usePlacesStore((state) => state.searchPlaces);
  const filterByCategory = usePlacesStore((state) => state.filterByCategory);
  const filterByTags = usePlacesStore((state) => state.filterByTags);
  const filterByPriceRange = usePlacesStore((state) => state.filterByPriceRange);
  
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const getFavoritePlaces = useFavoritesStore((state) => state.getFavoritePlaces);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Get active places only
  const activePlaces = places.filter((p) => p.status === 'active');
  
  // Get favorite places with full place data
  const favoritePlaces = getFavoritePlaces(activePlaces);

  return {
    places: activePlaces,
    isHydrated,
    isLoading,
    error,
    addPlace,
    updatePlace,
    deletePlace,
    getPlaceById,
    getNearbyPlaces,
    getOpenNow,
    searchPlaces,
    filterByCategory,
    filterByTags,
    filterByPriceRange,
    favorites: {
      ids: favoriteIds,
      places: favoritePlaces,
      toggle: toggleFavorite,
      isFavorite,
    },
  };
}
