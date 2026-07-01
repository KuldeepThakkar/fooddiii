import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, X, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAddReview } from '../hooks/useReviews';

// Zod schema for review form
const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    text: z.string().min(10, 'Review must be at least 10 characters').max(500, 'Review must be under 500 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
    placeId: string;
    placeName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function ReviewModal({ placeId, placeName, onClose, onSuccess }: ReviewModalProps) {
    const { user } = useAuth();
    const { addReview, isSubmitting, error } = useAddReview();
    const [hoverRating, setHoverRating] = useState(0);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { rating: 0, text: '' },
    });

    const currentRating = watch('rating');

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type and size (max 5MB)
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be under 5MB.');
            return;
        }

        setPhotoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: ReviewFormData) => {
        if (!user) return;

        const result = await addReview({
            placeId,
            userId: user.id,
            userName: user.displayName,
            userAvatar: user.avatarUrl,
            rating: data.rating as 1 | 2 | 3 | 4 | 5,
            text: data.text,
        }, photoFile || undefined);

        if (result) {
            onSuccess();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
        >
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 id="review-modal-title" className="text-lg font-black text-slate-900">Add Your Review</h2>
                        <p className="text-sm text-slate-400 mt-0.5">{placeName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        aria-label="Close review dialog"
                    >
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Your Rating <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex gap-2" role="radiogroup" aria-label="Rating from 1 to 5 stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    type="button"
                                    role="radio"
                                    aria-checked={currentRating === star}
                                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setValue('rating', star, { shouldValidate: true })}
                                    className="focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 rounded"
                                >
                                    <Star
                                        className={`w-9 h-9 transition-all ${(hoverRating || currentRating) >= star
                                            ? 'fill-amber-400 text-amber-400 scale-110'
                                            : 'text-slate-200'}`}
                                    />
                                </button>
                            ))}
                        </div>
                        {errors.rating && <p className="text-rose-500 text-xs mt-1">Please select a rating</p>}
                    </div>

                    {/* Review Text */}
                    <div>
                        <label htmlFor="review-text" className="block text-sm font-semibold text-slate-700 mb-2">
                            Your Review <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            id="review-text"
                            {...register('text')}
                            placeholder="What did you love about this place? How was the food quality?"
                            rows={4}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004F30]/30 focus:border-[#004F30] transition resize-none"
                        />
                        <div className="flex justify-between mt-1">
                            {errors.text ? (
                                <p className="text-rose-500 text-xs">{errors.text.message}</p>
                            ) : <span />}
                            <span className="text-xs text-slate-400">{watch('text')?.length || 0}/500</span>
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Add Photo <span className="text-slate-400 font-normal">(optional, max 5MB)</span>
                        </label>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                            aria-label="Upload review photo"
                        />
                        {photoPreview ? (
                            <div className="relative rounded-2xl overflow-hidden h-40 border border-slate-200">
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
                                    aria-label="Remove photo"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#004F30] hover:text-[#004F30] transition-colors"
                            >
                                <Camera className="w-6 h-6" />
                                <span className="text-xs font-medium">Tap to add photo</span>
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-sm text-rose-600">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !user}
                        className="w-full bg-[#004F30] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#005C39] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                            </>
                        ) : 'Submit Review'}
                    </button>

                    {!user && (
                        <p className="text-center text-xs text-slate-400">Sign in to leave a review</p>
                    )}
                </form>
            </div>
        </div>
    );
}
