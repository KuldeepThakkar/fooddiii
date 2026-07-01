import { useState, useEffect } from 'react';
import { Place } from '../types';
import { INITIAL_PLACES } from './seedData.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cachePlaces, getCachedPlaces } from '../lib/offlineCache';
import { queryClient } from '../lib/queryClient';

const STORAGE_KEY = 'foodiespot_places_v10';

// Haversine distance in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function usePlaces() {
    const [places, setPlaces] = useState<Place[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored) as Place[];
            } catch { /* ignore */ }
        }
        return INITIAL_PLACES;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    }, [places]);

    // Try to hydrate from Supabase if configured
    useEffect(() => {
        async function hydrate() {
            if (!isSupabaseConfigured()) {
                const cached = await getCachedPlaces();
                if (cached.length > 0) setPlaces(cached);
                return;
            }

            try {
                const { data, error } = await supabase.from('places').select('*');
                if (error) throw error;

                if (data && data.length > 0) {
                    const mapped: Place[] = data.map(row => ({
                        id: row.id,
                        name: row.name,
                        description: row.description || '',
                        type: row.type as Place['type'],
                        tags: row.tags || [],
                        openTime: row.open_time,
                        closeTime: row.close_time,
                        location: row.location || '',
                        lat: row.lat,
                        lng: row.lng,
                        addedBy: row.added_by,
                        imageUrl: row.image_url,
                        ratingSum: row.rating_sum || 0,
                        ratingCount: row.rating_count || 0,
                        createdAt: row.created_at,
                    }));
                    setPlaces(mapped);
                    cachePlaces(mapped);
                }
            } catch (err) {
                console.warn('Supabase fetch failed, loading from cache:', err);
                const cached = await getCachedPlaces();
                if (cached.length > 0) setPlaces(cached);
            }
        }
        hydrate();
    }, []);

    // Real-time subscription
    useEffect(() => {
        if (!isSupabaseConfigured()) return;

        const channel = supabase
            .channel('places_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'places' }, (payload) => {
                const row = payload.new as Record<string, unknown>;
                const newPlace: Place = {
                    id: row.id as string,
                    name: row.name as string,
                    description: (row.description as string) || '',
                    type: row.type as Place['type'],
                    tags: (row.tags as string[]) || [],
                    openTime: row.open_time as string,
                    closeTime: row.close_time as string,
                    location: (row.location as string) || '',
                    lat: row.lat as number | undefined,
                    lng: row.lng as number | undefined,
                    addedBy: row.added_by as string | undefined,
                    imageUrl: row.image_url as string | undefined,
                    ratingSum: 0,
                    ratingCount: 0,
                    createdAt: row.created_at as string,
                };
                setPlaces(prev => [newPlace, ...prev]);
                queryClient.invalidateQueries({ queryKey: ['places'] });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const addPlace = async (newPlaceData: Omit<Place, 'id' | 'ratingSum' | 'ratingCount'>) => {
        const newPlace: Place = {
            ...newPlaceData,
            id: crypto.randomUUID(),
            ratingSum: 0,
            ratingCount: 0,
        };

        // Optimistic local update
        setPlaces(prev => [newPlace, ...prev]);

        // Try Supabase
        if (isSupabaseConfigured()) {
            try {
                await supabase.from('places').insert({
                    id: newPlace.id,
                    name: newPlace.name,
                    description: newPlace.description,
                    type: newPlace.type,
                    tags: newPlace.tags,
                    open_time: newPlace.openTime,
                    close_time: newPlace.closeTime,
                    location: newPlace.location,
                    lat: newPlace.lat,
                    lng: newPlace.lng,
                    added_by: newPlace.addedBy,
                    image_url: newPlace.imageUrl,
                    geo: newPlace.lat && newPlace.lng
                        ? `SRID=4326;POINT(${newPlace.lng} ${newPlace.lat})`
                        : null,
                });
            } catch (err) {
                console.warn('Could not sync new place to Supabase:', err);
            }
        }

        return newPlace;
    };

    const getNearby = (
        lat: number,
        lng: number,
        radiusKm: number,
        searchTerm?: string
    ): Place[] => {
        return places.filter(place => {
            const withinRange = !place.lat || !place.lng
                ? true
                : getDistance(lat, lng, place.lat, place.lng) <= radiusKm;
            const matchesSearch = !searchTerm || searchTerm.trim() === '' ||
                place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                place.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                place.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                place.location.toLowerCase().includes(searchTerm.toLowerCase());
            return withinRange && matchesSearch;
        }).map(place => ({
            ...place,
            distKm: place.lat && place.lng
                ? Math.round(getDistance(lat, lng, place.lat, place.lng) * 10) / 10
                : undefined,
        })).sort((a, b) => (a.distKm || 999) - (b.distKm || 999));
    };

    return { places, addPlace, getNearby };
}
