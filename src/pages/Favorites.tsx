import { Link } from 'react-router-dom';
import { usePlaces } from '../hooks/usePlaces';
import { PlaceCard, PlaceCardSkeleton } from '../components/PlaceCard';
import { PlaceDetailDrawer } from '../components/PlaceDetailDrawer';
import { SadCatIllustration } from '../components/auth/CatFace';
import { Place } from '../types';
import { useState } from 'react';
import { Heart, Compass } from 'lucide-react';
import { AuthGuard } from '../components/auth/AuthGuard';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function Favorites() {
    const { favorites, isLoading } = usePlaces();
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const reducedMotion = usePrefersReducedMotion();

    const favoritePlaces = favorites.places;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-50 pb-20 sm:pb-8">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">My Favorites</h1>
                            <p className="text-slate-500 text-sm mt-0.5">
                                <AnimatedCounter value={favoritePlaces.length} /> saved spot{favoritePlaces.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 3 }, (_, i) => <PlaceCardSkeleton key={i} />)}
                        </div>
                    ) : favoritePlaces.length === 0 ? (
                        <motion.div
                            className="flex flex-col items-center justify-center py-24 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reducedMotion ? 0 : 0.4 }}
                        >
                            <motion.div
                                animate={reducedMotion ? {} : { rotate: [-3, 3, -3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <SadCatIllustration className="w-40 h-40 mb-6" />
                            </motion.div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">
                                Your food bowl is empty! 🐱🍽️
                            </h2>
                            <p className="text-slate-500 text-sm max-w-xs mb-8 leading-relaxed">
                                Tap the heart on any food stall to save it here for quick access.
                            </p>
                            <Link
                                to="/explore"
                                className="inline-flex items-center gap-2 bg-[#004F30] text-white px-6 py-3 min-h-[48px] rounded-2xl font-black text-sm hover:bg-[#005C39] transition-colors"
                            >
                                <Compass className="w-4 h-4" />
                                Discover Spots
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {favoritePlaces.map(place => (
                                <PlaceCard
                                    key={place.id}
                                    place={place}
                                    isFavorite={favorites.isFavorite(place.id)}
                                    onToggleFavorite={() => favorites.toggle(place.id)}
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
        </AuthGuard>
    );
}
