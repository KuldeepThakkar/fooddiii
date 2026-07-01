import React, { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PreferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PreferenceModal({ isOpen, onClose }: PreferenceModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/explore?search=${encodeURIComponent(searchTerm)}`);
            onClose();
        }
    };

    const handleSurprise = () => {
        navigate('/explore?mode=surprise');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Hungry?</h2>
                    <p className="text-gray-500 mb-8">Tell us what you're craving or let us decide.</p>

                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="I want to eat..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl text-lg font-medium placeholder-gray-400 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                        </div>
                        {searchTerm && (
                            <button
                                type="submit"
                                className="mt-3 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-colors shadow-md"
                            >
                                Find It
                            </button>
                        )}
                    </form>

                    <div className="relative flex items-center justify-center py-4">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 font-medium text-sm tracking-wider">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <button
                        onClick={handleSurprise}
                        className="w-full mt-4 group flex items-center justify-center py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <Sparkles className="w-6 h-6 mr-3 text-yellow-300 group-hover:animate-spin" />
                        <span className="text-lg font-bold">Surprise Me!</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
