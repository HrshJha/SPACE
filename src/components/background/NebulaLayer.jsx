import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color } from 'three';
import { useFrame } from '@react-three/fiber';
import nebulaFragment from '../../shaders/nebula.glsl?raw';
import { generateNebulaNodes } from '../../utils/cosmicMath.js';
import { cosmicPalette } from '../../constants/cosmicPalette.js';
import { useCosmosStore } from '../../store/useCosmosStore.js';

const nebulaVertex = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function NebulaBillboard({ position, colors, opacity }) {
  const materialRef = useRef(null);

  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uOpacity.value = opacity;
  });

  return (
    <mesh position={position} frustumCulled>
      <planeGeometry args={[44, 28, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uOpacity: { value: opacity },
          uColorA: { value: new Color(colors[0]) },
          uColorB: { value: new Color(colors[1]) },
          uColorC: { value: new Color(colors[2]) },
        }}
      />
    </mesh>
  );
}

export function NebulaLayer() {
  const scrollProgress = useCosmosStore((state) => state.scrollProgress);
  const nebulaNodes = useMemo(() => generateNebulaNodes(), []);
  const opacity = 0.18 + scrollProgress * 0.34;

  return (
    <group>
      <NebulaBillboard
        position={nebulaNodes[0].position}
        colors={[
          cosmicPalette.pillarsGold,
          cosmicPalette.nebulaBlue,
          cosmicPalette.plasmaOrange,
        ]}
        opacity={opacity * 0.85}
      />
      <NebulaBillboard
        position={nebulaNodes[1].position}
        colors={[
          cosmicPalette.orionPurple,
          cosmicPalette.orionMagenta,
          cosmicPalette.quantumPurple,
        ]}
        opacity={opacity}
      />
      <NebulaBillboard
        position={nebulaNodes[2].position}
        colors={[
          cosmicPalette.crabRed,
          cosmicPalette.crabOrange,
          cosmicPalette.plasmaOrange,
        ]}
        opacity={opacity * 0.9}
      />
    </group>
  );
}

export default NebulaLayer;
