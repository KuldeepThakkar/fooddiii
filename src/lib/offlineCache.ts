import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Place } from '../types';

// IndexedDB schema for offline caching
interface FoodieDB extends DBSchema {
    places: {
        key: string;
        value: Place;
        indexes: { 'by-type': string };
    };
    pending_actions: {
        key: number;
        value: {
            id?: number;
            type: 'add_place' | 'add_review' | 'toggle_favorite';
            payload: unknown;
            timestamp: number;
        };
    };
}

let dbPromise: Promise<IDBPDatabase<FoodieDB>> | null = null;

function getDB(): Promise<IDBPDatabase<FoodieDB>> {
    if (!dbPromise) {
        dbPromise = openDB<FoodieDB>('foodiespot-db', 1, {
            upgrade(db) {
                const placeStore = db.createObjectStore('places', { keyPath: 'id' });
                placeStore.createIndex('by-type', 'type');

                db.createObjectStore('pending_actions', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
            },
        });
    }
    return dbPromise;
}

export async function cachePlaces(places: Place[]): Promise<void> {
    try {
        const db = await getDB();
        const tx = db.transaction('places', 'readwrite');
        await Promise.all([...places.map(p => tx.store.put(p)), tx.done]);
    } catch (err) {
        console.warn('Failed to cache places to IndexedDB:', err);
    }
}

export async function getCachedPlaces(): Promise<Place[]> {
    try {
        const db = await getDB();
        return await db.getAll('places');
    } catch (err) {
        console.warn('Failed to read cached places:', err);
        return [];
    }
}

export async function queuePendingAction(
    type: 'add_place' | 'add_review' | 'toggle_favorite',
    payload: unknown
): Promise<void> {
    try {
        const db = await getDB();
        await db.add('pending_actions', { type, payload, timestamp: Date.now() });
    } catch (err) {
        console.warn('Failed to queue pending action:', err);
    }
}

export async function getPendingActions() {
    try {
        const db = await getDB();
        return await db.getAll('pending_actions');
    } catch {
        return [];
    }
}

export async function clearPendingAction(id: number): Promise<void> {
    try {
        const db = await getDB();
        await db.delete('pending_actions', id);
    } catch (err) {
        console.warn('Failed to clear pending action:', err);
    }
}
