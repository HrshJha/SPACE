import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useCosmosStore } from '../../store/useCosmosStore.js';

const transitionProfiles = {
  'hero->solar': { label: 'Warp tunnel', type: 'streaks' },
  'solar->blackhole': { label: 'Gravity pull', type: 'well' },
  'blackhole->timeline': { label: 'Time reversal', type: 'reverse' },
  'timeline->missions': { label: 'Telescopic aperture', type: 'aperture' },
  'missions->constellations': { label: 'Star-map bloom', type: 'bloom' },
  'constellations->contact': { label: 'Wormhole entry', type: 'rings' },
};

function TransitionVisual({ type }) {
  const streaks = Array.from({ length: 12 }, (_, index) => index);

  if (type === 'streaks') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {streaks.map((index) => (
          <motion.div
            key={index}
            initial={{ x: '-30%', opacity: 0 }}
            animate={{ x: '140%', opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.7, delay: index * 0.02, ease: 'easeOut' }}
            className="absolute h-px w-40 bg-gradient-to-r from-transparent via-nebula-blue to-transparent"
            style={{ top: `${10 + index * 7}%` }}
          />
        ))}
      </div>
    );
  }

  if (type === 'well') {
    return (
      <motion.div
        initial={{ scale: 1.8, opacity: 0 }}
        animate={{ scale: 0.55, opacity: [0, 0.75, 0] }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="absolute left-1/2 top-1/2 h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[radial-gradient(circle_at_center,rgba(74,158,255,0.18),rgba(123,79,255,0.16),transparent_72%)]"
      />
    );
  }

  if (type === 'reverse') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {streaks.map((index) => (
          <motion.div
            key={index}
            initial={{ x: '130%', opacity: 0 }}
            animate={{ x: '-30%', opacity: [0, 0.85, 0] }}
            transition={{ duration: 0.78, delay: index * 0.02, ease: 'easeOut' }}
            className="absolute h-px w-32 bg-gradient-to-r from-transparent via-plasma to-transparent"
            style={{ top: `${14 + index * 6}%` }}
          />
        ))}
      </div>
    );
  }

  if (type === 'aperture') {
    return (
      <motion.div
        initial={{ clipPath: 'circle(52% at 50% 50%)', opacity: 0 }}
        animate={{ clipPath: 'circle(8% at 50% 50%)', opacity: [0, 0.8, 0] }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),rgba(74,158,255,0.12),rgba(0,0,0,0.94))]"
      />
    );
  }

  if (type === 'bloom') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {streaks.map((index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1.2, opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.7, delay: index * 0.03, ease: 'easeOut' }}
            className="absolute h-2 w-2 rounded-full bg-white"
            style={{
              left: `${18 + (index % 4) * 16}%`,
              top: `${24 + Math.floor(index / 4) * 16}%`,
              boxShadow: '0 0 24px rgba(74,158,255,0.8)',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1.1, opacity: [0, 0.85, 0] }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
        className="h-[52vmin] w-[52vmin] rounded-full border border-white/20 bg-[radial-gradient(circle_at_center,rgba(74,158,255,0.18),rgba(123,79,255,0.14),rgba(0,0,0,0.84))]"
      />
      <motion.div
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: 1.25, opacity: [0, 0.65, 0] }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute h-[18vmin] w-[18vmin] rounded-full border border-plasma/40"
      />
    </div>
  );
}

export function SectionTransitionOverlay() {
  const activeZone = useCosmosStore((state) => state.activeZone);
  const reduceMotion = useReducedMotion();
  const previousZoneRef = useRef(activeZone);
  const [transition, setTransition] = useState(null);

  useEffect(() => {
    if (reduceMotion || previousZoneRef.current === activeZone) {
      previousZoneRef.current = activeZone;
      return undefined;
    }

    const key = `${previousZoneRef.current}->${activeZone}`;
    const profile =
      transitionProfiles[key] ??
      transitionProfiles[`${activeZone}->${previousZoneRef.current}`] ?? {
        label: 'Spacetime shift',
        type: 'rings',
      };

    setTransition({
      id: Date.now(),
      ...profile,
    });
    previousZoneRef.current = activeZone;

    const timeout = window.setTimeout(() => setTransition(null), 880);

    return () => window.clearTimeout(timeout);
  }, [activeZone, reduceMotion]);

  return (
    <AnimatePresence>
      {transition ? (
        <motion.div
          key={transition.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[58]"
        >
          <div className="absolute inset-0 bg-black/12 backdrop-blur-[2px]" />
          <TransitionVisual type={transition.type} />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.36em] text-white/[0.65]">
            {transition.label}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default SectionTransitionOverlay;
