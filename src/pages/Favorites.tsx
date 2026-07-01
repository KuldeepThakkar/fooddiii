import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePlaces } from '../hooks/usePlaces';
import { useFavoritesStore } from '../stores/favoritesStore';
import { PlaceCard, PlaceCardSkeleton } from '../components/PlaceCard';
import { PlaceDetailDrawer } from '../components/PlaceDetailDrawer';
import { Place } from '../types';
import { useState } from 'react';
import { Heart, Compass } from 'lucide-react';

export function Favorites() {
    const { user } = useAuth();
    const { places } = usePlaces();
    const { favoriteIds, isLoading } = useFavoritesStore();
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const favoritePlaces = places.filter(p => favoriteIds.has(p.id));

    return (
        <div className="min-h-screen bg-slate-50 pb-20 sm:pb-8">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">My Favorites</h1>
                        <p className="text-slate-500 text-sm mt-0.5">
                            {favoritePlaces.length} saved spot{favoritePlaces.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 3 }, (_, i) => <PlaceCardSkeleton key={i} />)}
                    </div>
                ) : favoritePlaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-rose-300" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No favorites yet</h2>
                        <p className="text-slate-500 text-sm max-w-xs mb-8 leading-relaxed">
                            Tap the ♥ icon on any food stall to save it here for quick access.
                        </p>
                        <Link
                            to="/explore"
                            className="inline-flex items-center gap-2 bg-[#004F30] text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-[#005C39] transition-colors"
                        >
                            <Compass className="w-4 h-4" />
                            Discover Food Spots
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {favoritePlaces.map(place => (
                            <PlaceCard
                                key={place.id}
                                place={place}
                                onViewDetails={setSelectedPlace}
                            />
                        ))}
                    </div>
                )}
            </div>

            <PlaceDetailDrawer
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
            />
        </div>
    );
}
