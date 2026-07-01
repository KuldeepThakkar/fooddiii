// Updated Place and Review types for FoodieSpot
// Includes Supabase-compatible fields, tags, favorites, and reviews

export interface Place {
    id: string;
    name: string;
    description: string;
    type: 'Restaurant' | 'Cafe' | 'Street Food' | 'Fast Food' | 'Dessert' | 'Other';
    tags: string[]; // e.g., ['momos', 'steamed', 'veg']
    openTime: string; // HH:mm 24hr
    closeTime: string; // HH:mm 24hr
    location: string;
    lat?: number;
    lng?: number;
    addedBy?: string;
    imageUrl?: string;
    // Aggregated rating (maintained by DB trigger or client-side)
    ratingSum: number;
    ratingCount: number;
    // Computed: distance from user (provided by RPC function)
    distKm?: number;
    createdAt?: string;
}

export interface Review {
    id: string;
    placeId: string;
    userId: string;
    userName?: string;
    userAvatar?: string;
    rating: 1 | 2 | 3 | 4 | 5;
    text: string;
    photoUrl?: string;
    createdAt: string;
}

export interface UserProfile {
    id: string;
    displayName: string;
    email: string;
    avatarUrl?: string;
}

export type PlaceType = Place['type'];

export const PLACE_TYPES: PlaceType[] = [
    'Restaurant',
    'Cafe',
    'Street Food',
    'Fast Food',
    'Dessert',
    'Other'
];

export const POPULAR_TAGS = [
    'momos', 'chaat', 'dosa', 'vada pav', 'pav bhaji', 'dabeli',
    'ice cream', 'juice', 'chai', 'sandwich', 'noodles', 'biryani',
    'pizza', 'burger', 'rolls', 'kachori', 'fafda', 'gathiya',
    'veg', 'non-veg', 'jain', 'late night', 'open 24hr'
];

// Helper to compute avg rating
export function getAvgRating(place: Place): number {
    if (place.ratingCount === 0) return 0;
    return Math.round((place.ratingSum / place.ratingCount) * 10) / 10;
}

// Helper to check if a place is open right now
export function isOpenNow(openTime: string, closeTime: string): boolean {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [openH, openM] = openTime.split(':').map(Number);
    const [closeH, closeM] = closeTime.split(':').map(Number);
    const start = openH * 60 + openM;
    const end = closeH * 60 + closeM;
    if (end < start) {
        // Crosses midnight (e.g. 18:00 – 02:00)
        return currentMinutes >= start || currentMinutes <= end;
    }
    return currentMinutes >= start && currentMinutes <= end;
}
