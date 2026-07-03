import { useState, useEffect } from 'react';

export function CatMascot() {
    const [pos, setPos] = useState({ x: 100, y: 100 });
    const [dialog, setDialog] = useState<string | null>(null);

    useEffect(() => {
        const wander = setInterval(() => {
            setPos(prev => ({
                x: Math.max(20, Math.min(window.innerWidth - 220, prev.x + (Math.random() - 0.5) * 100)),
                y: Math.max(20, Math.min(window.innerHeight - 220, prev.y + (Math.random() - 0.5) * 100))
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
            className="fixed z-[10000] transition-all duration-1000 ease-in-out cursor-pointer group"
            style={{ left: pos.x, top: pos.y }}
            onClick={() => setDialog("Purrr... don't poke me!")}
        >
            {dialog && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-black shadow-lg border border-slate-200 whitespace-nowrap animate-bounce">
                    {dialog}
                </div>
            )}

            {/* Larger SVG for full cat avatar display */}
            <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-2xl group-hover:scale-110 transition-transform duration-300">
                {/* Body */}
                <circle cx="50" cy="55" r="35" fill="#2f2e2b" />
                
                {/* Head */}
                <circle cx="50" cy="35" r="28" fill="#2f2e2b" />
                
                {/* Left Ear */}
                <path d="M25 15 L18 -5 L32 10 Z" fill="#2f2e2b" />
                <path d="M26 12 L21 2 L30 8 Z" fill="#facc15" opacity="0.6" />
                
                {/* Right Ear */}
                <path d="M75 15 L82 -5 L68 10 Z" fill="#2f2e2b" />
                <path d="M74 12 L79 2 L70 8 Z" fill="#facc15" opacity="0.6" />
                
                {/* Left Eye */}
                <circle cx="38" cy="28" r="6" fill="#facc15" />
                <circle cx="38" cy="28" r="3" fill="#000" />
                <circle cx="39" cy="26" r="1.5" fill="#fff" />
                
                {/* Right Eye */}
                <circle cx="62" cy="28" r="6" fill="#facc15" />
                <circle cx="62" cy="28" r="3" fill="#000" />
                <circle cx="63" cy="26" r="1.5" fill="#fff" />
                
                {/* Nose */}
                <path d="M50 38 L48 42 L52 42 Z" fill="#ff6b9d" />
                
                {/* Mouth */}
                <path d="M50 42 Q45 48 40 45" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M50 42 Q55 48 60 45" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                
                {/* Whiskers */}
                <line x1="30" y1="35" x2="15" y2="32" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="30" y1="42" x2="15" y2="45" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="70" y1="35" x2="85" y2="32" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="70" y1="42" x2="85" y2="45" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Front paws */}
                <ellipse cx="40" cy="85" rx="6" ry="10" fill="#2f2e2b" />
                <ellipse cx="60" cy="85" rx="6" ry="10" fill="#2f2e2b" />
                
                {/* Tail (curved) */}
                <path d="M70 65 Q85 60 82 40" fill="none" stroke="#2f2e2b" strokeWidth="8" strokeLinecap="round" />
            </svg>
        </div>
    );
}