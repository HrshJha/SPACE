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

export function BlackHoleCore({
  interactive = true,
  scale = 1,
  position = [0, 5, -18],
  mass,
  approach,
  jetPulseStrength,
  accretionRate = 1,
  burstId = 0,
  flashId = 0,
}) {
  const coreRef = useRef(null);
  const lensRef = useRef(null);
  const diskRef = useRef(null);
  const jetTopRef = useRef(null);
  const jetBottomRef = useRef(null);
  const coronaRef = useRef(null);
  const tearTimerRef = useRef(0);
  const setCursor = useCosmosStore((state) => state.setCursor);
  const storeMass = useCosmosStore((state) => state.blackHoleMass);
  const storeApproach = useCosmosStore((state) => state.horizonApproach);
  const storeJetPulse = useCosmosStore((state) => state.jetPulse);
  const setRealityTear = useCosmosStore((state) => state.setRealityTear);
  const [hovered, setHovered] = useState(false);
  const burstRef = useRef(0);
  const flashRef = useRef(0);
  const lensUniformsRef = useRef({
    uTime: { value: 0 },
    uMass: { value: 1.9 },
  });
  const coreUniformsRef = useRef({
    uTime: { value: 0 },
    uSpin: { value: 1.15 },
    uHover: { value: 0.2 },
  });
  const diskUniformsRef = useRef({
    uTime: { value: 0 },
    uPulse: { value: 0 },
  });

  const resolvedMass = mass ?? storeMass;
  const resolvedApproach = approach ?? storeApproach;
  const resolvedJetPulse = jetPulseStrength ?? storeJetPulse;

  useEffect(
    () => () => {
      window.clearTimeout(tearTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    burstRef.current = 1.65;
  }, [burstId]);

  useEffect(() => {
    flashRef.current = 1.35;
  }, [flashId]);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const lensUniforms = lensUniformsRef.current;
    const coreUniforms = coreUniformsRef.current;
    const diskUniforms = diskUniformsRef.current;
    const proximityBoost = 1 + resolvedApproach * 0.68;
    const massBoost = resolvedMass / 28;
    const accretionBoost = 1 + (accretionRate - 1) * 0.65;

    lensUniforms.uTime.value = elapsed;
    lensUniforms.uMass.value = lerp(
      lensUniforms.uMass.value,
      (resolvedMass / 18) * proximityBoost,
      delta * 1.65,
    );

    coreUniforms.uTime.value = elapsed;
    coreUniforms.uHover.value = lerp(
      coreUniforms.uHover.value,
      hovered ? 1.1 + resolvedApproach * 0.45 : 0.26 + resolvedApproach * 0.48,
      delta * 2.4,
    );
    coreUniforms.uSpin.value = lerp(
      coreUniforms.uSpin.value,
      1.15 + resolvedApproach * 0.85 + resolvedJetPulse * 0.24 + (accretionRate - 1) * 0.55,
      delta * 1.8,
    );

    burstRef.current = clamp(burstRef.current - delta * 0.42, 0, 1.65);
    flashRef.current = clamp(flashRef.current - delta * 0.85, 0, 1.35);
    diskUniforms.uTime.value = elapsed;
    diskUniforms.uPulse.value =
      burstRef.current + flashRef.current + resolvedJetPulse * 0.66 + (accretionRate - 1) * 0.48;

    if (coreRef.current) {
      coreRef.current.rotation.z += delta * 0.08 * proximityBoost * accretionBoost;
      coreRef.current.scale.setScalar(scale * (1 + resolvedApproach * 0.12 + massBoost * 0.01));
    }

    if (diskRef.current) {
      diskRef.current.rotation.z -= delta * (0.3 + resolvedJetPulse * 0.12 + (accretionRate - 1) * 0.18);
      diskRef.current.scale.setScalar(1 + resolvedApproach * 0.1);
    }

    if (lensRef.current) {
      lensRef.current.scale.setScalar(scale * (1.8 + resolvedApproach * 0.38 + massBoost * 0.03));
    }

    if (coronaRef.current) {
      const coronaScale = 1.15 + flashRef.current * 0.22 + resolvedApproach * 0.16;
      coronaRef.current.scale.setScalar(coronaScale);
      coronaRef.current.material.opacity = 0.08 + flashRef.current * 0.12 + resolvedApproach * 0.06;
    }

    if (jetTopRef.current && jetBottomRef.current) {
      const jetScale = 1 + resolvedJetPulse * 1.45 + resolvedApproach * 0.72;
      const jetWidth = 1 + resolvedJetPulse * 0.34;
      jetTopRef.current.scale.set(jetWidth, jetScale, jetWidth);
      jetBottomRef.current.scale.set(jetWidth, jetScale, jetWidth);
      jetTopRef.current.material.opacity = 0.08 + resolvedJetPulse * 0.24;
      jetBottomRef.current.material.opacity = 0.08 + resolvedJetPulse * 0.24;
    }
  });

  return (
    <group position={position}>
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
          if (!interactive) {
            return;
          }

          setHovered(true);
          setCursor({ hovering: true });
        }}
        onPointerOut={() => {
          if (!interactive) {
            return;
          }

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

          burstRef.current = 1.65;
        }}
      >
        <mesh ref={coronaRef} scale={1.15} frustumCulled>
          <sphereGeometry args={[2.44, 40, 40]} />
          <meshBasicMaterial
            color="#00c2ff"
            transparent
            opacity={0.08}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
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
        <mesh ref={diskRef} rotation={[Math.PI / 2.62, 0, 0]} frustumCulled>
          <torusGeometry args={[2.02, 0.34, 28, 160]} />
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
        <mesh rotation={[Math.PI / 2.46, 0.2, Math.PI / 2]} scale={[1.02, 1.14, 1.02]}>
          <torusGeometry args={[2.12, 0.18, 24, 160]} />
          <meshBasicMaterial
            color="#ff6b35"
            transparent
            opacity={0.16}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.96, 0, Math.PI / 7]} scale={[1, 1.44, 1]}>
          <torusGeometry args={[2.72, 0.028, 12, 120]} />
          <meshBasicMaterial
            color="#6a5cff"
            transparent
            opacity={0.22}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.75, 0, -Math.PI / 7]} scale={[1, 1.62, 1]}>
          <torusGeometry args={[2.94, 0.022, 12, 120]} />
          <meshBasicMaterial
            color="#00c2ff"
            transparent
            opacity={0.19}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={jetTopRef} position={[0, 4.35, 0]}>
          <cylinderGeometry args={[0.045, 0.21, 6.2, 24, 1, true]} />
          <meshBasicMaterial
            color="#00c2ff"
            transparent
            opacity={0.12}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={jetBottomRef} position={[0, -4.35, 0]}>
          <cylinderGeometry args={[0.045, 0.21, 6.2, 24, 1, true]} />
          <meshBasicMaterial
            color="#ff6b35"
            transparent
            opacity={0.12}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0, 0.1]} frustumCulled>
          <circleGeometry args={[1.06, 72]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.99} />
        </mesh>
      </group>
    </group>
  );
}

export default BlackHoleCore;
