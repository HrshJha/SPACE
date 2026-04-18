import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useCosmosStore } from '../../store/useCosmosStore.js';
import BlackHoleCore from '../background/BlackHoleCore.jsx';
import CosmicCard from '../ui/CosmicCard.jsx';
import GlowButton from '../ui/GlowButton.jsx';

const G = 6.6743e-11;
const C = 299792458;
const HBAR = 1.054571817e-34;
const KB = 1.380649e-23;
const SOLAR_MASS_KG = 1.98847e30;
const DEFAULT_MASS = 35;
const DEFAULT_ACCRETION = 1;
const DEFAULT_DISTANCE = 5;
const HORIZON_DISTANCE = 1.2;

function formatScientific(value) {
  return value.toExponential(2);
}

function BlackHoleCameraRig({ distance }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
  }, [camera, distance]);

  return null;
}

function Telemetry({ label, value }) {
  return (
    <div className="rounded-[16px] border border-white/10 bg-black/25 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">{label}</p>
      <p className="mt-2 text-lg text-white">{value}</p>
    </div>
  );
}

export function BlackHoleSimulation({ onWarp }) {
  const setBlackHoleMass = useCosmosStore((state) => state.setBlackHoleMass);
  const setHorizonApproach = useCosmosStore((state) => state.setHorizonApproach);
  const jetPulse = useCosmosStore((state) => state.jetPulse);
  const setJetPulse = useCosmosStore((state) => state.setJetPulse);
  const realityTear = useCosmosStore((state) => state.realityTear);
  const setRealityTear = useCosmosStore((state) => state.setRealityTear);
  const [mass, setMass] = useState(DEFAULT_MASS);
  const [accretionRate, setAccretionRate] = useState(DEFAULT_ACCRETION);
  const [cameraDistance, setCameraDistance] = useState(DEFAULT_DISTANCE);
  const [burstId, setBurstId] = useState(0);
  const [flashId, setFlashId] = useState(0);
  const [matterBursts, setMatterBursts] = useState([]);
  const massTweenRef = useRef(null);
  const distanceTweenRef = useRef(null);
  const accretionTweenRef = useRef(null);
  const jetTweenRef = useRef(null);

  const massKg = mass * SOLAR_MASS_KG;
  const schwarzschildRadiusKm = (2 * G * massKg) / (C * C * 1000);
  const hawkingTemperature = (HBAR * C ** 3) / (8 * Math.PI * G * massKg * KB);
  const photonSphereKm = schwarzschildRadiusKm * 1.5;
  const observerRadiusKm = Math.max(
    schwarzschildRadiusKm * 1.08,
    schwarzschildRadiusKm * cameraDistance,
  );
  const timeDilation =
    1 / Math.sqrt(Math.max(0.04, 1 - schwarzschildRadiusKm / observerRadiusKm));
  const redshift = Math.max(0, timeDilation - 1);
  const approachProgress =
    (DEFAULT_DISTANCE - cameraDistance) / (DEFAULT_DISTANCE - HORIZON_DISTANCE);

  const burstParticles = useMemo(
    () =>
      matterBursts.flatMap((entry) =>
        Array.from({ length: 20 }, (_, index) => {
          const angle = (Math.PI * 2 * index) / 20 + entry.seed * 0.5;
          const radius = 70 + ((index * 17 + entry.seed * 31) % 120);
          return {
            id: `${entry.id}-${index}`,
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            delay: index * 0.015,
            scale: 0.5 + ((index + entry.seed) % 5) * 0.12,
          };
        }),
      ),
    [matterBursts],
  );

  useEffect(() => {
    setBlackHoleMass(mass);
  }, [mass, setBlackHoleMass]);

  useEffect(() => {
    setHorizonApproach(Math.max(0, Math.min(1, approachProgress)));
  }, [approachProgress, setHorizonApproach]);

  useEffect(
    () => () => {
      massTweenRef.current?.kill();
      distanceTweenRef.current?.kill();
      accretionTweenRef.current?.kill();
      jetTweenRef.current?.kill();
    },
    [],
  );

  const triggerMatterBurst = () => {
    const id = Date.now();
    setMatterBursts((current) => [...current, { id, seed: current.length + 1 }]);
    window.setTimeout(() => {
      setMatterBursts((current) => current.filter((entry) => entry.id !== id));
    }, 1100);
  };

  const triggerJet = () => {
    setBurstId((current) => current + 1);
    setFlashId((current) => current + 1);
    triggerMatterBurst();
    setAccretionRate(1.48);
    accretionTweenRef.current?.kill();
    accretionTweenRef.current = gsap.to(
      { value: 1.48 },
      {
        value: DEFAULT_ACCRETION,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate() {
          setAccretionRate(this.targets()[0].value);
        },
      },
    );

    jetTweenRef.current?.kill();
    setJetPulse(1.65);
    jetTweenRef.current = gsap.to(
      { value: 1.65 },
      {
        value: 0,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate() {
          setJetPulse(this.targets()[0].value);
        },
      },
    );

    onWarp?.();
  };

  const animateCameraDistance = (target) => {
    distanceTweenRef.current?.kill();
    const state = { value: cameraDistance };

    distanceTweenRef.current = gsap.to(state, {
      value: target,
      duration: 3,
      ease: 'power3.inOut',
      onUpdate: () => {
        setCameraDistance(state.value);
      },
    });
  };

  const resetField = () => {
    massTweenRef.current?.kill();
    distanceTweenRef.current?.kill();
    accretionTweenRef.current?.kill();
    jetTweenRef.current?.kill();
    setRealityTear(false);
    setFlashId((current) => current + 1);
    setMatterBursts([]);

    const massState = { value: mass };
    massTweenRef.current = gsap.to(massState, {
      value: DEFAULT_MASS,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => setMass(massState.value),
    });

    const accretionState = { value: accretionRate };
    accretionTweenRef.current = gsap.to(accretionState, {
      value: DEFAULT_ACCRETION,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => setAccretionRate(accretionState.value),
    });

    animateCameraDistance(DEFAULT_DISTANCE);
    setJetPulse(0);
  };

  const increaseMass = () => {
    const nextMass = Math.min(200, mass + 5);
    setMass(nextMass);
    setFlashId((current) => current + 1);
  };

  return (
    <section
      id="black-hole"
      className={`section-shell cosmos-section relative min-h-screen ${jetPulse > 0.2 ? 'screen-shake' : ''}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, rgba(255,107,53,${0.05 + Math.max(0, approachProgress) * 0.18}), transparent 38%)`,
        }}
      />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div>
            <p className="hud-label">Section 03 // Black Hole Deep Dive</p>
            <h2 className="section-title">Lensing, accretion, and the edge where our equations begin to break.</h2>
            <p className="section-copy">
              The dashboard now drives the singularity directly: mass scales the horizon,
              camera approach compresses time, and ejected matter flares across the disk
              before spacetime settles again.
            </p>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/[0.35]">
            <div className="relative h-[34rem]">
              <Canvas camera={{ position: [0, 0, DEFAULT_DISTANCE], fov: 34 }} dpr={[1, 1.8]}>
                <ambientLight intensity={0.16} />
                <BlackHoleCameraRig distance={cameraDistance} />
                <BlackHoleCore
                  position={[0, 0, 0]}
                  scale={1.32}
                  mass={mass}
                  approach={Math.max(0, Math.min(1, approachProgress))}
                  accretionRate={accretionRate}
                  jetPulseStrength={jetPulse}
                  burstId={burstId}
                  flashId={flashId}
                />
              </Canvas>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, rgba(255,107,53,${Math.max(0, approachProgress) * 0.18}), transparent 45%)`,
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
                <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl md:min-w-[16rem]">
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
                    {approachProgress < 0.3
                      ? 'Photon orbits remain legible and the lensing ring is still separable from the horizon.'
                      : approachProgress < 0.7
                        ? 'Local clocks lag hard now. Doppler asymmetry sharpens and the disk hardens into a hotter, tighter band.'
                        : 'You are skimming the edge. The horizon dominates the frame and ordinary intuition is no longer a reliable instrument.'}
                  </p>
                </div>
              </div>
              <AnimatePresence>
                {realityTear ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.08 }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.22),rgba(106,92,255,0.18),rgba(0,0,0,0.82))]"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.1, ease: 'linear' }}
                      className="flex h-64 w-64 items-center justify-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),rgba(0,194,255,0.18),transparent_62%)]"
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
              <AnimatePresence>
                {burstParticles.map((particle) => (
                  <motion.span
                    key={particle.id}
                    initial={{ opacity: 0.9, x: 0, y: 0, scale: particle.scale }}
                    animate={{ opacity: 0, x: particle.x, y: particle.y, scale: 0.18 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.95, ease: 'easeOut', delay: particle.delay }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-plasma via-white to-nebula-blue blur-[1px]"
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <CosmicCard className="space-y-8 bg-black/[0.45]">
          <div className="telemetry-grid">
            <Telemetry label="Mass" value={`${mass.toFixed(1)} M☉`} />
            <Telemetry
              label="Schwarzschild Radius"
              value={`${schwarzschildRadiusKm.toFixed(1)} km`}
            />
            <Telemetry
              label="Hawking Temperature"
              value={`${formatScientific(hawkingTemperature)} K`}
            />
            <Telemetry label="Photon Sphere" value={`${photonSphereKm.toFixed(1)} km`} />
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-3xl font-black text-white">Gravity well controls</h3>
            <p className="copy-measure mt-0 text-white/[0.74]">
              Increase mass to expand the Schwarzschild radius, trigger matter ejection to
              flash the accretion disk, and drive the camera toward 1.2 horizon radii to
              feel the relativistic drag build in real time.
            </p>
            <div className="control-grid">
              <GlowButton onClick={increaseMass} aria-label="Increase black hole mass by five solar masses">
                Increase Mass
              </GlowButton>
              <GlowButton
                variant="ghost"
                onClick={triggerJet}
                aria-label="Eject accretion matter and trigger particle burst"
              >
                Eject Matter
              </GlowButton>
              <GlowButton
                variant="ghost"
                onClick={() => animateCameraDistance(HORIZON_DISTANCE)}
                aria-label="Approach the black hole event horizon"
              >
                Approach Event Horizon
              </GlowButton>
              <GlowButton
                variant="ghost"
                onClick={resetField}
                aria-label="Reset the black hole field to default values"
              >
                Reset Field
              </GlowButton>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/[0.45]">
                Camera Radius
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{cameraDistance.toFixed(2)} rₛ</p>
              <p className="mt-3 text-sm leading-7 text-white/[0.68]">
                The observer radius contracts from a safe remote view to 1.2 Schwarzschild
                radii, where redshift and time dilation accelerate sharply.
              </p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/5 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/[0.45]">
                Accretion Rate
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{accretionRate.toFixed(2)}x</p>
              <p className="mt-3 text-sm leading-7 text-white/[0.68]">
                Matter ejection spikes the local accretion flow briefly, brightening the disk
                before turbulence settles back toward the baseline inflow.
              </p>
            </div>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/[0.45]">
              Hover intelligence
            </p>
            <p className="mt-4 text-white/[0.76]">
              The lensing ring intensifies with mass while the accretion band preserves Doppler
              asymmetry: the approaching side beams toward blue-white and the receding side
              sinks deeper into red.
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

export default BlackHoleSimulation;
