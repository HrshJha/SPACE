import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { SRGBColorSpace, TextureLoader } from 'three';
import CosmicCard from '../ui/CosmicCard.jsx';
import GlowButton from '../ui/GlowButton.jsx';
import {
  PLANET_TEXTURES,
  planetaryProfiles,
} from '../../utils/spaceData.js';

function PlanetPreview({ planetId, fallbackColor, atmosphereColor }) {
  const meshRef = useRef(null);
  const shellRef = useRef(null);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loader = new TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      PLANET_TEXTURES[planetId],
      (loadedTexture) => {
        if (!mounted) {
          return;
        }

        loadedTexture.colorSpace = SRGBColorSpace;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        if (mounted) {
          setTexture(null);
        }
      },
    );

    return () => {
      mounted = false;
    };
  }, [planetId]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.24;
    }

    if (shellRef.current) {
      shellRef.current.rotation.y -= delta * 0.12;
    }
  });

  return (
    <Float speed={1.15} rotationIntensity={0.08} floatIntensity={0.32}>
      <group>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.05, 40, 40]} />
          <meshStandardMaterial
            color={texture ? '#ffffff' : fallbackColor}
            map={texture}
            roughness={0.92}
            metalness={0.04}
          />
        </mesh>
        <mesh ref={shellRef} scale={1.08}>
          <sphereGeometry args={[1.05, 28, 28]} />
          <meshStandardMaterial
            color={atmosphereColor}
            transparent
            opacity={0.14}
            roughness={0.6}
            metalness={0}
          />
        </mesh>
      </group>
    </Float>
  );
}

function PlanetTelemetryCanvas({ planetId, fallbackColor, atmosphereColor }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.1], fov: 34 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[3.2, 2.4, 3.8]} intensity={1.55} color="#ffffff" />
      <directionalLight position={[-3, -2, -2]} intensity={0.5} color={atmosphereColor} />
      <Suspense fallback={null}>
        <PlanetPreview
          planetId={planetId}
          fallbackColor={fallbackColor}
          atmosphereColor={atmosphereColor}
        />
      </Suspense>
    </Canvas>
  );
}

function DataBlock({ label, value }) {
  return (
    <div className="rounded-[14px] border border-white/10 bg-black/20 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/84">{value}</p>
    </div>
  );
}

export function PlanetCard({ planet }) {
  const [expanded, setExpanded] = useState(false);
  const profile = useMemo(
    () => ({
      ...planet,
      ...planetaryProfiles[planet.id],
    }),
    [planet],
  );

  const stats = useMemo(
    () => [
      { label: 'Type', value: profile.type },
      { label: 'Diameter', value: profile.diameter },
      { label: 'Mass', value: profile.mass },
      { label: 'Gravity', value: profile.gravity },
      { label: 'Orbital Period', value: profile.orbitalPeriod },
      { label: 'Distance From Sun', value: profile.distanceFromSun },
      { label: 'Average Temperature', value: profile.avgTemperature },
      { label: 'Axial Tilt', value: profile.axialTilt },
    ],
    [profile],
  );

  return (
    <>
      <CosmicCard className="border-white/[0.12] bg-black/[0.42]">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            <div className="h-72 overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.42))]">
              <PlanetTelemetryCanvas
                planetId={planet.id}
                fallbackColor={planet.color}
                atmosphereColor={planet.atmosphereColor}
              />
            </div>
            <div className="control-grid">
              <GlowButton
                onClick={() => setExpanded(true)}
                aria-label={`Expand ${profile.name} telemetry overlay`}
              >
                Expand Telemetry
              </GlowButton>
              <GlowButton
                variant="ghost"
                onClick={() => setExpanded(true)}
                aria-label={`Focus ${profile.name} planet render`}
              >
                Focus Planet
              </GlowButton>
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/45">
                Planet telemetry
              </p>
              <h3 className="font-display text-[clamp(2rem,4vw,3.35rem)] font-black text-white">
                {profile.name}
              </h3>
              <p className="text-sm uppercase tracking-[0.24em] text-nebula-blue">{profile.type}</p>
              <p className="copy-measure mt-0 text-sm text-white/72">{profile.fact}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.slice(0, 6).map((item) => (
                <DataBlock key={item.label} label={item.label} value={item.value} />
              ))}
            </div>
            <div className="grid gap-3">
              <DataBlock label="Atmospheric Composition" value={profile.atmosphere} />
              <DataBlock label="Named Moons" value={profile.moons} />
              <DataBlock label="Mission That Visited" value={profile.mission} />
            </div>
          </div>
        </div>
      </CosmicCard>

      <AnimatePresence>
        {expanded ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[74] flex items-center justify-center bg-black/78 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="cosmic-card w-full max-w-6xl border-nebula-blue/20 bg-black/85"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-nebula-blue">
                        Focused Planet Telemetry
                      </p>
                      <h3 className="mt-3 font-display text-[clamp(2.2rem,4vw,4rem)] font-black text-white">
                        {profile.name}
                      </h3>
                    </div>
                    <GlowButton
                      variant="ghost"
                      onClick={() => setExpanded(false)}
                      aria-label={`Close ${profile.name} telemetry overlay`}
                    >
                      Close Overlay
                    </GlowButton>
                  </div>
                  <div className="h-[26rem] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.48))]">
                    <PlanetTelemetryCanvas
                      planetId={planet.id}
                      fallbackColor={planet.color}
                      atmosphereColor={planet.atmosphereColor}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="copy-measure mt-0 text-base text-white/76">{profile.fact}</p>
                  <div className="telemetry-grid">
                    {stats.map((item) => (
                      <DataBlock key={item.label} label={item.label} value={item.value} />
                    ))}
                  </div>
                  <div className="grid gap-3">
                    <DataBlock label="Atmospheric Composition" value={profile.atmosphere} />
                    <DataBlock label="Named Moons" value={profile.moons} />
                    <DataBlock label="Mission That Visited" value={profile.mission} />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default PlanetCard;
