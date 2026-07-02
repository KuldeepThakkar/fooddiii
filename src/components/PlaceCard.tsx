import { useState } from 'react';
import { motion } from 'framer-motion';
import { Place } from '../types';
import { Clock, Star, Heart, MessageSquare, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProtectedAction } from '../hooks/useProtectedAction';
import { useUIStore } from '../stores/uiStore';
import { isOpenNow } from '../lib/utils';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { springBouncy } from '../lib/animations';
import type { PlaceCategory } from '../types';

interface PlaceCardProps {
    place: Place;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onViewDetails?: (place: Place) => void;
}

const categoryEmoji: Record<string, string> = {
    'Fast Food': '🍔',
    Restaurant: '🍽️',
    Cafe: '☕',
    Dessert: '🍦',
    'Street Food': '🍜',
    Other: '📍',
};

const categoryColors: Record<PlaceCategory, string> = {
    'Street Food': 'bg-orange-100 text-orange-700 border-orange-200',
    Cafe: 'bg-amber-100 text-amber-800 border-amber-200',
    Restaurant: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Fast Food': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Dessert: 'bg-pink-100 text-pink-700 border-pink-200',
    Other: 'bg-slate-100 text-slate-600 border-slate-200',
};

function HeartParticles({ show }: { show: boolean }) {
    const reducedMotion = usePrefersReducedMotion();
    if (!show || reducedMotion) return null;

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
                <motion.span
                    key={i}
                    className="absolute text-rose-400 text-xs"
                    initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                    animate={{
                        scale: [0, 1, 0],
                        opacity: [1, 1, 0],
                        x: Math.cos((i * 60 * Math.PI) / 180) * 24,
                        y: Math.sin((i * 60 * Math.PI) / 180) * 24,
                    }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                >
                    ♥
                </motion.span>
            ))}
        </div>
    );
}

export function PlaceCard({ place, isFavorite = false, onToggleFavorite, onViewDetails }: PlaceCardProps) {
    const { user } = useAuth();
    const executeIfAuth = useProtectedAction();
    const { openModal, addToast } = useUIStore();
    const reducedMotion = usePrefersReducedMotion();
    const [showParticles, setShowParticles] = useState(false);

    const isOwner = user && (place.createdBy === user.id || place.createdBy === user.email);
    const open = isOpenNow(place.openTime, place.closeTime);

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        const wasFavorite = isFavorite;
        executeIfAuth(() => {
            onToggleFavorite?.();
            if (!wasFavorite) {
                setShowParticles(true);
                addToast({
                    type: 'success',
                    title: 'Added to favorites!',
                    message: place.name,
                });
                setTimeout(() => setShowParticles(false), 600);
            }
        });
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        openModal('editPlace', { place });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        openModal('deleteConfirm', { place });
    };

    return (
        <motion.article
            layout
            className={`
                group relative bg-white rounded-2xl border cursor-pointer overflow-hidden
                ${isFavorite ? 'border-rose-200' : 'border-slate-100'}
            `}
            onClick={() => onViewDetails?.(place)}
            aria-label={`${place.name} — ${open ? 'Open now' : 'Closed'}`}
            whileHover={reducedMotion ? {} : { y: -4 }}
            transition={springBouncy}
            style={{
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
        >
            {/* Owner actions */}
            {isOwner && (
                <motion.div
                    className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    initial={false}
                >
                    <button
                        onClick={handleEdit}
                        className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 shadow-md min-w-[44px] min-h-[44px] sm:min-w-9 sm:min-h-9"
                        aria-label={`Edit ${place.name}`}
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-md min-w-[44px] min-h-[44px] sm:min-w-9 sm:min-h-9"
                        aria-label={`Delete ${place.name}`}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </motion.div>
            )}

            {/* Image / Gradient Header */}
            <div className="relative h-32 bg-gradient-to-br from-[#004F30] via-emerald-800 to-slate-800 overflow-hidden">
                {place.photos && place.photos.length > 0 ? (
                    <motion.img
                        src={place.photos[0]}
                        alt={place.name}
                        className="w-full h-full object-cover opacity-80"
                        whileHover={reducedMotion ? {} : { scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-50">{categoryEmoji[place.category] || '📍'}</span>
                    </div>
                )}

                {/* Category pill */}
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold border ${categoryColors[place.category]}`}>
                    {place.category}
                </span>

                {/* Open/Closed Badge */}
                <div className={`
                    absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                    backdrop-blur-sm border
                    ${open
                        ? 'bg-green-500/90 text-white border-green-400'
                        : 'bg-slate-800/90 text-slate-300 border-slate-700'}
                `}>
                    {open && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200" />
                        </span>
                    )}
                    {!open && <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                    {open ? 'Open Now' : 'CLOSED'}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleFavorite}
                    aria-label={isFavorite ? `Remove ${place.name} from favorites` : `Add ${place.name} to favorites`}
                    className={`
                        absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center
                        backdrop-blur-sm border transition-colors duration-200 min-w-[44px] min-h-[44px]
                        cursor-pointer hover:scale-110 active:scale-95
                        ${isFavorite ? 'bg-rose-500 border-rose-400' : 'bg-white/80 border-white/60'}
                    `}
                >
                    <HeartParticles show={showParticles} />
                    <motion.div
                        animate={isFavorite ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={springBouncy}
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-white text-white' : 'text-rose-400'}`}
                        />
                    </motion.div>
                </button>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-1">{place.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{place.description}</p>
                </div>

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
                        className="flex items-center gap-1 text-[#004F30] text-xs font-bold hover:gap-2 transition-all min-h-[44px]"
                        aria-label={`View details for ${place.name}`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reviews
                        <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.article>
    );
}

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
