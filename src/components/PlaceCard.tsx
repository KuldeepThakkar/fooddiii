import { useState } from 'react';
import { Place } from '../types';
import { Clock, MapPin, Star, Heart, MessageSquare, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProtectedAction } from '../hooks/useProtectedAction';
import { isOpenNow } from '../lib/utils';

interface PlaceCardProps {
    place: Place;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onViewDetails?: (place: Place) => void;
}

export function PlaceCard({ place, isFavorite = false, onToggleFavorite, onViewDetails }: PlaceCardProps) {
    const { user } = useAuth();
    const executeIfAuth = useProtectedAction();
    const [isHeartAnimating, setIsHeartAnimating] = useState(false);

    const categoryEmoji: Record<string, string> = {
        'Fast Food': '🍔',
        Restaurant: '🍽️',
        Cafe: '☕',
        Dessert: '🍦',
        'Street Food': '🍜',
        Other: '📍',
    };

    const open = isOpenNow(place.openTime, place.closeTime);

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsHeartAnimating(true);
        executeIfAuth(() => {
            onToggleFavorite?.();
        });
        setTimeout(() => setIsHeartAnimating(false), 500);
    };

    return (
        <article
            className={`
                group relative bg-white rounded-2xl shadow-sm border transition-all duration-300
                hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden
                ${isFavorite ? 'border-rose-200 shadow-rose-100' : 'border-slate-100'}
            `}
            onClick={() => onViewDetails?.(place)}
            aria-label={`${place.name} — ${open ? 'Open now' : 'Closed'}`}
        >
            {/* Image / Gradient Header */}
            <div className="relative h-32 bg-gradient-to-br from-[#004F30] via-emerald-800 to-slate-800 overflow-hidden">
                {place.photos && place.photos.length > 0 ? (
                    <img
                        src={place.photos[0]}
                        alt={place.name}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-50">{categoryEmoji[place.category] || '📍'}</span>
                    </div>
                )}

                {/* Open/Closed Badge */}
                <div className={`
                    absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                    backdrop-blur-sm border
                    ${open
                        ? 'bg-green-500/90 text-white border-green-400'
                        : 'bg-slate-800/90 text-slate-300 border-slate-700'}
                `}>
                    <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-200 animate-pulse' : 'bg-slate-500'}`} />
                    {open ? 'OPEN' : 'CLOSED'}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleFavorite}
                    disabled={!user}
                    aria-label={isFavorite ? `Remove ${place.name} from favorites` : `Add ${place.name} to favorites`}
                    className={`
                        absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
                        backdrop-blur-sm border transition-all duration-200
                        ${user ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-not-allowed opacity-50'}
                        ${isFavorite ? 'bg-rose-500 border-rose-400' : 'bg-white/80 border-white/60'}
                        ${isHeartAnimating ? 'scale-125' : ''}
                    `}
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-white text-white' : 'text-rose-400'}`}
                    />
                </button>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-1">{place.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{place.description}</p>
                </div>

                {/* Tags */}
                {place.tags && place.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {place.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                        {place.tags.length > 4 && (
                            <span className="px-2 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[10px] font-semibold">
                                +{place.tags.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Meta Row */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {place.openTime}–{place.closeTime}
                        </span>
                        {place.reviewCount > 0 && (
                            <span className="flex items-center gap-1 text-amber-500 font-semibold">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                {place.rating} ({place.reviewCount})
                            </span>
                        )}
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails?.(place); }}
                        className="flex items-center gap-1 text-[#004F30] text-xs font-bold hover:gap-2 transition-all"
                        aria-label={`View details for ${place.name}`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reviews
                        <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </article>
    );
}

// Skeleton loader for PlaceCard
export function PlaceCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="h-32 bg-slate-200" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
                <div className="flex gap-2">
                    <div className="h-5 bg-slate-100 rounded-full w-16" />
                    <div className="h-5 bg-slate-100 rounded-full w-16" />
                </div>
            </div>
        </div>
    );
}
