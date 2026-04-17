import { useEffect, useMemo, useRef, useState } from 'react';
import { createStardustTextReveal } from '../../animations/textReveal.js';

export function HologramText({ text, className = '' }) {
  const ref = useRef(null);
  const [glitching, setGlitching] = useState(false);
  const characters = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    createStardustTextReveal(ref.current);

    const glitchInterval = window.setInterval(() => {
      if (Math.random() < 0.003) {
        setGlitching(true);
        window.setTimeout(() => setGlitching(false), 180);
      }
    }, 90);

    return () => window.clearInterval(glitchInterval);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative inline-block ${className} ${glitching ? 'translate-x-[1px] opacity-90' : ''}`}
    >
      <div className="pointer-events-none absolute inset-0 animate-scanline-slow bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="relative z-10 flex flex-wrap justify-center gap-x-[0.06em]">
        {characters.map((char, index) => (
          <span
            key={`${char}-${index}`}
            data-char
            className="inline-block text-starlight-white"
          >
            {char === ' ' ? '\u00a0' : char}
          </span>
        ))}
      </div>
    </div>
  );
}

export default HologramText;
