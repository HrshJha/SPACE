import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import StarField from './StarField.jsx';
import NebulaLayer from './NebulaLayer.jsx';
import SpacetimeGrid from './SpacetimeGrid.jsx';
import ParticleSystem from './ParticleSystem.jsx';
import BlackHoleCore from './BlackHoleCore.jsx';

export function CosmicScene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;

  if (isMobile) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 bg-cosmos" aria-hidden="true" />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 1.8]}>
        <PerspectiveCamera makeDefault position={[0, 0, 22]} fov={42} />
        <Suspense fallback={null}>
          <StarField />
          <NebulaLayer />
          <ParticleSystem />
          <BlackHoleCore interactive={false} scale={1.2} />
          <SpacetimeGrid />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default CosmicScene;
