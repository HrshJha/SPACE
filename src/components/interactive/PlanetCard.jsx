import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Float } from '@react-three/drei';
import { metric } from '../../utils/cosmicMath.js';
import CosmicCard from '../ui/CosmicCard.jsx';

function PlanetPreview({ color }) {
  const ref = useRef(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.4}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.08, 48, 48]} />
        <meshStandardMaterial color={color} roughness={0.95} metalness={0.05} />
      </mesh>
    </Float>
  );
}

export function PlanetCard({ planet }) {
  return (
    <CosmicCard className="border-white/[0.12] bg-black/[0.35]">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="h-64 overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.28))]">
          <Canvas camera={{ position: [0, 0, 3.2], fov: 35 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[2, 2, 4]} intensity={1.2} />
            <PlanetPreview color={planet.color} />
          </Canvas>
        </div>
        <div className="space-y-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/[0.45]">
              Planet telemetry
            </p>
            <h3 className="mt-2 font-display text-4xl font-black text-white">
              {planet.name}
            </h3>
            <p className="mt-3 max-w-xl text-white/[0.72]">
              {planet.fact}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Mass" value={metric(planet.massEarths, 'Earths')} />
            <Metric label="Diameter" value={metric(planet.diameterKm, 'km')} />
            <Metric label="Gravity" value={metric(planet.gravityMs2, 'm/s²')} />
            <Metric label="Moons" value={planet.moonCount} />
            <Metric
              label="Orbital Period"
              value={metric(planet.orbitalPeriodDays, 'days')}
            />
            <Metric
              label="Distance from Sun"
              value={`${planet.distanceFromSunKm} km`}
            />
          </div>
        </div>
      </div>
    </CosmicCard>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/[0.45]">
        {label}
      </p>
      <p className="mt-2 text-lg text-white">{value}</p>
    </div>
  );
}

export default PlanetCard;
