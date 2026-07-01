import { useState, useEffect } from 'react';
import { Place, getAvgRating, isOpenNow } from '../types';
import { X, Star, Clock, MapPin, User, Plus, ChevronDown } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { ReviewModal } from './ReviewModal';
import { useAuth } from '../context/AuthContext';

interface PlaceDetailDrawerProps {
    place: Place | null;
    onClose: () => void;
}

export function PlaceDetailDrawer({ place, onClose }: PlaceDetailDrawerProps) {
    const { user } = useAuth();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const { reviews, isLoading, refetch } = useReviews(place?.id || '');

    // Prevent body scroll when open
    useEffect(() => {
        if (place) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [place]);

    if (!place) return null;

    const open = isOpenNow(place.openTime, place.closeTime);
    const avgRating = getAvgRating(place);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div
                className="fixed bottom-0 left-0 right-0 z-[160] bg-white rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col sm:right-auto sm:top-0 sm:bottom-0 sm:w-[420px] sm:rounded-l-none sm:rounded-r-none sm:rounded-none"
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
            >
                {/* Pull Handle (mobile) */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 bg-slate-200 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 py-4 flex items-start justify-between border-b border-slate-100">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${open ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                                {open ? 'Open Now' : 'Closed'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{place.type}</span>
                        </div>
                        <h2 id="drawer-title" className="text-xl font-black text-slate-900">{place.name}</h2>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            {place.location}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center flex-shrink-0 transition-colors"
                        aria-label="Close details"
                    >
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Stats Row */}
                    <div className="px-6 py-4 grid grid-cols-3 gap-4 border-b border-slate-50">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-lg">
                                <Star className="w-4 h-4 fill-current" />
                                {avgRating || '—'}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{place.ratingCount} reviews</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-slate-700 font-black text-sm">
                                <Clock className="w-4 h-4" />
                                {place.openTime}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">Opens</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-slate-700 font-black text-sm">
                                <Clock className="w-4 h-4" />
                                {place.closeTime}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">Closes</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-6 py-4 border-b border-slate-50">
                        <p className="text-sm text-slate-600 leading-relaxed">{place.description}</p>
                        {place.tags && place.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {place.tags.map(tag => (
                                    <span key={tag} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[11px] font-semibold">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-slate-900 text-sm">
                                Reviews ({reviews.length})
                            </h3>
                            {user && (
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="flex items-center gap-1.5 bg-[#004F30] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#005C39] transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Review
                                </button>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2].map(i => (
                                    <div key={i} className="animate-pulse bg-slate-100 rounded-2xl h-20" />
                                ))}
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-10">
                                <div className="text-4xl mb-3">💬</div>
                                <p className="text-sm text-slate-400 font-medium">No reviews yet.</p>
                                {user ? (
                                    <button
                                        onClick={() => setShowReviewModal(true)}
                                        className="mt-3 text-[#004F30] text-sm font-bold hover:underline"
                                    >
                                        Be the first to review!
                                    </button>
                                ) : (
                                    <p className="text-xs text-slate-400 mt-1">Sign in to leave a review</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <div className="flex items-start gap-3">
                                            {review.userAvatar ? (
                                                <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#004F30] flex items-center justify-center flex-shrink-0">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-bold text-slate-800 text-sm truncate">{review.userName || 'Foodie'}</span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{review.text}</p>
                                                {review.photoUrl && (
                                                    <img src={review.photoUrl} alt="Review photo" className="mt-2 rounded-xl w-full h-32 object-cover" />
                                                )}
                                                <p className="text-[11px] text-slate-400 mt-2">
                                                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Action */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white">
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-2xl font-semibold text-sm hover:bg-slate-200 transition-colors"
                    >
                        <ChevronDown className="w-4 h-4" />
                        Close
                    </button>
                </div>
            </div>

            {/* Review Modal on top */}
            {showReviewModal && place && (
                <ReviewModal
                    placeId={place.id}
                    placeName={place.name}
                    onClose={() => setShowReviewModal(false)}
                    onSuccess={() => {
                        setShowReviewModal(false);
                        refetch();
                    }}
                />
            )}
        </>
    );
}
