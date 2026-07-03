import { MapPin, Heart, MessageSquare, Navigation } from 'lucide-react';

interface UserStatsProps {
  placesAdded?: number;
  favoritesCount?: number;
  reviewsCount?: number;
  checkIns?: number;
}

export function UserStats({
  placesAdded = 0,
  favoritesCount = 0,
  reviewsCount = 0,
  checkIns = 0,
}: UserStatsProps) {
  const stats = [
    { label: 'Places Added', value: placesAdded, icon: MapPin, color: 'text-[#004F30]' },
    { label: 'Favorites', value: favoritesCount, icon: Heart, color: 'text-rose-600' },
    { label: 'Reviews', value: reviewsCount, icon: MessageSquare, color: 'text-amber-600' },
    { label: 'Check-ins', value: checkIns, icon: Navigation, color: 'text-blue-600' },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">📊 My Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <div className={`p-2 rounded-xl bg-white ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
