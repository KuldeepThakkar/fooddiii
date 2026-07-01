import { useEffect, useState } from 'react';

export function MouseTrail() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState<{ x: number, y: number, id: number, size: number }[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const newPos = { x: e.clientX, y: e.clientY };
            setPosition(newPos);

            setTrail(prev => {
                const next = [...prev, {
                    ...newPos,
                    id: Math.random(),
                    size: Math.random() * 8 + 4 // Randomize ketchup drop size
                }];
                if (next.length > 12) return next.slice(1);
                return next;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            {/* Pizza Slice Cursor */}
            <div
                className="fixed pointer-events-none z-[10000] text-3xl transition-transform duration-75 ease-out select-none"
                style={{
                    left: position.x - 20,
                    top: position.y - 20,
                    filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.15))'
                }}
            >
                🍕
            </div>

            {/* Ketchup Trail */}
            {trail.map((t, i) => (
                <div
                    key={t.id}
                    className="fixed pointer-events-none z-[9999] rounded-full bg-red-600 blur-[0.5px]"
                    style={{
                        left: t.x - t.size / 2,
                        top: t.y - t.size / 2,
                        width: t.size,
                        height: t.size,
                        opacity: (i / 12) * 0.8,
                        transform: `scale(${i / 12 + 0.5})`,
                        transition: 'opacity 0.5s ease-out'
                    }}
                />
            ))}
        </>
    );
}
