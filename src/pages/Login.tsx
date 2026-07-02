import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, ArrowLeft, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';

export function Login() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState('');

    const { login, signup, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        clearError();

        if (!email || !password) {
            setFormError('Please fill in all fields.');
            return;
        }
        if (mode === 'register' && !displayName.trim()) {
            setFormError('Please enter your name.');
            return;
        }
        if (password.length < 6) {
            setFormError('Password must be at least 6 characters.');
            return;
        }

        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await signup(displayName.trim(), email, password);
            }
            navigate('/explore');
        } catch (err) {
            setFormError(error || 'Authentication failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6">
            {/* Back Button */}
            <div className="flex justify-center mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center text-slate-400 hover:text-[#004F30] transition-colors text-sm font-bold group"
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            {/* Card */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🤤</div>
                    <h1 className="text-3xl font-black text-slate-900">
                        {mode === 'login' ? 'Welcome back!' : 'Join FoodieSpot'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">
                        {mode === 'login'
                            ? 'Sign in to save favorites and add reviews'
                            : 'Create an account to discover local food stalls'}
                    </p>
                </div>

                {/* Demo mode notice */}
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                    <p className="text-amber-800 text-sm font-semibold">Demo Mode Active</p>
                    <p className="text-amber-600 text-xs mt-0.5">
                        Using localStorage for authentication. Enter any Gmail email and password to continue.
                    </p>
                </div>

                <div className="bg-white py-10 px-8 shadow-xl rounded-3xl border border-slate-100">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Display Name (Register only) */}
                        {mode === 'register' && (
                            <div>
                                <label htmlFor="display-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Your Name
                                </label>
                                <input
                                    id="display-name"
                                    type="text"
                                    placeholder="Rahul Foodie"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-[#004F30] focus:ring-0 transition font-medium"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-[#004F30] focus:ring-0 transition font-medium"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder={mode === 'register' ? 'Minimum 6 characters' : '••••••••'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-300 focus:outline-none focus:border-[#004F30] focus:ring-0 transition font-medium pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {formError && (
                            <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-sm text-rose-600 font-medium">
                                {formError}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#004F30] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#005C39] transition-all shadow-lg hover:shadow-green-900/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle mode */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setFormError(''); }}
                                className="text-[#004F30] font-bold hover:underline"
                            >
                                {mode === 'login' ? 'Create one' : 'Sign in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
