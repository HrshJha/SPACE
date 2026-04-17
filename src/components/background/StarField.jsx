import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color, Vector2 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import starfieldFragment from '../../shaders/starfield.glsl?raw';
import { generateStarField, lerp } from '../../utils/cosmicMath.js';
import { useCosmosStore } from '../../store/useCosmosStore.js';

const starfieldVertex = `
uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uPointer;
uniform float uMass;
attribute float size;
attribute float phase;
varying vec3 vColor;
varying float vPhase;

void main() {
  vColor = color;
  vPhase = phase;

  vec3 transformed = position;
  vec2 pointerLocal = (uPointer - 0.5) * vec2(58.0, 32.0);
  vec2 delta = transformed.xy - pointerLocal;
  float drift = clamp((uMass * 18.0) / (dot(delta, delta) + 180.0), 0.0, 1.0);

  transformed.xy -= normalize(delta + vec2(0.0001)) * drift * 2.2;

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
  float depthFade = 1.0 / max(0.6, -mvPosition.z);
  float shimmer = sin(uTime * 0.5 + phase) * 0.5 + 0.5;
  gl_PointSize = size * depthFade * (1.2 + shimmer * 0.8) * uPixelRatio;
  gl_Position = projectionMatrix * mvPosition;
}
`;

function StarLayer({ count, parallaxFactor, depthOffset }) {
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const { gl } = useThree();
  const cursor = useCosmosStore((state) => state.cursor);
  const starField = useMemo(() => generateStarField(count), [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uPixelRatio.value = gl.getPixelRatio();
    materialRef.current.uniforms.uPointer.value.set(
      cursor.x / window.innerWidth,
      1 - cursor.y / window.innerHeight,
    );
    materialRef.current.uniforms.uMass.value = cursor.mass;
    pointsRef.current.position.x = lerp(
      pointsRef.current.position.x,
      ((cursor.x / window.innerWidth) - 0.5) * parallaxFactor,
      delta * 2.5,
    );
    pointsRef.current.position.y = lerp(
      pointsRef.current.position.y,
      -((cursor.y / window.innerHeight) - 0.5) * parallaxFactor,
      delta * 2.5,
    );
  });

  return (
    <points ref={pointsRef} position={[0, 0, -depthOffset]} frustumCulled>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starField.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[starField.colors, 3]}
        />
        <bufferAttribute attach="attributes-size" args={[starField.sizes, 1]} />
        <bufferAttribute attach="attributes-phase" args={[starField.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        fragmentShader={starfieldFragment}
        vertexShader={starfieldVertex}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        vertexColors
        uniforms={{
          uTime: { value: 0 },
          uPixelRatio: { value: gl.getPixelRatio() },
          uPointer: { value: new Vector2(0.5, 0.5) },
          uMass: { value: 1 },
        }}
      />
    </points>
  );
}

function ShootingStars() {
  const refs = useRef([]);
  const streaks = useMemo(
    () => [
      { offset: 0.08, y: 14, z: -36, speed: 0.22 },
      { offset: 0.38, y: -4, z: -28, speed: 0.18 },
      { offset: 0.72, y: 8, z: -24, speed: 0.2 },
    ],
    [],
  );

  useFrame((state) => {
    refs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const streak = streaks[index];
      const cycle = (state.clock.elapsedTime * streak.speed + streak.offset) % 1;

      if (cycle < 0.2) {
        const progress = cycle / 0.2;
        mesh.visible = true;
        mesh.position.set(-28 + progress * 56, streak.y - progress * 16, streak.z);
        mesh.material.opacity = (1 - progress) * 0.9;
      } else {
        mesh.visible = false;
      }
    });
  });

  return (
    <group>
      {streaks.map((streak, index) => (
        <mesh
          key={streak.offset}
          ref={(node) => {
            refs.current[index] = node;
          }}
          rotation={[0, 0, -0.35]}
          visible={false}
        >
          <planeGeometry args={[5.8, 0.08]} />
          <meshBasicMaterial
            color="#cad7ff"
            transparent
            opacity={0.9}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export function StarField() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <group>
      <color attach="background" args={[new Color('#000000')]} />
      <StarLayer count={isMobile ? 1200 : 6000} parallaxFactor={0.6} depthOffset={120} />
      <StarLayer count={isMobile ? 900 : 5000} parallaxFactor={1.4} depthOffset={90} />
      <StarLayer count={isMobile ? 700 : 4000} parallaxFactor={2.2} depthOffset={70} />
      <ShootingStars />
    </group>
  );
}

export default StarField;
