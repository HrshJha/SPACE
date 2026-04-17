import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cosmicFacts } from '../../utils/spaceData.js';
import GlowButton from './GlowButton.jsx';

export function FactGenerator() {
  const [index, setIndex] = useState(0);

  return (
    <div className="space-y-5">
      <GlowButton
        type="button"
        onClick={() => setIndex((current) => (current + 1) % cosmicFacts.length)}
        aria-label="Generate a new astrophysics fact"
      >
        Generate Cosmic Fact
      </GlowButton>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-5 text-base text-white/[0.82]"
        >
          {cosmicFacts[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default FactGenerator;
