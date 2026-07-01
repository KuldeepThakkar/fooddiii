import { useState, useEffect } from 'react';

export function CatMascot() {
    const [pos, setPos] = useState({ x: 100, y: 100 });
    const [dialog, setDialog] = useState<string | null>(null);

    useEffect(() => {
        const wander = setInterval(() => {
            setPos(prev => ({
                x: Math.max(20, Math.min(window.innerWidth - 100, prev.x + (Math.random() - 0.5) * 100)),
                y: Math.max(20, Math.min(window.innerHeight - 100, prev.y + (Math.random() - 0.5) * 100))
            }));

            if (Math.random() > 0.8) {
                const messages = ["Meow?", "Hungry?", "Porsche Green is 🤌", "Follow the mouse!", "Feed me data!"];
                setDialog(messages[Math.floor(Math.random() * messages.length)]);
                setTimeout(() => setDialog(null), 3000);
            }
        }, 5000);

        return () => clearInterval(wander);
    }, []);

    return (
        <div
            className="fixed z-[10000] transition-all duration-1000 ease-in-out cursor-pointer"
            style={{ left: pos.x, top: pos.y }}
            onClick={() => setDialog("Purrr... don't poke me!")}
        >
            {dialog && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-800 px-3 py-1 rounded-xl text-[10px] font-black shadow-lg border border-slate-100 whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white">
                    {dialog}
                </div>
            )}

            <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-2xl">
                {/* Simple 2D Cat SVG */}
                <circle cx="50" cy="50" r="40" fill="#2f2e2bff" /> {/* Body */}
                <path d="M20 30 L35 10 L50 30 Z" fill="#2f2e2bff" /> {/* Left Ear */}
                <path d="M80 30 L65 10 L50 30 Z" fill="#2B2D2F" /> {/* Right Ear */}
                <circle cx="35" cy="45" r="5" fill="#facc15" /> {/* Left Eye */}
                <circle cx="65" cy="45" r="5" fill="#facc15" /> {/* Right Eye */}
                <circle cx="35" cy="45" r="2" fill="black" /> {/* Left Pupil */}
                <circle cx="65" cy="45" r="2" fill="black" /> {/* Right Pupil */}
                <path d="M45 60 Q50 65 55 60" fill="none" stroke="white" strokeWidth="2" /> {/* Mouth */}
            </svg>
        </div>
    );
}
