import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, MapPin, Loader2, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PLACE_CATEGORIES, POPULAR_TAGS } from '../lib/constants';

const placeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    description: z.string().min(10, 'Add a brief description').max(300),
    category: z.enum(['Restaurant', 'Cafe', 'Street Food', 'Fast Food', 'Dessert', 'Other']),
    openTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
    closeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
    location: z.string().min(3, 'Please provide a location name'),
});

type PlaceFormData = z.infer<typeof placeSchema>;

interface AddPlaceFormProps {
    onAddPlace: (place: any) => void;
    onCancel: () => void;
    defaultLat?: number;
    defaultLng?: number;
}

export function AddPlaceForm({ onAddPlace, onCancel, defaultLat, defaultLng }: AddPlaceFormProps) {
    const { user } = useAuth();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customTag, setCustomTag] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(
        defaultLat && defaultLng ? { lat: defaultLat, lng: defaultLng } : null
    );

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<PlaceFormData>({
        resolver: zodResolver(placeSchema),
        defaultValues: {
            category: 'Street Food',
            openTime: '10:00',
            closeTime: '22:00',
        },
    });

    const handleDetectLocation = () => {
        if (!navigator.geolocation) return;
        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setDetectedCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setValue('location', `Near ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
                setIsDetecting(false);
            },
            () => {
                setIsDetecting(false);
                alert('Could not get location. Please enable location access.');
            }
        );
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const addCustomTag = () => {
        const t = customTag.trim().toLowerCase();
        if (t && !selectedTags.includes(t) && selectedTags.length < 10) {
            setSelectedTags(prev => [...prev, t]);
            setCustomTag('');
        }
    };

    const onSubmit = (data: PlaceFormData) => {
        onAddPlace({
            ...data,
            tags: selectedTags,
            lat: detectedCoords?.lat || defaultLat,
            lng: detectedCoords?.lng || defaultLng,
            addedBy: user?.id,
        });
    };

    return (
        <div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-place-title"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-[#004F30] to-emerald-800">
                <div>
                    <h2 id="add-place-title" className="text-white font-black text-lg">Share a Food Spot</h2>
                    <p className="text-emerald-200 text-xs mt-0.5">Help the community discover local gems</p>
                </div>
                <button
                    onClick={onCancel}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    aria-label="Cancel and close form"
                >
                    <X className="w-4 h-4 text-white" />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                {/* Name */}
                <div>
                    <label htmlFor="place-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Stall Name *
                    </label>
                    <input
                        id="place-name"
                        {...register('name')}
                        placeholder="e.g. Sharmaji Momo Corner"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004F30]/30 focus:border-[#004F30] transition"
                    />
                    {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="place-desc" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Description *
                    </label>
                    <textarea
                        id="place-desc"
                        {...register('description')}
                        placeholder="What makes this place special? Signature dishes?"
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004F30]/30 focus:border-[#004F30] transition resize-none"
                    />
                    {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Type & Location */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="place-type" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Type *
                        </label>
                        <select
                            id="place-type"
                            {...register('type')}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004F30]/30 focus:border-[#004F30] transition"
                        >
                            {PLACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="place-location" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Location *
                        </label>
                        <div className="relative">
                            <input
                                id="place-location"
                                {...register('location')}
                                placeholder="Area / Street"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004F30]/30 focus:border-[#004F30] transition"
                            />
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={isDetecting}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#004F30] hover:bg-emerald-50 rounded-lg transition-colors"
                                aria-label="Detect my current location"
                            >
                                {isDetecting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <MapPin className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {detectedCoords && (
                            <p className="text-emerald-600 text-[10px] mt-1 font-semibold">
                                ✓ GPS coordinates captured
                            </p>
                        )}
                        {errors.location && <p className="text-rose-500 text-xs mt-1">{errors.location.message}</p>}
                    </div>
                </div>

                {/* Hours */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="open-time" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Opens At *
                        </label>
                        <input
                            id="open-time"
                            type="time"
                            {...register('openTime')}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004F30]/30 focus:border-[#004F30] transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="close-time" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Closes At *
                        </label>
                        <input
                            id="close-time"
                            type="time"
                            {...register('closeTime')}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004F30]/30 focus:border-[#004F30] transition"
                        />
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Tags <span className="normal-case font-normal text-slate-400">(select what applies)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {POPULAR_TAGS.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selectedTags.includes(tag)
                                    ? 'bg-[#004F30] text-white border-[#004F30]'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#004F30]/50'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    {/* Custom tag input */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={customTag}
                            onChange={e => setCustomTag(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                            placeholder="Add custom tag..."
                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004F30]/20 focus:border-[#004F30] transition"
                        />
                        <button
                            type="button"
                            onClick={addCustomTag}
                            className="w-9 h-9 flex items-center justify-center bg-[#004F30] text-white rounded-xl hover:bg-[#005C39] transition-colors"
                            aria-label="Add custom tag"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    {selectedTags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {selectedTags.map(t => (
                                <span key={t} className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                                    {t}
                                    <button type="button" onClick={() => toggleTag(t)} aria-label={`Remove tag ${t}`}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 rounded-2xl bg-[#004F30] text-white text-sm font-black hover:bg-[#005C39] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Sharing...' : 'Share Spot 🍜'}
                    </button>
                </div>
            </form>
        </div>
    );
}
