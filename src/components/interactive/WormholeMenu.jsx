import { AnimatePresence, motion } from 'framer-motion';
import { useCosmosStore } from '../../store/useCosmosStore.js';

const menuItems = [
  ['Universe', 'hero'],
  ['Solar System', 'solar-system'],
  ['Black Hole', 'black-hole'],
  ['Timeline', 'timeline'],
  ['Missions', 'missions'],
  ['Constellations', 'constellations'],
  ['Contact', 'contact'],
];

const vortexParticles = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  size: 2 + (index % 5),
  orbit: 68 + index * 6,
  duration: 8 + (index % 7),
  delay: index * 0.05,
}));

export function WormholeMenu() {
  const menuOpen = useCosmosStore((state) => state.menuOpen);
  const setMenuOpen = useCosmosStore((state) => state.setMenuOpen);

  const navigate = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {menuOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[75] bg-black/[0.88] backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,158,255,0.18),transparent_24%),radial-gradient(circle_at_center,rgba(123,79,255,0.22),transparent_38%),radial-gradient(circle_at_center,rgba(255,107,53,0.12),transparent_52%)]" />
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
              className="relative h-[30rem] w-[30rem] rounded-full border border-white/10"
            >
              {vortexParticles.map((particle) => (
                <motion.span
                  key={particle.id}
                  animate={{ rotate: [0, 360], scale: [0.7, 1.1, 0.7] }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: particle.delay,
                  }}
                  className="absolute left-1/2 top-1/2 rounded-full bg-white"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    transformOrigin: `0 ${particle.orbit}px`,
                    boxShadow: '0 0 18px rgba(74,158,255,0.8)',
                  }}
                />
              ))}
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 11, ease: 'linear', repeat: Infinity }}
              className="absolute h-72 w-72 rounded-full border border-nebula-blue/20"
            />
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.06, 1] }}
              transition={{ duration: 6.5, ease: 'easeInOut', repeat: Infinity }}
              className="absolute h-44 w-44 rounded-full border border-quantum/25 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(74,158,255,0.1),transparent_68%)]"
            />
          </div>
          <div className="relative flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute right-6 top-6 rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-white/80"
              aria-label="Close wormhole navigation menu"
            >
              Close
            </button>
            <div className="mb-8 space-y-3">
              <div className="mx-auto h-40 w-40 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),rgba(74,158,255,0.15),rgba(123,79,255,0.12),transparent_70%)] shadow-aura" />
              <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-white/[0.48]">
                Wormhole Navigation
              </p>
            </div>
            {menuItems.map(([label, id], index) => (
              <motion.button
                key={id}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(id)}
                className="font-display text-3xl font-bold text-white/90 transition hover:text-white"
              >
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default WormholeMenu;
