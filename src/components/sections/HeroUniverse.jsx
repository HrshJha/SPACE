import { motion } from 'framer-motion';
import HologramText from '../ui/HologramText.jsx';
import GlowButton from '../ui/GlowButton.jsx';
import { heroQuote } from '../../utils/spaceData.js';

export function HeroUniverse({ onPrimaryAction, onSecondaryAction }) {
  return (
    <section
      id="hero"
      className="section-shell cosmos-section relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_20%),radial-gradient(circle_at_center,rgba(74,158,255,0.08),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.3))]" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center pb-16 pt-32 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mb-8 font-mono text-xs uppercase tracking-[0.5em] text-nebula-blue"
        >
          Mission Control // Deep Space Interface
        </motion.p>
        <HologramText
          text="EXPLORE THE INFINITE COSMOS"
          className="display-headline max-w-6xl uppercase leading-[0.92] tracking-[-0.04em]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mt-8 max-w-3xl space-y-3"
        >
          <p className="font-editorial text-xl text-white/[0.85] md:text-2xl">
            “{heroQuote.text}”
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/[0.45]">
            {heroQuote.author}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.8 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <GlowButton onClick={onPrimaryAction} aria-label="Launch mission and scroll to solar system explorer">
            Launch Mission
          </GlowButton>
          <GlowButton
            variant="ghost"
            onClick={onSecondaryAction}
            aria-label="Enter the universe through wormhole menu"
          >
            Enter Universe
          </GlowButton>
        </motion.div>
        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="oscilloscope-line" />
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/[0.45]">
            Scroll to descend through spacetime
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroUniverse;
