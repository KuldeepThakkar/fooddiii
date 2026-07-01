import { useState, useEffect, useCallback } from 'react';
import { Review } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// localStorage fallback key
const REVIEWS_KEY = 'foodiespot_reviews_v1';

function loadLocalReviews(): Review[] {
    try {
        return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
    } catch { return []; }
}

function saveLocalReviews(reviews: Review[]) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function useReviews(placeId: string) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchReviews = useCallback(() => {
        if (!placeId) return;
        setIsLoading(true);

        if (isSupabaseConfigured()) {
            supabase
                .from('reviews')
                .select(`
                    id, place_id, user_id, rating, text, photo_url, created_at,
                    profiles(display_name, avatar_url)
                `)
                .eq('place_id', placeId)
                .order('created_at', { ascending: false })
                .then(({ data, error }) => {
                    setIsLoading(false);
                    if (!error && data) {
                        const mapped: Review[] = data.map(row => ({
                            id: row.id as string,
                            placeId: row.place_id as string,
                            userId: row.user_id as string,
                            userName: (row.profiles as { display_name?: string } | null)?.display_name || 'Foodie',
                            userAvatar: (row.profiles as { avatar_url?: string } | null)?.avatar_url,
                            rating: row.rating as 1 | 2 | 3 | 4 | 5,
                            text: row.text as string,
                            photoUrl: row.photo_url as string | undefined,
                            createdAt: row.created_at as string,
                        }));
                        setReviews(mapped);
                    }
                });
        } else {
            // Offline mode
            const all = loadLocalReviews();
            setReviews(all.filter(r => r.placeId === placeId));
            setIsLoading(false);
        }
    }, [placeId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return { reviews, isLoading, refetch: fetchReviews };
}

export function useAddReview() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addReview = async (
        reviewData: Omit<Review, 'id' | 'createdAt'>,
        photoFile?: File
    ) => {
        setIsSubmitting(true);
        setError(null);

        try {
            let photoUrl: string | undefined;

            // Upload photo if provided
            if (photoFile && isSupabaseConfigured()) {
                const fileName = `reviews/${reviewData.placeId}/${Date.now()}_${photoFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('review-photos')
                    .upload(fileName, photoFile, { upsert: false });

                if (uploadError) {
                    console.warn('Photo upload failed:', uploadError);
                } else if (uploadData) {
                    const { data: urlData } = supabase.storage
                        .from('review-photos')
                        .getPublicUrl(uploadData.path);
                    photoUrl = urlData.publicUrl;
                }
            }

            const newReview: Review = {
                ...reviewData,
                id: crypto.randomUUID(),
                photoUrl,
                createdAt: new Date().toISOString(),
            };

            if (isSupabaseConfigured()) {
                const { error: insertError } = await supabase.from('reviews').insert({
                    id: newReview.id,
                    place_id: newReview.placeId,
                    user_id: newReview.userId,
                    rating: newReview.rating,
                    text: newReview.text,
                    photo_url: newReview.photoUrl,
                });

                if (insertError) throw insertError;

                // Update rating aggregate
                await supabase.rpc('increment_place_rating', {
                    p_place_id: newReview.placeId,
                    p_rating: newReview.rating,
                });
            } else {
                // Offline mode: save to localStorage
                const all = loadLocalReviews();
                saveLocalReviews([newReview, ...all]);
            }

            return newReview;
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to add review';
            setError(msg);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { addReview, isSubmitting, error };
}
