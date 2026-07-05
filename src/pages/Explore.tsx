import { useState, useMemo, useEffect, useCallback } from 'react';
import { usePlaces } from '../hooks/usePlaces';
import { PlaceCard, PlaceCardSkeleton } from '../components/PlaceCard';
import { AddPlaceForm } from '../components/AddPlaceForm';
import { PlaceMap } from '../components/Map/PlaceMap';
import { RangeFilter } from '../components/RangeFilter';
import { PlaceDetailDrawer } from '../components/PlaceDetailDrawer';
import { useSearchParams } from 'react-router-dom';
import { Place } from '../types';
import { Map as MapIcon, List, Clock, Plus, Navigation, Search, WifiOff } from 'lucide-react';
import { useProtectedAction } from '../hooks/useProtectedAction';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../stores/uiStore';

const POPULAR_FOOD_TAGS = ['momos', 'chaat', 'dosa', 'vada pav', 'pav bhaji', 'chai', 'dabeli', 'kachori'];

export function Explore() {
    const { places, isHydrated, addPlace, getNearbyPlaces, searchPlaces, getOpenNow, favorites } = usePlaces();
    const { user } = useAuth();
    const executeIfAuth = useProtectedAction();
    const { openModal } = useUIStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showOnlyOpen, setShowOnlyOpen] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Map & Range State
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [usingDemoLocation, setUsingDemoLocation] = useState(false);
    const [range, setRange] = useState(5);
    const [isDaredevil, setIsDaredevil] = useState(false);
    const [locationQuery, setLocationQuery] = useState('');
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const isAdding = searchParams.get('action') === 'add';
    const searchTerm = searchParams.get('q') || '';
    const isSurprise = searchParams.get('surprise') === 'true';

    useEffect(() => {
        if (isAdding && !user) {
            openModal('auth');
            setSearchParams({});
        }
    }, [isAdding, user, openModal, setSearchParams]);

    // Online/offline detection
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const detectLocation = useCallback(() => {
        setIsLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setUsingDemoLocation(false);
                    setIsLoadingLocation(false);
                },
                () => {
                    // Default: Manek Chowk Ahmedabad
                    setUserLocation({ lat: 23.0247, lng: 72.5868 });
                    setUsingDemoLocation(true);
                    setIsLoadingLocation(false);
                },
                { timeout: 5000, enableHighAccuracy: false }
            );
        } else {
            setUserLocation({ lat: 23.0247, lng: 72.5868 });
            setUsingDemoLocation(true);
            setIsLoadingLocation(false);
        }
    }, []);

    useEffect(() => { detectLocation(); }, [detectLocation]);

    const handleLocationSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!locationQuery.trim()) return;
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=1`
            );
            const data = await res.json();
            if (data?.length > 0) {
                setUserLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
                setUsingDemoLocation(false);
                setLocationQuery('');
            }
        } catch {
            console.warn('Location search failed');
        }
    };

    // Combined filter
    const filteredPlaces = useMemo(() => {
        if (!isHydrated || places.length === 0) return [];
        let result: Place[] = places;

        // Search/tag filter
        const term = activeTag || searchTerm;
        if (term) {
            result = searchPlaces(term);
        }

        // Location filter — intersect with current result, don't replace it
        if (userLocation && !isDaredevil) {
            const nearby = getNearbyPlaces(userLocation.lat, userLocation.lng, range);
            const nearbyIds = new Set(nearby.map((p) => p.id));
            result = result.filter((p) => nearbyIds.has(p.id));
        }

        // Open now filter
        if (showOnlyOpen) {
            result = result.filter(p => getOpenNow().includes(p));
        }

        // Surprise mode
        if (isSurprise && result.length > 0) {
            return [result[Math.floor(Math.random() * result.length)]];
        }

        return result;
    }, [places, isHydrated, showOnlyOpen, searchTerm, isSurprise, userLocation, range, isDaredevil, activeTag, searchPlaces, getNearbyPlaces, getOpenNow]);

    const handleAddPlace = async (data: any) => {
        // Convert old format to new format
        const newPlace = {
            name: data.name,
            category: data.type || 'Street Food',
            tags: data.tags || [],
            cuisine: data.cuisine,
            coordinates: [data.lat || userLocation?.lat || 23.0247, data.lng || userLocation?.lng || 72.5868] as [number, number],
            address: data.location,
            openTime: data.openTime || '10:00',
            closeTime: data.closeTime || '22:00',
            rating: 4.0,
            reviewCount: 0,
            priceRange: data.priceRange || '₹50-150',
            isVeg: data.isVeg || false,
            photos: data.imageUrl ? [data.imageUrl] : [],
            description: data.description || '',
        };
        
        addPlace(newPlace);
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 sm:pb-8">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

                {/* Offline Banner */}
                {!isOnline && (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                        <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-800">You're offline</p>
                            <p className="text-xs text-amber-600">Showing cached places from your last visit</p>
                        </div>
                    </div>
                )}

                {/* Demo location banner */}
                {usingDemoLocation && (
                    <div className="bg-[#004F30] text-white rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Navigation className="w-5 h-5 text-emerald-300 flex-shrink-0 animate-pulse" />
                            <div>
                                <p className="text-sm font-black">Demo Location Active</p>
                                <p className="text-xs text-emerald-300">Showing spots near Manek Chowk, Ahmedabad</p>
                            </div>
                        </div>
                        <button
                            onClick={detectLocation}
                            className="text-xs font-black bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-colors flex-shrink-0"
                        >
                            Use My Location
                        </button>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">
                            {isSurprise ? '🎲 Surprise Me!' : '🗺️ Explore'}
                        </h1>
                        <p className="text-slate-500 text-sm mt-0.5">
                            {filteredPlaces.length} spot{filteredPlaces.length !== 1 ? 's' : ''} found
                            {range && !isDaredevil ? ` within ${range}km` : ''}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Location search */}
                        <form onSubmit={handleLocationSearch} className="relative flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#004F30]/20 focus-within:border-[#004F30] transition-all shadow-sm">
                            <input
                                type="text"
                                placeholder="Search location..."
                                className="pl-4 pr-10 py-2.5 text-sm bg-transparent border-none outline-none w-44"
                                value={locationQuery}
                                onChange={e => setLocationQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-3 text-slate-400 hover:text-[#004F30] transition-colors" aria-label="Search location">
                                <Search className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Add Spot */}
                        <button
                            onClick={() => executeIfAuth(() => setSearchParams({ action: 'add' }))}
                            className="flex items-center gap-2 bg-[#004F30] text-white px-4 py-2.5 min-h-[44px] rounded-2xl text-sm font-black hover:bg-[#005C39] transition-all shadow-md hover:shadow-lg"
                            aria-label="Add a new food spot"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Spot</span>
                        </button>
                    </div>
                </div>

                {/* Quick Tag Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        onClick={() => setActiveTag(null)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${!activeTag
                            ? 'bg-[#004F30] text-white border-[#004F30]'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                        All
                    </button>
                    {POPULAR_FOOD_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all capitalize ${activeTag === tag
                                ? 'bg-[#004F30] text-white border-[#004F30]'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Controls Row */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'list' ? 'bg-[#004F30] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <List className="w-3.5 h-3.5" />
                            LIST
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'map' ? 'bg-[#004F30] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <MapIcon className="w-3.5 h-3.5" />
                            MAP
                        </button>
                    </div>

                    {/* Open Toggle */}
                    <button
                        onClick={() => setShowOnlyOpen(!showOnlyOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border-2 transition-all ${showOnlyOpen
                            ? 'border-[#004F30] text-[#004F30] bg-emerald-50'
                            : 'border-slate-200 text-slate-400'}`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        {showOnlyOpen ? 'OPEN NOW' : 'SHOW ALL'}
                    </button>

                    {isSurprise && (
                        <button onClick={() => setSearchParams({})} className="text-xs font-black text-rose-500 hover:underline">
                            Clear Surprise
                        </button>
                    )}
                </div>

                {/* Range Filter */}
                {!isSurprise && (
                    <RangeFilter
                        range={range} setRange={setRange}
                        isDaredevil={isDaredevil} setIsDaredevil={setIsDaredevil}
                    />
                )}

                {/* Main Content */}
                {viewMode === 'list' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {isLoadingLocation ? (
                            // Skeletons while detecting location
                            Array.from({ length: 6 }, (_, i) => <PlaceCardSkeleton key={i} />)
                        ) : filteredPlaces.length > 0 ? (
                            filteredPlaces.map(place => (
                                <PlaceCard
                                    key={place.id}
                                    place={place}
                                    isFavorite={favorites.isFavorite(place.id)}
                                    onToggleFavorite={() => favorites.toggle(place.id)}
                                    onViewDetails={setSelectedPlace}
                                />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-5">
                                    🍽️
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">No spots found nearby!</h3>
                                <p className="text-slate-500 text-sm max-w-xs mb-6">
                                    No places within <strong>{range}km</strong>
                                    {activeTag ? ` matching "${activeTag}"` : ''}.
                                    Try expanding the radius or go Daredevil mode.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => setIsDaredevil(true)}
                                        className="px-6 py-3 bg-[#004F30] text-white font-black rounded-2xl text-sm hover:bg-[#005C39]"
                                    >
                                        Go Daredevil Mode
                                    </button>
                                    {activeTag && (
                                        <button
                                            onClick={() => setActiveTag(null)}
                                            className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl text-sm hover:bg-slate-200"
                                        >
                                            Clear Filter
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                        <PlaceMap
                            places={filteredPlaces}
                            userLocation={userLocation}
                            range={isDaredevil ? undefined : range}
                            onLocationSet={(lat, lng) => { setUserLocation({ lat, lng }); setUsingDemoLocation(false); }}
                        />
                    </div>
                )}
            </div>

            {/* Add Place Modal */}
            {isAdding && user && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <AddPlaceForm
                        onAddPlace={handleAddPlace}
                        onCancel={() => setSearchParams({})}
                        defaultLat={userLocation?.lat}
                        defaultLng={userLocation?.lng}
                    />
                </div>
            )}

            {/* Place Detail Drawer */}
            <PlaceDetailDrawer
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
            />
        </div>
    );
}
