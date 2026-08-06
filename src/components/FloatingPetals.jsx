import React, { useMemo } from 'react';

export const FloatingPetals = () => {
  const petals = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 14) + 12,
      left: Math.random() * 95,
      animationDuration: Math.random() * 8 + 8,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.4,
      rotation: Math.random() * 360
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map(p => (
        <div
          key={p.id}
          className="absolute animate-float-slow"
          style={{
            left: `${p.left}%`,
            top: `-5%`,
            width: `${p.size}px`,
            height: `${p.size * 1.3}px`,
            opacity: p.opacity,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`
          }}
        >
          <svg viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 0C25 10 30 25 15 40C0 25 5 10 15 0Z"
              fill="url(#petalGradient)"
            />
            <defs>
              <linearGradient id="petalGradient" x1="0" y1="0" x2="30" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F48FB1" stopOpacity="0.8" />
                <stop offset="0.7" stopColor="#FCE4EC" stopOpacity="0.6" />
                <stop offset="1" stopColor="#D4AF7F" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
};
