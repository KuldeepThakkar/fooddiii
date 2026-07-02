import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlaces } from '../hooks/usePlaces';
import { PlaceCard } from '../components/PlaceCard';
import { PlaceDetailDrawer } from '../components/PlaceDetailDrawer';
import { LogOut, Map, Award, Heart, Navigation } from 'lucide-react';
import { Place } from '../types';
import { AuthGuard } from '../components/auth/AuthGuard';

export function Profile() {
    const { user, logout } = useAuth();
    const { places, favorites } = usePlaces();
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    // Calculate Stats
    const myAddedPlaces = places.filter(p => p.createdBy === user?.id || p.createdBy === user?.email);
    const myFavoritePlaces = favorites.places;

    // Calculate Avg Rating of added places
    const totalRatingSum = myAddedPlaces.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = myAddedPlaces.length > 0
        ? (totalRatingSum / myAddedPlaces.length).toFixed(1)
        : '0.0';

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 pb-20 sm:pb-8 selection:bg-green-100">
                {/* Header Banner */}
                <div className="bg-[#004F30] relative overflow-hidden h-48 md:h-64">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-slate-900/20 skew-x-[-20deg] translate-x-[20%]"></div>
                    <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-8 relative z-10">
                        <p className="text-[10vw] font-black text-white/5 absolute -bottom-10 left-0 whitespace-nowrap leading-none select-none">
                            FOODIESPOT PROFILE
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                    <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100">
                        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-12">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-tr from-[#004F30] to-green-100 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                                <img
                                    src={user?.avatarUrl || user?.avatar}
                                    alt={user?.displayName || user?.name}
                                    className="relative h-40 w-40 rounded-[2.5rem] border-8 border-white shadow-2xl transition-transform group-hover:scale-105 duration-500"
                                />
                            </div>

                            <div className="mt-6 md:mt-2 text-center md:text-left flex-1 space-y-4">
                                <div>
                                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{user?.displayName || user?.name}</h1>
                                    <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">{user?.email}</p>
                                </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                <StatCard icon={<Map className="w-5 h-5" />} label="Contributions" value={myAddedPlaces.length} color="text-slate-700" />
                                <StatCard icon={<Award className="w-5 h-5" />} label="Rank Index" value={avgRating} color="text-[#004F30]" />
                                <StatCard icon={<Heart className="w-5 h-5" />} label="Favorites" value={myFavoritePlaces.length} color="text-rose-600" />
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="mt-8 md:mt-4 flex items-center px-8 py-3.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Abandon Session
                        </button>
                    </div>
                </div>

                <div className="py-20 space-y-24">
                    {/* Favorite Places */}
                    <section>
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center">
                                <Heart className="w-6 h-6 mr-3 text-rose-600 fill-rose-50" />
                                Saved Favorites ({myFavoritePlaces.length})
                            </h3>
                            <div className="h-px flex-1 bg-slate-200 mx-8 hidden md:block"></div>
                        </div>

                        {myFavoritePlaces.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {myFavoritePlaces.map(place => (
                                    <PlaceCard 
                                        key={place.id} 
                                        place={place} 
                                        isFavorite={favorites.isFavorite(place.id)}
                                        onToggleFavorite={() => favorites.toggle(place.id)}
                                        onViewDetails={setSelectedPlace} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
                                <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">No favorites saved yet.</p>
                            </div>
                        )}
                    </section>

                    {/* Added Places */}
                    <section>
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center">
                                <Navigation className="w-6 h-6 mr-3 text-[#004F30]" />
                                Mapped Coordinates ({myAddedPlaces.length})
                            </h3>
                            <div className="h-px flex-1 bg-slate-200 mx-8 hidden md:block"></div>
                        </div>

                        {myAddedPlaces.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {myAddedPlaces.map(place => (
                                    <PlaceCard 
                                        key={place.id} 
                                        place={place} 
                                        isFavorite={favorites.isFavorite(place.id)}
                                        onToggleFavorite={() => favorites.toggle(place.id)}
                                        onViewDetails={setSelectedPlace} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
                                <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">The map awaits your contribution.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <PlaceDetailDrawer
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
            />
        </div>
        </AuthGuard>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
    return (
        <div className="flex items-center px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100/50 shadow-sm min-w-[180px]">
            <div className={`mr-4 p-3 bg-white rounded-2xl shadow-inner ${color}`}>{icon}</div>
            <div>
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-0.5">{label}</p>
                <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
            </div>
        </div>
    );
}
