export type PlaceCategory = 'Street Food' | 'Cafe' | 'Restaurant' | 'Fast Food' | 'Dessert' | 'Other';
export type PlaceStatus = 'active' | 'deleted' | 'pending';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  tags: string[];
  cuisine?: string;
  coordinates: [number, number]; // [lat, lng]
  address?: string;
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  rating: number;
  reviewCount: number;
  priceRange?: string;
  isVeg?: boolean;
  photos: string[];
  description?: string;
  createdBy: string; // user id or "system"
  createdAt: string; // ISO 8601
  updatedAt: string;
  status: PlaceStatus;
  editHistory: EditRecord[];
}

export interface EditRecord {
  editedBy: string;
  editedAt: string;
  changes: Record<string, { old: any; new: any }>;
}

export interface User {
  id: string;
  name: string;
  displayName: string; // Alias for name for backward compatibility
  email: string;
  avatar?: string;
  avatarUrl?: string; // Alias for avatar for backward compatibility
  role: 'user' | 'admin';
  createdAt: string;
  favorites?: string[]; // place IDs (optional, can use favoritesStore)
  catAvatar?: {
    furColor: string;
    eyeColor: string;
    accessory: 'none' | 'bow' | 'glasses' | 'hat' | 'crown';
  };
  torikoAvatar?: {
    type: 'toriko';
    character: 'toriko' | 'komatsu' | 'sunny' | 'zebra' | 'coco';
  };
  stats?: {
    placesAdded: number;
    favoritesCount: number;
    reviewsCount: number;
    checkIns: number;
  };
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  text: string;
  photos?: string[];
  createdAt: string;
  helpful?: number; // upvotes
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
}
