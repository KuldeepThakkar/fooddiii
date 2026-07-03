import { create } from 'zustand';
import type { Place, PlaceCategory, PlaceStatus, EditRecord } from '../types';
import { STORAGE_KEYS } from '../lib/constants';
import { generateUUID, haversineDistance, isOpenNow } from '../lib/utils';

interface PlacesState {
  places: Place[];
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // CRUD
  addPlace: (place: Omit<Place, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status' | 'editHistory'>) => Place;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  getPlaceById: (id: string) => Place | undefined;
  getPlacesByOwner: (userId: string) => Place[];
  getNearbyPlaces: (lat: number, lng: number, radiusKm: number) => Place[];
  getOpenNow: () => Place[];
  searchPlaces: (query: string) => Place[];
  
  // Filtering
  filterByCategory: (category: PlaceCategory) => Place[];
  filterByTags: (tags: string[]) => Place[];
  filterByPriceRange: (min: number, max: number) => Place[];
  
  // Initialization
  initialize: () => void;
}

const SEED_PLACES: Omit<Place, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status' | 'editHistory'>[] = [
  // MOMO STALLS (8)
  {
    name: 'Manek Chowk Momo Center',
    category: 'Street Food',
    tags: ['momos', 'steamed', 'tandoori', 'veg', 'non-veg'],
    cuisine: 'Tibetan',
    coordinates: [23.0276, 72.5883],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '18:00',
    closeTime: '02:00',
    rating: 4.5,
    reviewCount: 234,
    priceRange: '₹50-150',
    isVeg: false,
    photos: [],
    description: 'Famous for authentic Tibetan momos with variety of fillings, open late night',
  },
  {
    name: 'Delhi Darbar Momos',
    category: 'Street Food',
    tags: ['momos', 'afghani', 'cheese', 'spicy'],
    cuisine: 'North Indian',
    coordinates: [23.0301, 72.5902],
    address: 'Near Law Garden, Ahmedabad',
    openTime: '16:00',
    closeTime: '23:00',
    rating: 4.3,
    reviewCount: 156,
    priceRange: '₹60-180',
    isVeg: false,
    photos: [],
    description: 'Known for Afghani momos and cheese-loaded varieties',
  },
  {
    name: 'Momo Magic SG Highway',
    category: 'Street Food',
    tags: ['momos', 'pan-fried', 'soup', 'late-night'],
    cuisine: 'Tibetan',
    coordinates: [23.0124, 72.5015],
    address: 'SG Highway, Ahmedabad',
    openTime: '17:00',
    closeTime: '03:00',
    rating: 4.4,
    reviewCount: 189,
    priceRange: '₹70-200',
    isVeg: false,
    photos: [],
    description: 'Late night momo destination with soup and pan-fried options',
  },
  {
    name: 'Tibetian Momo House',
    category: 'Street Food',
    tags: ['momos', 'authentic', 'thukpa', 'soup'],
    cuisine: 'Tibetan',
    coordinates: [23.0456, 72.5643],
    address: 'Bodakdev, Ahmedabad',
    openTime: '12:00',
    closeTime: '22:00',
    rating: 4.6,
    reviewCount: 278,
    priceRange: '₹80-220',
    isVeg: false,
    photos: [],
    description: 'Authentic Tibetan food with thukpa and traditional momos',
  },
  {
    name: 'Cheese Corn Momo Point',
    category: 'Street Food',
    tags: ['momos', 'cheese', 'corn', 'fusion'],
    cuisine: 'Fusion',
    coordinates: [23.0223, 72.5701],
    address: 'Navrangpura, Ahmedabad',
    openTime: '15:00',
    closeTime: '22:30',
    rating: 4.2,
    reviewCount: 145,
    priceRange: '₹60-160',
    isVeg: true,
    photos: [],
    description: 'Fusion momos with cheese and corn fillings, pure veg',
  },
  {
    name: 'Momo Nation Cafe',
    category: 'Cafe',
    tags: ['momos', 'cafe', 'seating', 'wifi'],
    cuisine: 'Asian',
    coordinates: [23.0389, 72.6102],
    address: 'Prahlad Nagar, Ahmedabad',
    openTime: '11:00',
    closeTime: '23:00',
    rating: 4.5,
    reviewCount: 312,
    priceRange: '₹100-300',
    isVeg: false,
    photos: [],
    description: 'Cafe-style momo place with seating and WiFi',
  },
  {
    name: 'Bhaijaan Momos',
    category: 'Street Food',
    tags: ['momos', 'tandoori', 'butter', 'non-veg'],
    cuisine: 'North Indian',
    coordinates: [23.0198, 72.5956],
    address: 'Paldi, Ahmedabad',
    openTime: '16:00',
    closeTime: '00:00',
    rating: 4.4,
    reviewCount: 198,
    priceRange: '₹70-190',
    isVeg: false,
    photos: [],
    description: 'Famous for butter tandoori momos with rich flavors',
  },
  {
    name: 'Momo Express Vastrapur',
    category: 'Street Food',
    tags: ['momos', 'quick', 'takeaway', 'budget'],
    cuisine: 'Tibetan',
    coordinates: [23.0345, 72.5301],
    address: 'Vastrapur Lake, Ahmedabad',
    openTime: '14:00',
    closeTime: '23:00',
    rating: 4.1,
    reviewCount: 134,
    priceRange: '₹40-120',
    isVeg: false,
    photos: [],
    description: 'Quick takeaway momos at budget-friendly prices',
  },

  // CHAAT VENDORS (5)
  {
    name: 'Manek Chowk Chaat Bazaar',
    category: 'Street Food',
    tags: ['chaat', 'sev-puri', 'pani-puri', 'dahi-puri'],
    cuisine: 'Gujarati',
    coordinates: [23.0278, 72.5885],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '17:00',
    closeTime: '01:00',
    rating: 4.7,
    reviewCount: 456,
    priceRange: '₹30-100',
    isVeg: true,
    photos: [],
    description: 'Legendary chaat destination with variety of puri options',
  },
  {
    name: 'Law Garden Khau Gali',
    category: 'Street Food',
    tags: ['chaat', 'bhel', 'dahi-vada', 'street-food'],
    cuisine: 'Gujarati',
    coordinates: [23.0245, 72.5634],
    address: 'Law Garden, Ahmedabad',
    openTime: '16:00',
    closeTime: '23:00',
    rating: 4.5,
    reviewCount: 389,
    priceRange: '₹40-120',
    isVeg: true,
    photos: [],
    description: 'Famous food street with authentic Gujarati chaat',
  },
  {
    name: 'Gujarat Chaat House',
    category: 'Street Food',
    tags: ['chaat', 'ragda-pattice', 'aloo-tikki'],
    cuisine: 'Gujarati',
    coordinates: [23.0412, 72.5789],
    address: 'C G Road, Ahmedabad',
    openTime: '10:00',
    closeTime: '22:00',
    rating: 4.3,
    reviewCount: 234,
    priceRange: '₹35-110',
    isVeg: true,
    photos: [],
    description: 'Specializes in ragda pattice and aloo tikki',
  },
  {
    name: 'Swati Snacks',
    category: 'Restaurant',
    tags: ['chaat', 'pav-bhaji', 'dosa', 'legendary'],
    cuisine: 'Gujarati',
    coordinates: [23.0367, 72.5523],
    address: 'Thaltej, Ahmedabad',
    openTime: '08:00',
    closeTime: '22:00',
    rating: 4.8,
    reviewCount: 567,
    priceRange: '₹100-350',
    isVeg: true,
    photos: [],
    description: 'Legendary Gujarati restaurant famous for pav bhaji and snacks',
  },
  {
    name: 'Das Khaman House',
    category: 'Street Food',
    tags: ['chaat', 'khaman', 'dhokla', 'gujarati'],
    cuisine: 'Gujarati',
    coordinates: [23.0298, 72.5812],
    address: 'Maninagar, Ahmedabad',
    openTime: '07:00',
    closeTime: '21:00',
    rating: 4.4,
    reviewCount: 289,
    priceRange: '₹25-80',
    isVeg: true,
    photos: [],
    description: 'Famous for soft khaman and dhokla varieties',
  },

  // DOSA CARTS (4)
  {
    name: 'Madras Dosa Center',
    category: 'Street Food',
    tags: ['dosa', 'masala', 'filter-coffee', 'south-indian'],
    cuisine: 'South Indian',
    coordinates: [23.0267, 72.5845],
    address: 'Relief Road, Ahmedabad',
    openTime: '07:00',
    closeTime: '21:00',
    rating: 4.3,
    reviewCount: 234,
    priceRange: '₹40-120',
    isVeg: true,
    photos: [],
    description: 'Authentic South Indian dosa with filter coffee',
  },
  {
    name: 'Jini Dosa King',
    category: 'Street Food',
    tags: ['dosa', 'jini', 'cheese', 'schezwan'],
    cuisine: 'Fusion',
    coordinates: [23.0334, 72.5923],
    address: 'Navrangpura, Ahmedabad',
    openTime: '09:00',
    closeTime: '22:00',
    rating: 4.5,
    reviewCount: 312,
    priceRange: '₹60-150',
    isVeg: true,
    photos: [],
    description: 'Famous for jini dosa with cheese and schezwan sauce',
  },
  {
    name: 'R.K. Dosa Hut',
    category: 'Street Food',
    tags: ['dosa', 'paneer', 'spring', 'family'],
    cuisine: 'South Indian',
    coordinates: [23.0189, 72.5767],
    address: 'Paldi, Ahmedabad',
    openTime: '08:00',
    closeTime: '21:30',
    rating: 4.2,
    reviewCount: 189,
    priceRange: '₹50-140',
    isVeg: true,
    photos: [],
    description: 'Family-friendly dosa place with paneer varieties',
  },
  {
    name: 'Sagar Gaire Dosa',
    category: 'Fast Food',
    tags: ['dosa', 'fast-food', 'chain', 'reliable'],
    cuisine: 'South Indian',
    coordinates: [23.0423, 72.5689],
    address: 'Bodakdev, Ahmedabad',
    openTime: '07:30',
    closeTime: '22:00',
    rating: 4.1,
    reviewCount: 156,
    priceRange: '₹45-130',
    isVeg: true,
    photos: [],
    description: 'Reliable chain for quick South Indian food',
  },

  // TEA/COFFEE (4)
  {
    name: 'Lucky Tea Stall',
    category: 'Street Food',
    tags: ['tea', 'cutting-chai', 'bun-maska', 'late-night'],
    cuisine: 'Indian',
    coordinates: [23.0256, 72.5867],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '18:00',
    closeTime: '04:00',
    rating: 4.4,
    reviewCount: 267,
    priceRange: '₹15-50',
    isVeg: true,
    photos: [],
    description: 'Iconic late-night tea stall with cutting chai and bun maska',
  },
  {
    name: 'Gujarat Coffee House',
    category: 'Cafe',
    tags: ['coffee', 'irani', 'bun', 'heritage'],
    cuisine: 'Irani',
    coordinates: [23.0312, 72.5745],
    address: 'Relief Road, Ahmedabad',
    openTime: '07:00',
    closeTime: '21:00',
    rating: 4.3,
    reviewCount: 198,
    priceRange: '₹30-80',
    isVeg: true,
    photos: [],
    description: 'Heritage Irani cafe with traditional bun and coffee',
  },
  {
    name: 'Chai Pe Charcha',
    category: 'Cafe',
    tags: ['tea', 'kulhad', 'maggi', 'hangout'],
    cuisine: 'Indian',
    coordinates: [23.0289, 72.5934],
    address: 'Law Garden, Ahmedabad',
    openTime: '15:00',
    closeTime: '23:00',
    rating: 4.2,
    reviewCount: 145,
    priceRange: '₹25-70',
    isVeg: true,
    photos: [],
    description: 'Popular hangout spot with kulhad chai and maggi',
  },
  {
    name: 'Midnight Tea Point',
    category: 'Street Food',
    tags: ['tea', 'coffee', 'midnight', 'students'],
    cuisine: 'Indian',
    coordinates: [23.0156, 72.5890],
    address: 'IIM Road, Ahmedabad',
    openTime: '20:00',
    closeTime: '05:00',
    rating: 4.5,
    reviewCount: 234,
    priceRange: '₹20-60',
    isVeg: true,
    photos: [],
    description: 'Student favorite for late-night tea and snacks',
  },

  // DESSERT/SWEETS (4)
  {
    name: 'Kandoi Bhogilal',
    category: 'Dessert',
    tags: ['sweets', 'mithai', 'traditional', 'festival'],
    cuisine: 'Gujarati',
    coordinates: [23.0305, 72.5801],
    address: 'Khadia, Ahmedabad',
    openTime: '09:00',
    closeTime: '21:00',
    rating: 4.7,
    reviewCount: 445,
    priceRange: '₹100-500',
    isVeg: true,
    photos: [],
    description: 'Legendary mithai shop with traditional Gujarati sweets',
  },
  {
    name: 'Havmor Ice Cream',
    category: 'Dessert',
    tags: ['ice-cream', 'kulfi', 'falooda', 'summer'],
    cuisine: 'Dessert',
    coordinates: [23.0245, 72.5912],
    address: 'C G Road, Ahmedabad',
    openTime: '10:00',
    closeTime: '23:00',
    rating: 4.6,
    reviewCount: 378,
    priceRange: '₹50-200',
    isVeg: true,
    photos: [],
    description: 'Famous for ice cream, kulfi and falooda',
  },
  {
    name: 'Rajwadu Thali & Malaiyo',
    category: 'Restaurant',
    tags: ['dessert', 'malaiyo', 'seasonal', 'rajasthani'],
    cuisine: 'Rajasthani',
    coordinates: [23.0390, 72.5556],
    address: 'Thaltej, Ahmedabad',
    openTime: '11:00',
    closeTime: '22:30',
    rating: 4.8,
    reviewCount: 512,
    priceRange: '₹200-500',
    isVeg: true,
    photos: [],
    description: 'Famous for seasonal malaiyo and Rajasthani thali',
  },
  {
    name: 'Asharfi Kulfi',
    category: 'Dessert',
    tags: ['kulfi', 'matka', 'rabdi', 'classic'],
    cuisine: 'Indian',
    coordinates: [23.0212, 72.5878],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '18:00',
    closeTime: '00:00',
    rating: 4.5,
    reviewCount: 289,
    priceRange: '₹40-120',
    isVeg: true,
    photos: [],
    description: 'Classic matka kulfi with rabdi, perfect for dessert',
  },

  // MAGGI STALLS (5) - NEW
  {
    name: 'Maggi Point Manek Chowk',
    category: 'Street Food',
    tags: ['maggi', 'cheese', 'spicy', 'late-night'],
    cuisine: 'Street Food',
    coordinates: [23.0272, 72.5880],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '19:00',
    closeTime: '03:00',
    rating: 4.3,
    reviewCount: 234,
    priceRange: '₹30-80',
    isVeg: true,
    photos: [],
    description: 'Famous for cheese maggi and spicy varieties, open late night',
  },
  {
    name: 'Student Maggi Hub',
    category: 'Street Food',
    tags: ['maggi', 'budget', 'students', 'quick'],
    cuisine: 'Street Food',
    coordinates: [23.0150, 72.5885],
    address: 'IIM Road, Ahmedabad',
    openTime: '16:00',
    closeTime: '02:00',
    rating: 4.4,
    reviewCount: 189,
    priceRange: '₹25-60',
    isVeg: true,
    photos: [],
    description: 'Student favorite with budget-friendly maggi options',
  },
  {
    name: 'Maggi Junction SG Highway',
    category: 'Street Food',
    tags: ['maggi', 'fusion', 'family', 'seating'],
    cuisine: 'Fusion',
    coordinates: [23.0130, 72.5020],
    address: 'SG Highway, Ahmedabad',
    openTime: '12:00',
    closeTime: '23:00',
    rating: 4.2,
    reviewCount: 145,
    priceRange: '₹40-100',
    isVeg: true,
    photos: [],
    description: 'Fusion maggi with seating, good for families',
  },
  {
    name: 'Tandoori Maggi Corner',
    category: 'Street Food',
    tags: ['maggi', 'tandoori', 'spicy', 'unique'],
    cuisine: 'Street Food',
    coordinates: [23.0350, 72.5600],
    address: 'Navrangpura, Ahmedabad',
    openTime: '17:00',
    closeTime: '23:30',
    rating: 4.5,
    reviewCount: 178,
    priceRange: '₹50-120',
    isVeg: true,
    photos: [],
    description: 'Unique tandoori maggi with spicy flavors',
  },
  {
    name: 'Maggi Express Vastrapur',
    category: 'Street Food',
    tags: ['maggi', 'quick', 'takeaway', 'variety'],
    cuisine: 'Street Food',
    coordinates: [23.0340, 72.5310],
    address: 'Vastrapur, Ahmedabad',
    openTime: '15:00',
    closeTime: '22:00',
    rating: 4.1,
    reviewCount: 123,
    priceRange: '₹35-90',
    isVeg: true,
    photos: [],
    description: 'Quick takeaway maggi with multiple varieties',
  },

  // SODA/DRINK STALLS (4) - NEW
  {
    name: 'Royal Soda Corner',
    category: 'Street Food',
    tags: ['soda', 'lemon', 'refreshing', 'summer'],
    cuisine: 'Beverage',
    coordinates: [23.0280, 72.5870],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '11:00',
    closeTime: '23:00',
    rating: 4.4,
    reviewCount: 167,
    priceRange: '₹20-50',
    isVeg: true,
    photos: [],
    description: 'Famous for refreshing lemon soda and flavored drinks',
  },
  {
    name: 'Masala Chai & Soda',
    category: 'Street Food',
    tags: ['soda', 'chai', 'masala', 'traditional'],
    cuisine: 'Beverage',
    coordinates: [23.0250, 72.5850],
    address: 'Relief Road, Ahmedabad',
    openTime: '07:00',
    closeTime: '21:00',
    rating: 4.2,
    reviewCount: 134,
    priceRange: '₹15-45',
    isVeg: true,
    photos: [],
    description: 'Traditional masala chai and soda combinations',
  },
  {
    name: 'Fresh Juice Bar',
    category: 'Street Food',
    tags: ['juice', 'fresh', 'healthy', 'seasonal'],
    cuisine: 'Beverage',
    coordinates: [23.0320, 72.5750],
    address: 'C G Road, Ahmedabad',
    openTime: '08:00',
    closeTime: '22:00',
    rating: 4.5,
    reviewCount: 223,
    priceRange: '₹40-100',
    isVeg: true,
    photos: [],
    description: 'Fresh fruit juices with seasonal varieties',
  },
  {
    name: 'Gola & Soda Stall',
    category: 'Street Food',
    tags: ['gola', 'soda', 'kids', 'summer'],
    cuisine: 'Beverage',
    coordinates: [23.0200, 72.5900],
    address: 'Law Garden, Ahmedabad',
    openTime: '14:00',
    closeTime: '22:00',
    rating: 4.3,
    reviewCount: 156,
    priceRange: '₹25-60',
    isVeg: true,
    photos: [],
    description: 'Colorful gola and soda, favorite with kids',
  },

  // PAV BHAJI (3) - NEW
  {
    name: 'Pav Bhaji Junction',
    category: 'Street Food',
    tags: ['pav-bhaji', 'spicy', 'butter', 'mumbai-style'],
    cuisine: 'Mumbai',
    coordinates: [23.0265, 72.5875],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '18:00',
    closeTime: '01:00',
    rating: 4.6,
    reviewCount: 289,
    priceRange: '₹60-150',
    isVeg: true,
    photos: [],
    description: 'Authentic Mumbai-style pav bhaji with extra butter',
  },
  {
    name: 'Amul Pav Bhaji',
    category: 'Street Food',
    tags: ['pav-bhaji', 'amul', 'cheese', 'popular'],
    cuisine: 'Indian',
    coordinates: [23.0315, 72.5735],
    address: 'C G Road, Ahmedabad',
    openTime: '11:00',
    closeTime: '22:00',
    rating: 4.4,
    reviewCount: 234,
    priceRange: '₹70-160',
    isVeg: true,
    photos: [],
    description: 'Popular Amul pav bhaji with cheese options',
  },
  {
    name: 'Punjabi Pav Bhaji',
    category: 'Street Food',
    tags: ['pav-bhaji', 'punjabi', 'spicy', 'authentic'],
    cuisine: 'Punjabi',
    coordinates: [23.0370, 72.5550],
    address: 'Thaltej, Ahmedabad',
    openTime: '12:00',
    closeTime: '22:30',
    rating: 4.5,
    reviewCount: 178,
    priceRange: '₹65-140',
    isVeg: true,
    photos: [],
    description: 'Punjabi-style pav bhaji with authentic spices',
  },

  // VADA PAV (3) - NEW
  {
    name: 'Mumbai Vada Pav',
    category: 'Street Food',
    tags: ['vada-pav', 'mumbai', 'spicy', 'chutney'],
    cuisine: 'Mumbai',
    coordinates: [23.0270, 72.5888],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '17:00',
    closeTime: '00:00',
    rating: 4.3,
    reviewCount: 212,
    priceRange: '₹20-50',
    isVeg: true,
    photos: [],
    description: 'Authentic Mumbai vada pav with green chutney',
  },
  {
    name: 'Gujju Vada Pav',
    category: 'Street Food',
    tags: ['vada-pav', 'gujarati', 'sweet', 'unique'],
    cuisine: 'Gujarati',
    coordinates: [23.0240, 72.5640],
    address: 'Law Garden, Ahmedabad',
    openTime: '16:00',
    closeTime: '22:00',
    rating: 4.2,
    reviewCount: 145,
    priceRange: '₹25-60',
    isVeg: true,
    photos: [],
    description: 'Gujarati-style vada pav with sweet chutney',
  },
  {
    name: 'Cheese Vada Pav',
    category: 'Street Food',
    tags: ['vada-pav', 'cheese', 'fusion', 'popular'],
    cuisine: 'Fusion',
    coordinates: [23.0330, 72.5920],
    address: 'Navrangpura, Ahmedabad',
    openTime: '15:00',
    closeTime: '21:30',
    rating: 4.4,
    reviewCount: 167,
    priceRange: '₹35-80',
    isVeg: true,
    photos: [],
    description: 'Fusion vada pav loaded with cheese',
  },

  // SANDWICH (3) - NEW
  {
    name: 'Mumbai Sandwich Corner',
    category: 'Street Food',
    tags: ['sandwich', 'mumbai', 'grilled', 'street-food'],
    cuisine: 'Mumbai',
    coordinates: [23.0275, 72.5878],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '17:00',
    closeTime: '23:30',
    rating: 4.5,
    reviewCount: 256,
    priceRange: '₹40-100',
    isVeg: true,
    photos: [],
    description: 'Authentic Mumbai grilled sandwich with chutney',
  },
  {
    name: 'Cheese Sandwich Hub',
    category: 'Street Food',
    tags: ['sandwich', 'cheese', 'grilled', 'popular'],
    cuisine: 'Indian',
    coordinates: [23.0325, 72.5745],
    address: 'C G Road, Ahmedabad',
    openTime: '10:00',
    closeTime: '21:00',
    rating: 4.3,
    reviewCount: 189,
    priceRange: '₹50-120',
    isVeg: true,
    photos: [],
    description: 'Famous for cheese-loaded grilled sandwiches',
  },
  {
    name: 'Veggie Sandwich Point',
    category: 'Street Food',
    tags: ['sandwich', 'healthy', 'fresh', 'budget'],
    cuisine: 'Indian',
    coordinates: [23.0185, 72.5770],
    address: 'Paldi, Ahmedabad',
    openTime: '09:00',
    closeTime: '20:00',
    rating: 4.1,
    reviewCount: 134,
    priceRange: '₹30-80',
    isVeg: true,
    photos: [],
    description: 'Healthy veggie sandwiches with fresh ingredients',
  },

  // ROLLS (2) - NEW
  {
    name: 'Kathi Roll Corner',
    category: 'Street Food',
    tags: ['rolls', 'kathi', 'spicy', 'non-veg'],
    cuisine: 'Kolkata',
    coordinates: [23.0285, 72.5865],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '18:00',
    closeTime: '00:00',
    rating: 4.4,
    reviewCount: 223,
    priceRange: '₹60-150',
    isVeg: false,
    photos: [],
    description: 'Authentic Kolkata kathi rolls with spicy fillings',
  },
  {
    name: 'Veg Roll Express',
    category: 'Street Food',
    tags: ['rolls', 'veg', 'paneer', 'quick'],
    cuisine: 'Indian',
    coordinates: [23.0345, 72.5315],
    address: 'Vastrapur, Ahmedabad',
    openTime: '14:00',
    closeTime: '22:00',
    rating: 4.2,
    reviewCount: 145,
    priceRange: '₹50-120',
    isVeg: true,
    photos: [],
    description: 'Quick veg rolls with paneer options',
  },

  // BIRYANI (2) - NEW
  {
    name: 'Hyderabadi Biryani House',
    category: 'Restaurant',
    tags: ['biryani', 'hyderabadi', 'spicy', 'authentic'],
    cuisine: 'Hyderabadi',
    coordinates: [23.0295, 72.5820],
    address: 'Maninagar, Ahmedabad',
    openTime: '11:00',
    closeTime: '23:00',
    rating: 4.6,
    reviewCount: 345,
    priceRange: '₹150-350',
    isVeg: false,
    photos: [],
    description: 'Authentic Hyderabadi biryani with aromatic spices',
  },
  {
    name: 'Lucknowi Biryani',
    category: 'Restaurant',
    tags: ['biryani', 'lucknowi', 'mild', 'fragrant'],
    cuisine: 'Lucknowi',
    coordinates: [23.0380, 72.5580],
    address: 'Thaltej, Ahmedabad',
    openTime: '12:00',
    closeTime: '22:30',
    rating: 4.5,
    reviewCount: 267,
    priceRange: '₹180-400',
    isVeg: false,
    photos: [],
    description: 'Fragrant Lucknowi biryani with mild flavors',
  },

  // PIZZA (2) - NEW
  {
    name: 'Street Pizza Corner',
    category: 'Street Food',
    tags: ['pizza', 'street-style', 'budget', 'quick'],
    cuisine: 'Italian',
    coordinates: [23.0260, 72.5850],
    address: 'Relief Road, Ahmedabad',
    openTime: '12:00',
    closeTime: '22:00',
    rating: 4.2,
    reviewCount: 178,
    priceRange: '₹50-150',
    isVeg: true,
    photos: [],
    description: 'Budget-friendly street-style pizza with quick service',
  },
  {
    name: 'Wood Fire Pizza',
    category: 'Restaurant',
    tags: ['pizza', 'wood-fire', 'authentic', 'premium'],
    cuisine: 'Italian',
    coordinates: [23.0395, 72.6120],
    address: 'Prahlad Nagar, Ahmedabad',
    openTime: '12:00',
    closeTime: '23:00',
    rating: 4.7,
    reviewCount: 289,
    priceRange: '₹200-500',
    isVeg: false,
    photos: [],
    description: 'Authentic wood-fired pizza with premium ingredients',
  },

  // BURGER (2) - NEW
  {
    name: 'Desi Burger Point',
    category: 'Street Food',
    tags: ['burger', 'desi', 'spicy', 'budget'],
    cuisine: 'Indian',
    coordinates: [23.0273, 72.5882],
    address: 'Manek Chowk, Ahmedabad',
    openTime: '17:00',
    closeTime: '00:00',
    rating: 4.3,
    reviewCount: 234,
    priceRange: '₹40-100',
    isVeg: true,
    photos: [],
    description: 'Indian-style spicy burgers at budget prices',
  },
  {
    name: 'Gourmet Burger Cafe',
    category: 'Cafe',
    tags: ['burger', 'gourmet', 'premium', 'seating'],
    cuisine: 'American',
    coordinates: [23.0360, 72.5530],
    address: 'Thaltej, Ahmedabad',
    openTime: '11:00',
    closeTime: '23:00',
    rating: 4.5,
    reviewCount: 312,
    priceRange: '₹150-400',
    isVeg: false,
    photos: [],
    description: 'Premium gourmet burgers with seating and WiFi',
  },
];

export const usePlacesStore = create<PlacesState>((set, get) => ({
  places: [],
  isHydrated: false,
  isLoading: false,
  error: null,

  initialize: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLACES);
      
      if (stored) {
        const places = JSON.parse(stored);
        if (Array.isArray(places) && places.length > 0) {
          set({ places, isHydrated: true, isLoading: false });
          return; // DON'T seed if data exists
        }
      }
      
      // Check for v9 migration
      const v9Data = localStorage.getItem('foodiespot_places_v9');
      if (v9Data) {
        // Migrate v9 to v10 schema
        const v9Places = JSON.parse(v9Data);
        const migratedPlaces = v9Places.map((place: any) => ({
          ...place,
          status: place.status || 'active',
          editHistory: place.editHistory || [],
          coordinates: place.coordinates || [23.0225, 72.5714],
        }));
        localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(migratedPlaces));
        localStorage.removeItem('foodiespot_places_v9');
        set({ places: migratedPlaces, isHydrated: true, isLoading: false });
        return;
      }
      
      // Seed initial data only if no stored data
      const now = new Date().toISOString();
      const seededPlaces = SEED_PLACES.map((place) => ({
        ...place,
        id: generateUUID(),
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        status: 'active' as PlaceStatus,
        editHistory: [] as EditRecord[],
      }));
      
      localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(seededPlaces));
      set({ places: seededPlaces, isHydrated: true, isLoading: false });
    } catch (error) {
      console.error('Error initializing places store:', error);
      set({ error: 'Failed to load places', isHydrated: true, isLoading: false });
    }
  },

  addPlace: (placeData) => {
    const { places } = get();
    const now = new Date().toISOString();
    const newPlace: Place = {
      ...placeData,
      id: generateUUID(),
      createdAt: now,
      updatedAt: now,
      createdBy: 'current-user', // Will be replaced with actual user ID
      status: 'active',
      editHistory: [],
    };
    
    const updatedPlaces = [...places, newPlace];
    localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(updatedPlaces));
    set({ places: updatedPlaces });
    
    return newPlace;
  },

  updatePlace: (id, updates) => {
    const { places } = get();
    const placeIndex = places.findIndex((p) => p.id === id);
    
    if (placeIndex === -1) {
      set({ error: 'Place not found' });
      return;
    }
    
    const place = places[placeIndex];
    const now = new Date().toISOString();
    
    // Track changes for edit history
    const changes: Record<string, { old: any; new: any }> = {};
    Object.keys(updates).forEach((key) => {
      if (updates[key as keyof Place] !== place[key as keyof Place]) {
        changes[key] = {
          old: place[key as keyof Place],
          new: updates[key as keyof Place],
        };
      }
    });
    
    const editRecord: EditRecord = {
      editedBy: 'current-user',
      editedAt: now,
      changes,
    };
    
    const updatedPlace: Place = {
      ...place,
      ...updates,
      id, // Prevent ID changes
      createdAt: place.createdAt, // Preserve creation time
      updatedAt: now,
      editHistory: [...place.editHistory, editRecord],
    };
    
    const updatedPlaces = [...places];
    updatedPlaces[placeIndex] = updatedPlace;
    
    localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(updatedPlaces));
    set({ places: updatedPlaces });
  },

  deletePlace: (id) => {
    const { places } = get();
    const placeIndex = places.findIndex((p) => p.id === id);
    
    if (placeIndex === -1) {
      set({ error: 'Place not found' });
      return;
    }
    
    const updatedPlaces = [...places];
    updatedPlaces[placeIndex] = {
      ...updatedPlaces[placeIndex],
      status: 'deleted',
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(updatedPlaces));
    set({ places: updatedPlaces });
  },

  getPlaceById: (id) => {
    const { places } = get();
    return places.find((p) => p.id === id);
  },

  getPlacesByOwner: (userId) => {
    const { places } = get();
    return places.filter((p) => p.createdBy === userId && p.status === 'active');
  },

  getNearbyPlaces: (lat, lng, radiusKm) => {
    const { places } = get();
    return places.filter((place) => {
      if (place.status !== 'active') return false;
      const [placeLat, placeLng] = place.coordinates;
      if (!Number.isFinite(placeLat) || !Number.isFinite(placeLng)) return false;
      const distance = haversineDistance(lat, lng, placeLat, placeLng);
      return distance <= radiusKm;
    });
  },

  getOpenNow: () => {
    const { places } = get();
    return places.filter((place) => {
      if (place.status !== 'active') return false;
      return isOpenNow(place.openTime, place.closeTime);
    });
  },

  searchPlaces: (query) => {
    const { places } = get();
    const lowerQuery = query.toLowerCase();
    
    return places.filter((place) => {
      if (place.status !== 'active') return false;
      
      return (
        place.name.toLowerCase().includes(lowerQuery) ||
        place.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        (place.cuisine && place.cuisine.toLowerCase().includes(lowerQuery)) ||
        (place.description && place.description.toLowerCase().includes(lowerQuery))
      );
    });
  },

  filterByCategory: (category) => {
    const { places } = get();
    return places.filter((p) => p.category === category && p.status === 'active');
  },

  filterByTags: (tags) => {
    const { places } = get();
    return places.filter((place) => {
      if (place.status !== 'active') return false;
      return tags.some((tag) => place.tags.includes(tag));
    });
  },

  filterByPriceRange: (min, max) => {
    const { places } = get();
    return places.filter((place) => {
      if (place.status !== 'active') return false;
      if (!place.priceRange) return false;
      
      // Extract price range from string like "₹50-150"
      const match = place.priceRange.match(/₹(\d+)-(\d+)/);
      if (!match) return false;
      
      const placeMin = parseInt(match[1]);
      const placeMax = parseInt(match[2]);
      
      return placeMin >= min && placeMax <= max;
    });
  },
}));
