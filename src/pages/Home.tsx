import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Sparkles, ChevronRight } from 'lucide-react';
import { PreferenceModal } from '../components/PreferenceModal';

export function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f3f4f6] selection:bg-green-100">
            <PreferenceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Hero Section */}
            <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16 px-4">
                {/* Decorative Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-slate-300/20 blur-[100px] rounded-full"></div>

                <div className="max-w-4xl mx-auto w-full text-center space-y-12 relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-green-200 animate-bounce-slow">
                        <Sparkles className="w-4 h-4" />
                        <span>Porsche Racing Edition LIVE</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight">
                        Gourmet eats <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004F30] via-[#005C39] to-slate-700 uppercase italic">
                            Luxury Vision.
                        </span>
                    </h1>

                    <p className="text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                        Discover hidden gems, late-night bites, and authentic street food
                        across Ahmedabad with a touch of class.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative btn-porsche px-12 py-6 flex items-center justify-center space-x-3 mb-4 sm:mb-0"
                        >
                            <span className="text-lg">Find Food Now</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <Link
                            to="/explore?action=add"
                            className="btn-3d glass-card px-12 py-6 rounded-xl flex items-center justify-center space-x-3 text-slate-700 font-bold group border-slate-200"
                        >
                            <Utensils className="w-6 h-6 text-green-700 group-hover:rotate-12 transition-transform" />
                            <span className="text-lg">Share a Spot</span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
