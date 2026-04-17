import { useRef } from 'react';
import { AdditiveBlending, Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';
import spacetimeVertex from '../../shaders/spacetime.glsl?raw';
import { useCosmosStore } from '../../store/useCosmosStore.js';

const spacetimeFragment = `
varying vec2 vUv;
varying float vWarp;

void main() {
  // UV distance creates faint node points across the grid intersections.
  vec2 grid = abs(fract(vUv * 40.0 - 0.5) - 0.5) / fwidth(vUv * 40.0);
  float line = 1.0 - min(min(grid.x, grid.y), 1.0);

  // Warp boosts the local luminosity where gravity is strongest.
  vec3 base = vec3(0.04, 0.04, 0.18);
  vec3 glow = vec3(0.29, 0.62, 1.0) * clamp(vWarp * 0.08, 0.0, 1.0);

  gl_FragColor = vec4(base + glow + line * 0.12, 0.12 + line * 0.08);
}
`;

export function SpacetimeGrid() {
  const materialRef = useRef(null);
  const cursor = useCosmosStore((state) => state.cursor);
  const scrollProgress = useCosmosStore((state) => state.scrollProgress);
  const temporaryMassPoint = useCosmosStore((state) => state.temporaryMassPoint);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useFrame((state) => {
    if (!materialRef.current || isMobile) {
      return;
    }

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uMass.value = 0.03 + scrollProgress * 0.2;
    materialRef.current.uniforms.uPointer.value.set(
      cursor.x / window.innerWidth,
      1 - cursor.y / window.innerHeight,
    );
    materialRef.current.uniforms.uMassPoint.value.set(
      temporaryMassPoint.x,
      temporaryMassPoint.y,
    );
    materialRef.current.uniforms.uMassPointStrength.value =
      temporaryMassPoint.strength;
    materialRef.current.uniforms.uMassPointActive.value =
      temporaryMassPoint.active ? 1 : 0;
  });

  if (isMobile) {
    return null;
  }

  return (
    <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -8, -18]} frustumCulled>
      <planeGeometry args={[96, 96, 100, 100]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={spacetimeVertex}
        fragmentShader={spacetimeFragment}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uMass: { value: 0.12 },
          uPointer: { value: new Vector2(0.5, 0.5) },
          uMassPoint: { value: new Vector2(0.5, 0.5) },
          uMassPointStrength: { value: 0 },
          uMassPointActive: { value: 0 },
        }}
      />
    </mesh>
  );
}

export default SpacetimeGrid;
