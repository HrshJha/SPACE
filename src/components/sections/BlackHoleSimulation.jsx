import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useCosmosStore } from '../../store/useCosmosStore.js';
import BlackHoleCore from '../background/BlackHoleCore.jsx';
import CosmicCard from '../ui/CosmicCard.jsx';
import GlowButton from '../ui/GlowButton.jsx';

function formatScientific(value) {
  return value.toExponential(2);
}

export function BlackHoleSimulation({ onWarp }) {
  const blackHoleMass = useCosmosStore((state) => state.blackHoleMass);
  const setBlackHoleMass = useCosmosStore((state) => state.setBlackHoleMass);
  const horizonApproach = useCosmosStore((state) => state.horizonApproach);
  const setHorizonApproach = useCosmosStore((state) => state.setHorizonApproach);
  const jetPulse = useCosmosStore((state) => state.jetPulse);
  const setJetPulse = useCosmosStore((state) => state.setJetPulse);
  const realityTear = useCosmosStore((state) => state.realityTear);
  const setRealityTear = useCosmosStore((state) => state.setRealityTear);
  const jetTimerRef = useRef(0);
  const schwarzschildRadiusKm = blackHoleMass * 2.95;
  const hawkingTemperature = 6.17e-8 / blackHoleMass;
  const observerRadiusKm =
    schwarzschildRadiusKm * Math.max(1.2, 3.4 - horizonApproach * 1.7);
  const timeDilation =
    1 / Math.sqrt(Math.max(0.06, 1 - schwarzschildRadiusKm / observerRadiusKm));
  const redshift = Math.max(0, timeDilation - 1);
  const photonSphereKm = schwarzschildRadiusKm * 1.5;

  useEffect(
    () => () => {
      window.clearTimeout(jetTimerRef.current);
    },
    [],
  );

  const triggerJet = () => {
    setJetPulse(1.45);
    window.clearTimeout(jetTimerRef.current);
    jetTimerRef.current = window.setTimeout(() => setJetPulse(0), 1400);
    onWarp?.();
  };

  return (
    <section
      id="black-hole"
      className={`section-shell relative min-h-screen px-6 py-24 ${jetPulse > 0 ? 'screen-shake' : ''}`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(255,69,0,${0.06 + horizonApproach * 0.12}), transparent 38%)`,
        }}
      />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div>
            <p className="hud-label">Section 03 // Black Hole Deep Dive</p>
            <h2 className="section-title">Lensing, accretion, and the edge where our equations begin to break.</h2>
            <p className="section-copy">
              The controls below modulate mass, pulse the accretion structure, and
              push the camera toward a more violent gravitational redshift.
            </p>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/[0.35]">
            <div className="relative h-[34rem]">
              <Canvas camera={{ position: [0, 0, 18], fov: 34 }}>
                <ambientLight intensity={0.2} />
                <BlackHoleCore scale={1.35 + horizonApproach * 0.1} />
              </Canvas>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, rgba(255,69,0,${horizonApproach * 0.14}), transparent 45%)`,
                }}
              />
              <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/[0.45]">
                  Time Dilation
                </p>
                <p className="mt-2 font-display text-2xl font-black text-white">
                  {timeDilation.toFixed(2)}x
                </p>
              </div>
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-col gap-3 md:flex-row">
                <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/[0.45]">
                    Gravitational Redshift
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-nebula-blue via-quantum to-plasma"
                      style={{ width: `${Math.min(100, redshift * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/[0.45]">
                    Horizon Narrative
                  </p>
                  <p className="mt-2 text-sm text-white/[0.76]">
                    {horizonApproach < 0.3
                      ? 'Photon orbits remain visible and plasma structures still read clearly.'
                      : horizonApproach < 0.7
                        ? 'Redshift grows stronger, the accretion disk hardens, and local time falls behind the outside universe.'
                        : 'Signal collapse underway. Classical intuition is no longer a trustworthy guide.'}
                  </p>
                </div>
              </div>
              <AnimatePresence>
                {realityTear ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.08 }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(74,158,255,0.22),rgba(123,79,255,0.18),rgba(0,0,0,0.78))]"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.1, ease: 'linear' }}
                      className="flex h-64 w-64 items-center justify-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),rgba(74,158,255,0.18),transparent_62%)]"
                    >
                      <div className="space-y-2 text-center">
                        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-white/[0.55]">
                          Inverted Galaxy
                        </p>
                        <p className="font-display text-3xl font-black text-white">
                          Reality Tear
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <CosmicCard className="space-y-8 bg-black/[0.45]">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Telemetry label="Mass" value={`${blackHoleMass.toFixed(1)} M☉`} />
            <Telemetry
              label="Schwarzschild Radius"
              value={`${schwarzschildRadiusKm.toFixed(1)} km`}
            />
            <Telemetry
              label="Hawking Temperature"
              value={`${formatScientific(hawkingTemperature)} K`}
            />
            <Telemetry
              label="Photon Sphere"
              value={`${photonSphereKm.toFixed(1)} km`}
            />
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-3xl font-black text-white">
              Gravity well controls
            </h3>
            <p className="text-white/[0.74]">
              A Schwarzschild black hole scales linearly with mass, so increasing mass grows
              the horizon radius while decreasing Hawking temperature.
            </p>
            <div className="flex flex-wrap gap-3">
              <GlowButton
                onClick={() => setBlackHoleMass((current) => Math.min(88, current + 6))}
              >
                Increase Mass
              </GlowButton>
              <GlowButton variant="ghost" onClick={triggerJet}>
                Eject Matter
              </GlowButton>
              <GlowButton
                variant="ghost"
                onClick={() =>
                  setHorizonApproach((current) => (current >= 0.9 ? 0 : current + 0.3))
                }
              >
                Approach Event Horizon
              </GlowButton>
              <GlowButton
                variant="ghost"
                onClick={() => {
                  setHorizonApproach(0);
                  setJetPulse(0);
                  setRealityTear(false);
                }}
              >
                Reset Field
              </GlowButton>
            </div>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/[0.45]">
              Hover intelligence
            </p>
            <p className="mt-4 text-white/[0.76]">
              The bright ring marks the photon sphere region and the accretion band is tinted
              by Doppler beaming: the approaching side blueshifts, while the receding side
              reddens as plasma races around the horizon.
            </p>
            <p className="mt-4 text-sm text-white/[0.58]">
              Click the event horizon dead-center to trigger the hidden inverted-galaxy tear.
            </p>
          </div>
        </CosmicCard>
      </div>
    </section>
  );
}

function Telemetry({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/[0.45]">{label}</p>
      <p className="mt-2 text-lg text-white">{value}</p>
    </div>
  );
}

export default BlackHoleSimulation;
