import { useMemo, useRef } from 'react';
import { AdditiveBlending, Vector2 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useCosmosStore } from '../../store/useCosmosStore.js';
import { seededRandom } from '../../utils/cosmicMath.js';

const particleVertex = `
uniform float uTime;
uniform vec2 uPointer;
uniform float uStrength;
uniform vec2 uMassPoint;
uniform float uMassPointStrength;
uniform float uMassPointActive;
attribute float aScale;
varying float vAlpha;

void main() {
  vec3 transformed = position;
  vec2 pointer = uPointer * 2.0 - 1.0;

  // A softened inverse-square attraction pulls particles into a wake.
  vec2 delta = transformed.xy - pointer * 18.0;
  float distanceSquared = dot(delta, delta) + 1.4;
  float gravity = uStrength / distanceSquared;

  vec2 massPoint = uMassPoint * 2.0 - 1.0;
  vec2 deltaMass = transformed.xy - massPoint * 18.0;
  float secondaryGravity = 0.0;

  if (uMassPointActive > 0.5) {
    secondaryGravity = (uMassPointStrength * 1.6) / (dot(deltaMass, deltaMass) + 1.4);
  }

  // Time adds slight drift so the field never looks static.
  transformed.x -= delta.x * gravity * 2.4 + deltaMass.x * secondaryGravity * 2.8 + sin(uTime + position.y) * 0.02;
  transformed.y -= delta.y * gravity * 2.0 + deltaMass.y * secondaryGravity * 2.8 + cos(uTime + position.x) * 0.02;
  transformed.z += sin(uTime * 0.3 + position.x * 0.1 + position.y * 0.1) * 0.2;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  gl_PointSize = aScale * (28.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;

  vAlpha = clamp(1.0 / abs(mvPosition.z), 0.04, 0.5);
}
`;

const particleFragment = `
varying float vAlpha;

void main() {
  // The radial falloff keeps each particle soft and dust-like.
  vec2 centered = gl_PointCoord - 0.5;
  float fade = smoothstep(0.5, 0.0, length(centered));
  gl_FragColor = vec4(0.29, 0.62, 1.0, fade * vAlpha);
}
`;

export function ParticleSystem() {
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const cursor = useCosmosStore((state) => state.cursor);
  const temporaryMassPoint = useCosmosStore((state) => state.temporaryMassPoint);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 8000 : 50000;
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (seededRandom(index + 1) - 0.5) * 56;
      positions[index * 3 + 1] = (seededRandom(index * 3 + 9) - 0.5) * 32;
      positions[index * 3 + 2] = -10 - seededRandom(index * 5 + 13) * 90;
      scales[index] = seededRandom(index * 7 + 17) * 1.8 + 0.6;
    }

    return { positions, scales };
  }, [count]);

  useFrame((state) => {
    if (!materialRef.current || !pointsRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uPointer.value.set(
      cursor.x / window.innerWidth,
      1 - cursor.y / window.innerHeight,
    );
    materialRef.current.uniforms.uStrength.value = 1.8 + cursor.mass * 0.8;
    materialRef.current.uniforms.uMassPoint.value.set(
      temporaryMassPoint.x,
      temporaryMassPoint.y,
    );
    materialRef.current.uniforms.uMassPointStrength.value =
      temporaryMassPoint.strength;
    materialRef.current.uniforms.uMassPointActive.value =
      temporaryMassPoint.active ? 1 : 0;
  });

  return (
    <points ref={pointsRef} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[data.scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uPointer: { value: new Vector2(0.5, 0.5) },
          uStrength: { value: 1.5 },
          uMassPoint: { value: new Vector2(0.5, 0.5) },
          uMassPointStrength: { value: 0 },
          uMassPointActive: { value: 0 },
        }}
      />
    </points>
  );
}

export default ParticleSystem;
