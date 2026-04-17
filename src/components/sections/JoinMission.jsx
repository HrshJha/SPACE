import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { externalLinks } from '../../utils/spaceData.js';
import CosmicCard from '../ui/CosmicCard.jsx';
import FactGenerator from '../ui/FactGenerator.jsx';
import GlowButton from '../ui/GlowButton.jsx';

export function JoinMission() {
  const [submitted, setSubmitted] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const [form, setForm] = useState({
    designation: '',
    frequency: '',
    message: '',
  });

  return (
    <section id="contact" className="section-shell relative min-h-screen overflow-hidden px-6 py-24">
      <div className="absolute inset-0 wormhole-tunnel" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,158,255,0.16),transparent_18%),radial-gradient(circle_at_center,rgba(123,79,255,0.14),transparent_30%),radial-gradient(circle_at_center,rgba(255,107,53,0.1),transparent_45%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div>
            <p className="hud-label">Section 07 // Join The Mission</p>
            <h2 className="section-title max-w-3xl">
              Open a channel, transmit your signal, and leave with a new piece of the cosmos.
            </h2>
          </div>
          <CosmicCard className="space-y-6 bg-black/[0.45]">
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <Field
                label="Designation"
                value={form.designation}
                onChange={(value) => setForm((current) => ({ ...current, designation: value }))}
              />
              <Field
                label="Signal Frequency"
                value={form.frequency}
                onChange={(value) => setForm((current) => ({ ...current, frequency: value }))}
              />
              <label className="block space-y-2">
                <span className="font-mono text-xs uppercase tracking-[0.32em] text-white/[0.45]">
                  Message Transmission
                </span>
                <textarea
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, message: event.target.value }))
                  }
                  rows={6}
                  className="w-full rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 font-mono text-base text-white outline-none transition focus:border-nebula-blue/40"
                  aria-label="Mission transmission message"
                />
              </label>
              <GlowButton type="submit">Transmit Signal</GlowButton>
            </form>
            <AnimatePresence>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="rounded-[24px] border border-nebula-blue/[0.25] bg-nebula-blue/10 p-5"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-nebula-blue">
                    Mission Launched
                  </p>
                  <p className="mt-3 text-white/[0.82]">
                    Your transmission has been routed through the wormhole array. Ground
                    control will answer on the next clean frequency.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </CosmicCard>
        </div>
        <div className="space-y-8">
          <CosmicCard className="bg-black/[0.45]">
            <FactGenerator />
          </CosmicCard>
          <CosmicCard className="space-y-4 bg-black/[0.45]">
            <p className="hud-label">External Deep Links</p>
            {externalLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => setActiveLink(link)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-white/75 transition hover:border-nebula-blue/30 hover:text-white"
                aria-label={`Open external portal details for ${link.label}`}
              >
                {link.label}
              </button>
            ))}
          </CosmicCard>
        </div>
      </div>
      <AnimatePresence>
        {activeLink ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[72] flex items-center justify-center bg-black/80 p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-lg rounded-[28px] border border-white/10 bg-black/[0.85] p-6"
            >
              <p className="hud-label">{activeLink.label}</p>
              <h3 className="mt-2 font-display text-3xl font-black text-white">
                External portal ready
              </h3>
              <p className="mt-4 text-white/[0.72]">
                This link exits the local universe and opens the live site in a new tab.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href={activeLink.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-nebula-blue/30 bg-nebula-blue/[0.15] px-4 py-3 font-mono text-xs uppercase tracking-[0.28em] text-white"
                >
                  Open Portal
                </a>
                <button
                  type="button"
                  onClick={() => setActiveLink(null)}
                  className="rounded-full border border-white/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.28em] text-white/70"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-xs uppercase tracking-[0.32em] text-white/[0.45]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 font-mono text-base text-white outline-none transition focus:border-nebula-blue/40"
        aria-label={label}
      />
    </label>
  );
}

export default JoinMission;
