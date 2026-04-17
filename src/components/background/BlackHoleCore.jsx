import { useEffect, useRef, useState } from 'react';
import { AdditiveBlending, DoubleSide } from 'three';
import { useFrame } from '@react-three/fiber';
import blackholeFragment from '../../shaders/blackhole.glsl?raw';
import accretionFragment from '../../shaders/accretion.glsl?raw';
import lensingFragment from '../../shaders/lensing.glsl?raw';
import { useCosmosStore } from '../../store/useCosmosStore.js';
import { clamp, lerp } from '../../utils/cosmicMath.js';

const fullscreenVertex = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export function BlackHoleCore({ interactive = true, scale = 1 }) {
  const coreRef = useRef(null);
  const lensRef = useRef(null);
  const diskRef = useRef(null);
  const jetTopRef = useRef(null);
  const jetBottomRef = useRef(null);
  const tearTimerRef = useRef(0);
  const setCursor = useCosmosStore((state) => state.setCursor);
  const blackHoleMass = useCosmosStore((state) => state.blackHoleMass);
  const horizonApproach = useCosmosStore((state) => state.horizonApproach);
  const jetPulse = useCosmosStore((state) => state.jetPulse);
  const setRealityTear = useCosmosStore((state) => state.setRealityTear);
  const [hovered, setHovered] = useState(false);
  const burstRef = useRef(0);
  const lensUniformsRef = useRef({
    uTime: { value: 0 },
    uMass: { value: blackHoleMass / 28 },
  });
  const coreUniformsRef = useRef({
    uTime: { value: 0 },
    uSpin: { value: 0.8 },
    uHover: { value: 0 },
  });
  const diskUniformsRef = useRef({
    uTime: { value: 0 },
    uPulse: { value: 0 },
  });

  useEffect(
    () => () => {
      window.clearTimeout(tearTimerRef.current);
    },
    [],
  );

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const lensUniforms = lensUniformsRef.current;
    const coreUniforms = coreUniformsRef.current;
    const diskUniforms = diskUniformsRef.current;
    const proximityBoost = 1 + horizonApproach * 0.45;

    lensUniforms.uTime.value = elapsed;
    lensUniforms.uMass.value = lerp(
      lensUniforms.uMass.value,
      (blackHoleMass / 26) * proximityBoost,
      delta * 1.8,
    );
    coreUniforms.uTime.value = elapsed;
    coreUniforms.uHover.value = lerp(
      coreUniforms.uHover.value,
      hovered ? 1 + horizonApproach * 0.35 : horizonApproach * 0.4,
      delta * 2.2,
    );
    coreUniforms.uSpin.value = lerp(
      coreUniforms.uSpin.value,
      hovered ? 1.7 + jetPulse * 0.15 : 0.9 + horizonApproach * 0.32,
      delta * 1.6,
    );
    diskUniforms.uTime.value = elapsed;
    burstRef.current = clamp(burstRef.current - delta * 0.4, 0, 1.5);
    diskUniforms.uPulse.value = burstRef.current + jetPulse * 0.55;

    if (coreRef.current) {
      coreRef.current.rotation.z += delta * (hovered ? 0.12 : 0.05) * proximityBoost;
      coreRef.current.scale.setScalar(scale * proximityBoost);
    }

    if (diskRef.current) {
      diskRef.current.rotation.z -= delta * (0.18 + jetPulse * 0.08);
    }

    if (lensRef.current) {
      lensRef.current.scale.setScalar(scale * (1.6 + horizonApproach * 0.2));
    }

    if (jetTopRef.current && jetBottomRef.current) {
      const jetScale = 1 + jetPulse * 1.35 + horizonApproach * 0.5;
      jetTopRef.current.scale.set(1 + jetPulse * 0.25, jetScale, 1 + jetPulse * 0.25);
      jetBottomRef.current.scale.set(
        1 + jetPulse * 0.25,
        jetScale,
        1 + jetPulse * 0.25,
      );
      jetTopRef.current.material.opacity = 0.08 + jetPulse * 0.2;
      jetBottomRef.current.material.opacity = 0.08 + jetPulse * 0.2;
    }
  });

  return (
    <group position={[0, 5, -18]}>
      <mesh ref={lensRef} frustumCulled>
        <planeGeometry args={[10, 10, 1, 1]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={DoubleSide}
          blending={AdditiveBlending}
          vertexShader={fullscreenVertex}
          fragmentShader={lensingFragment}
          uniforms={lensUniformsRef.current}
        />
      </mesh>
      <group
        ref={coreRef}
        onPointerOver={() => {
          if (!interactive) return;
          setHovered(true);
          setCursor({ hovering: true });
        }}
        onPointerOut={() => {
          if (!interactive) return;
          setHovered(false);
          setCursor({ hovering: false });
        }}
        onClick={(event) => {
          const dx = (event.uv?.x ?? 0.5) - 0.5;
          const dy = (event.uv?.y ?? 0.5) - 0.5;

          if (Math.hypot(dx, dy) < 0.11) {
            setRealityTear(true);
            window.clearTimeout(tearTimerRef.current);
            tearTimerRef.current = window.setTimeout(() => {
              setRealityTear(false);
            }, 1400);
          }

          burstRef.current = 1.5;
        }}
      >
        <mesh frustumCulled>
          <planeGeometry args={[6.4, 6.4, 1, 1]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            side={DoubleSide}
            blending={AdditiveBlending}
            vertexShader={fullscreenVertex}
            fragmentShader={blackholeFragment}
            uniforms={coreUniformsRef.current}
          />
        </mesh>
        <mesh ref={diskRef} rotation={[Math.PI / 2.6, 0, 0]} frustumCulled>
          <torusGeometry args={[2.2, 0.52, 24, 120]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            side={DoubleSide}
            vertexShader={fullscreenVertex}
            fragmentShader={accretionFragment}
            uniforms={diskUniformsRef.current}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.45, 0.18, Math.PI / 2]} scale={[1.02, 1.08, 1.02]}>
          <torusGeometry args={[2.28, 0.24, 20, 120]} />
          <meshBasicMaterial
            color="#ff6b35"
            transparent
            opacity={0.14}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.95, 0, Math.PI / 7]} scale={[1, 1.5, 1]}>
          <torusGeometry args={[2.9, 0.03, 12, 96]} />
          <meshBasicMaterial
            color="#7b4fff"
            transparent
            opacity={0.22}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.75, 0, -Math.PI / 7]} scale={[1, 1.7, 1]}>
          <torusGeometry args={[3.15, 0.025, 12, 96]} />
          <meshBasicMaterial
            color="#4a9eff"
            transparent
            opacity={0.18}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={jetTopRef} position={[0, 4.5, 0]}>
          <cylinderGeometry args={[0.05, 0.22, 6.2, 20, 1, true]} />
          <meshBasicMaterial
            color="#4a9eff"
            transparent
            opacity={0.12}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={jetBottomRef} position={[0, -4.5, 0]}>
          <cylinderGeometry args={[0.05, 0.22, 6.2, 20, 1, true]} />
          <meshBasicMaterial
            color="#ff6b35"
            transparent
            opacity={0.12}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0, 0.1]} frustumCulled>
          <circleGeometry args={[1.12, 64]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.98} />
        </mesh>
      </group>
    </group>
  );
}

export default BlackHoleCore;
