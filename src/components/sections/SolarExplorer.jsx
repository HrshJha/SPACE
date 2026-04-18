import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { AdditiveBlending, DoubleSide } from 'three';
import { solarScale, solarSystem } from '../../constants/solarSystem.js';
import { orbitalPosition } from '../../animations/orbitalMechanics.js';
import { useCosmosStore } from '../../store/useCosmosStore.js';
import { seededRandom } from '../../utils/cosmicMath.js';
import PlanetCard from '../interactive/PlanetCard.jsx';

function PlanetOrb({ planet, selected, onSelect }) {
  const groupRef = useRef(null);
  const orbitRadius = planet.semiMajorAxisAu * solarScale.orbitCompression;
  const size = Math.max(0.18, Math.cbrt(planet.diameterKm) * solarScale.radiusCompression);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const [x, y, z] = orbitalPosition(
      state.clock.elapsedTime,
      planet.orbitalPeriodDays,
      orbitRadius,
      planet.axialTiltDeg,
    );
    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.z = (planet.axialTiltDeg * Math.PI) / 180;
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.012, orbitRadius + 0.012, 160]} />
        <meshBasicMaterial color="#22315d" transparent opacity={0.28} />
      </mesh>
      <group ref={groupRef} onClick={() => onSelect(planet.id)} scale={selected ? 1.25 : 1}>
        <mesh>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial color={planet.color} roughness={0.96} metalness={0.04} />
        </mesh>
        {selected ? (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 1.7, 72]} />
            <meshBasicMaterial color="#00c2ff" transparent opacity={0.5} side={DoubleSide} />
          </mesh>
        ) : null}
        {planet.id === 'saturn' ? (
          <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
            <ringGeometry args={[size * 1.45, size * 2.3, 120]} />
            <meshBasicMaterial color="#ffe3a6" transparent opacity={0.36} side={DoubleSide} />
          </mesh>
        ) : null}
      </group>
    </group>
  );
}

function SolarScene({ selectedPlanetId, onSelect }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 0, 0]} intensity={4} color="#f8d16b" />
      <Stars radius={120} depth={50} count={1500} factor={4} saturation={0} fade />
      <SunCorona />
      <AsteroidBelt />
      {solarSystem.map((planet) => (
        <PlanetOrb
          key={planet.id}
          planet={planet}
          selected={selectedPlanetId === planet.id}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.25}
        maxPolarAngle={Math.PI / 1.9}
        minPolarAngle={Math.PI / 2.6}
      />
    </>
  );
}

function SunCorona() {
  const coronaRef = useRef(null);

  useFrame((state) => {
    if (!coronaRef.current) {
      return;
    }

    const pulse = Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
    coronaRef.current.scale.setScalar(1.7 + pulse);
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshBasicMaterial color="#f8d16b" />
      </mesh>
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.7, 48, 48]} />
        <meshBasicMaterial
          color="#f8d16b"
          transparent
          opacity={0.12}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function AsteroidBelt() {
  const ref = useRef(null);
  const asteroidField = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const angle = seededRandom(index + 3) * Math.PI * 2;
      const radius = 9.2 + seededRandom(index * 5 + 7) * 2.4;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = (seededRandom(index * 9 + 11) - 0.5) * 0.35;
      positions[index * 3 + 2] = Math.sin(angle) * radius;
    }

    return positions;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[asteroidField, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d6b899"
        size={0.05}
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

export function SolarExplorer() {
  const selectedPlanetId = useCosmosStore((state) => state.selectedPlanetId);
  const setSelectedPlanetId = useCosmosStore((state) => state.setSelectedPlanetId);
  const planet = solarSystem.find((item) => item.id === selectedPlanetId) ?? solarSystem[2];

  return (
    <section
      id="solar-system"
      className="section-shell cosmos-section relative min-h-screen"
      style={{
        background: `radial-gradient(circle at top, ${planet.atmosphereColor}22, transparent 28%)`,
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="hud-label">Section 02 // Solar System Explorer</p>
            <h2 className="section-title">Eight worlds, one star, and gravity doing all the choreography.</h2>
            <p className="section-copy">
              Orbital periods are compressed for human patience, but the relative ordering,
              axial tilts, atmospheric hues, and planetary telemetry remain grounded in
              real data.
            </p>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-black/[0.35]">
            <div className="h-[28rem]">
              <Canvas camera={{ position: [0, 16, 24], fov: 40 }}>
                <SolarScene
                  selectedPlanetId={selectedPlanetId}
                  onSelect={setSelectedPlanetId}
                />
              </Canvas>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {solarSystem.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedPlanetId(item.id)}
                className={`glow-button-primary ${item.id === selectedPlanetId ? '' : 'glow-button-secondary'}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <PlanetCard planet={planet} />
      </div>
    </section>
  );
}

export default SolarExplorer;
