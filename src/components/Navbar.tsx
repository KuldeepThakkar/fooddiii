import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Heart, Compass, Home, User, Menu, X } from 'lucide-react';

const NAV_LINKS = [
    { to: '/', label: 'Home', Icon: Home },
    { to: '/explore', label: 'Explore', Icon: Compass },
    { to: '/favorites', label: 'Favorites', Icon: Heart },
];

export function Navbar() {
    const { user } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (location.pathname === '/login') return null;

    const isActive = (to: string) =>
        to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

    return (
        <>
            {/* Desktop top nav */}
            <nav className="hidden sm:flex bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-tighter text-[#004F30]">
                                FoodieSpot
                            </span>
                            <span className="text-lg">🍜</span>
                        </Link>

                        {/* Nav links */}
                        <div className="flex items-center gap-1">
                            {NAV_LINKS.map(({ to, label, Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive(to)
                                        ? 'text-[#004F30] bg-emerald-50'
                                        : 'text-slate-500 hover:text-[#004F30] hover:bg-slate-50'}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* Auth */}
                        <div className="flex items-center">
                            {user ? (
                                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors">
                                    <img
                                        src={user.avatarUrl || user.avatar}
                                        alt={user.displayName || user.name}
                                        className="w-8 h-8 rounded-full border-2 border-[#004F30]"
                                    />
                                    <span className="font-bold text-sm text-slate-700">{user.displayName || user.name}</span>
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-5 py-2 bg-[#004F30] text-white text-sm font-black rounded-xl hover:bg-[#005C39] transition-all shadow-md"
                                >
                                    <LogIn className="w-4 h-4 mr-1.5" />
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile top bar */}
            <nav className="sm:hidden flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
                <Link to="/" className="flex items-center gap-1.5">
                    <span className="text-xl font-black tracking-tighter text-[#004F30]">FoodieSpot</span>
                    <span>🍜</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(o => !o)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
                    aria-label="Toggle menu"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
                </button>
            </nav>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="sm:hidden fixed top-[57px] left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-lg">
                    <div className="px-4 py-3 space-y-1">
                        {NAV_LINKS.map(({ to, label, Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${isActive(to)
                                    ? 'text-[#004F30] bg-emerald-50'
                                    : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Icon className="w-5 h-5" />
                                {label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-slate-100">
                            {user ? (
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    <img src={user.avatarUrl || user.avatar} alt={user.displayName || user.name} className="w-6 h-6 rounded-full" />
                                    Profile
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-[#004F30] bg-emerald-50"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile bottom tab bar */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 safe-bottom">
                <div className="flex">
                    {NAV_LINKS.map(({ to, label, Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${isActive(to) ? 'text-[#004F30]' : 'text-slate-400'}`}
                            aria-label={label}
                        >
                            <Icon className={`w-5 h-5 ${isActive(to) ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                            <span className="text-[10px] font-bold">{label}</span>
                        </Link>
                    ))}
                    {user ? (
                        <Link
                            to="/profile"
                            className={`flex-1 flex flex-col items-center py-2 gap-0.5 ${isActive('/profile') ? 'text-[#004F30]' : 'text-slate-400'}`}
                            aria-label="Profile"
                        >
                            <User className={`w-5 h-5 ${isActive('/profile') ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                            <span className="text-[10px] font-bold">Profile</span>
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="flex-1 flex flex-col items-center py-2 gap-0.5 text-slate-400"
                            aria-label="Sign In"
                        >
                            <LogIn className="w-5 h-5 stroke-[1.5px]" />
                            <span className="text-[10px] font-bold">Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
