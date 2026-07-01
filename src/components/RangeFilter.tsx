import { Flame, Info } from 'lucide-react';

interface RangeFilterProps {
    range: number;
    setRange: (range: number) => void;
    isDaredevil: boolean;
    setIsDaredevil: (isDaredevil: boolean) => void;
}

export function RangeFilter({ range, setRange, isDaredevil, setIsDaredevil }: RangeFilterProps) {
    return (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 mb-8 transform transition-all hover:scale-[1.01]">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">

                {/* Visual Range Display */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[140px] border-r border-slate-100 pr-6 mr-6 hidden md:flex">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1">Search Radius</span>
                    <span className="text-4xl font-black text-[#004F30] leading-none tracking-tighter">{range}<span className="text-sm font-medium ml-1">km</span></span>
                </div>

                {/* Slider Section */}
                <div className={`flex-1 w-full transition-all duration-300 ${isDaredevil ? 'opacity-20 pointer-events-none' : ''}`}>
                    <div className="flex justify-between items-end mb-4">
                        <div className="md:hidden">
                            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Radius</span>
                            <div className="text-2xl font-black text-[#004F30]">{range}km</div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-black bg-slate-100 px-3 py-1.5 rounded-xl flex items-center uppercase tracking-widest">
                            <Info className="w-3 h-3 mr-2 text-[#004F30]" />
                            Drag to expand vision
                        </div>
                    </div>

                    <div className="relative h-6 flex items-center">
                        <input
                            type="range"
                            min="1"
                            max="50"
                            step="0.5"
                            value={range}
                            onChange={(e) => setRange(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#004F30] hover:accent-[#005C39] transition-all"
                            style={{
                                background: `linear-gradient(to right, #004F30 ${(range / 50) * 100}%, #e5e7eb ${(range / 50) * 100}%)`
                            }}
                        />
                    </div>

                    <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-slate-300 mt-2 px-1">
                        <span>1km</span>
                        <span>25km</span>
                        <span>50km</span>
                    </div>
                </div>

                {/* Daredevil Toggle */}
                <div className="pl-0 md:pl-8 border-l-0 md:border-l border-slate-100">
                    <button
                        onClick={() => setIsDaredevil(!isDaredevil)}
                        className={`relative group flex items-center px-8 py-4 rounded-xl transition-all duration-500 overflow-hidden ${isDaredevil
                            ? 'bg-slate-900 text-white shadow-2xl scale-105'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-[#004F30] hover:shadow-lg shadow-sm'
                            }`}
                    >
                        {isDaredevil && <div className="absolute inset-0 bg-gradient-to-r from-[#004F30] to-green-900 transition-opacity duration-300 opacity-100 animate-pulse"></div>}
                        <div className="relative flex items-center">
                            <Flame className={`w-5 h-5 mr-3 transition-transform duration-500 ${isDaredevil ? 'animate-bounce text-green-300' : 'text-slate-300 group-hover:text-[#004F30]'}`} />
                            <span className="font-black uppercase tracking-widest text-xs">{isDaredevil ? 'Daredevil Mode Active' : 'Go Daredevil'}</span>
                        </div>
                    </button>
                    <p className="text-[10px] font-black text-slate-300 mt-2 text-center uppercase tracking-[0.2em]">Disable all limits</p>
                </div>
            </div>
        </div>
    );
}
