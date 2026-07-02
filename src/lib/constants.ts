/**
 * Application constants
 */

// Ahmedabad center coordinates
export const AHMEDABAD_CENTER = {
  lat: 23.0225,
  lng: 72.5714,
};

// Default search radius in kilometers
export const DEFAULT_SEARCH_RADIUS_KM = 5;

// Session expiry in milliseconds (7 days)
export const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

// Admin email (hardcoded for demo)
export const ADMIN_EMAIL = 'admin@foodiespot.com';

// localStorage keys
export const STORAGE_KEYS = {
  USERS: 'foodiespot_users',
  CURRENT_USER: 'foodiespot_current_user',
  PLACES: 'foodiespot_places_v10',
  FAVORITES: 'foodiespot_favorites',
  UI_THEME: 'foodiespot_theme',
  UI_SIDEBAR: 'foodiespot_sidebar',
} as const;

// Place categories
export const PLACE_CATEGORIES = [
  'Street Food',
  'Cafe',
  'Restaurant',
  'Fast Food',
  'Dessert',
  'Other',
] as const;

// Popular tags for suggestions
export const POPULAR_TAGS = [
  'momos',
  'chaat',
  'dosa',
  'vada pav',
  'pav bhaji',
  'dabeli',
  'ice cream',
  'juice',
  'chai',
  'sandwich',
  'noodles',
  'biryani',
  'pizza',
  'burger',
  'rolls',
  'kachori',
  'fafda',
  'gathiya',
  'veg',
  'non-veg',
  'jain',
  'late night',
  'open 24hr',
  'steamed',
  'tandoori',
  'spicy',
  'cheese',
  'fusion',
  'authentic',
  'budget',
  'premium',
  'seating',
  'takeaway',
  'delivery',
];
