import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCosmosStore } from '../../store/useCosmosStore.js';

const navItems = [
  { label: 'Universe', id: 'hero' },
  { label: 'Solar System', id: 'solar-system' },
  { label: 'Black Holes', id: 'black-hole' },
  { label: 'Timeline', id: 'timeline' },
  { label: 'Missions', id: 'missions' },
  { label: 'Constellations', id: 'constellations' },
  { label: 'Contact', id: 'contact' },
  { label: 'COSMOS-7', id: 'cosmos-7' },
];

export function Navbar({ onToggleAudio }) {
  const activeZone = useCosmosStore((state) => state.activeZone);
  const audioEnabled = useCosmosStore((state) => state.audioEnabled);
  const setMenuOpen = useCosmosStore((state) => state.setMenuOpen);
  const activeLabel = useMemo(() => activeZone.toUpperCase(), [activeZone]);

  const scrollToId = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-4 top-4 z-50 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/[0.35] px-4 py-3 backdrop-blur-xl"
    >
      <button
        type="button"
        onClick={() => scrollToId('hero')}
        className="font-display text-sm font-bold uppercase tracking-[0.35em] text-white"
        aria-label="Scroll to hero section"
      >
        Cosmos
      </button>
      <div className="hidden items-center gap-4 lg:flex">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToId(item.id)}
            className="text-sm text-white/70 transition hover:text-white"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.28em] text-white/60 md:block">
          {activeLabel}
        </div>
        <button
          type="button"
          onClick={onToggleAudio}
          className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-white/80 transition hover:border-nebula-blue/40 hover:text-white"
          aria-label={audioEnabled ? 'Disable ambient audio' : 'Enable ambient audio'}
        >
          Audio {audioEnabled ? 'On' : 'Off'}
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="relative h-11 w-11 overflow-hidden rounded-full border border-white/[0.15]"
          aria-label="Open wormhole navigation menu"
        >
          <span className="absolute inset-[20%] rounded-full border border-white/[0.25]" />
          <span className="absolute inset-[30%] rounded-full bg-gradient-to-r from-nebula-blue via-quantum to-plasma blur-[2px]" />
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;
