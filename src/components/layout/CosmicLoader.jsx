import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const progressLabels = [
  'SPACETIME CALIBRATION',
  'QUANTUM FIELD INITIALIZED',
  'UNIVERSE LOADED',
];

export function CosmicLoader({ onComplete }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let frameId = 0;

    const update = () => {
      const nextElapsed = performance.now() - startedAt;
      setElapsed(nextElapsed);

      if (nextElapsed >= 2500) {
        onComplete?.();
        return;
      }

      frameId = window.requestAnimationFrame(update);
    };

    frameId = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(frameId);
  }, [onComplete]);

  const countdown = Math.max(0, 3 - Math.floor(elapsed / 800));
  const progress = Math.min(1, elapsed / 2500);
  const label = useMemo(() => {
    if (progress < 0.34) return progressLabels[0];
    if (progress < 0.74) return progressLabels[1];
    return progressLabels[2];
  }, [progress]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black"
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,158,255,0.12),transparent_30%),radial-gradient(circle_at_center,rgba(123,79,255,0.12),transparent_45%)]" />
      <div className="relative flex w-full max-w-xl flex-col items-center gap-8 px-6 text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 animate-pulsehalo rounded-full bg-nebula-blue/20 blur-3xl" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'linear' }}
            className="absolute h-36 w-36 rounded-full border border-white/10"
          />
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.08, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
            className="relative h-28 w-28 rounded-full border border-white/[0.15] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(74,158,255,0.35),rgba(0,0,0,0.96))]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
            className="absolute h-3 w-3 rounded-full bg-plasma shadow-[0_0_24px_rgba(255,107,53,0.95)]"
            style={{ transformOrigin: '0 72px' }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }}
            className="absolute h-2.5 w-2.5 rounded-full bg-nebula-blue shadow-[0_0_20px_rgba(74,158,255,0.95)]"
            style={{ transformOrigin: '0 -62px' }}
          />
        </div>
        <div className="space-y-2">
          <p className="font-mono text-sm uppercase tracking-[0.4em] text-nebula-blue">
            Mission Countdown
          </p>
          <p className="font-display text-4xl font-black uppercase tracking-[0.3em] text-white/[0.82]">
            Cosmos
          </p>
          <p className="font-display text-6xl font-black text-white">{countdown}</p>
        </div>
        <div className="w-full space-y-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-nebula-blue via-quantum to-plasma"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/60">
            {label}
          </p>
        </div>
        <div className="grid w-full grid-cols-3 gap-3 text-left">
          <TelemetryChip label="Binary Stars" value={progress < 0.4 ? 'forming' : 'locked'} />
          <TelemetryChip label="Field Noise" value={progress < 0.7 ? 'calibrating' : 'stable'} />
          <TelemetryChip label="Launch State" value={progress < 1 ? 'booting' : 'ready'} />
        </div>
      </div>
    </motion.div>
  );
}

function TelemetryChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/[0.42]">
        {label}
      </p>
      <p className="mt-2 text-sm text-white/[0.78]">{value}</p>
    </div>
  );
}

export default CosmicLoader;
