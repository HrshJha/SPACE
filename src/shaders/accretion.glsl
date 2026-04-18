uniform float uTime;
uniform float uPulse;
varying vec2 vUv;

void main() {
  // UVs are centered so the torus texture can emulate orbital flow.
  vec2 centered = vUv - 0.5;
  float radius = length(centered);
  float angle = atan(centered.y, centered.x);

  // Orbital turbulence adds plasma filaments around the disk surface.
  float turbulence = sin(angle * 16.0 + uTime * 2.0) * 0.5 + 0.5;
  float shear = sin((radius * 46.0 - uTime * 2.9) + angle * 4.6) * 0.5 + 0.5;
  float hotBand = smoothstep(0.38, 0.12, abs(radius - 0.28));

  // Doppler beaming brightens the approaching side and reddens the receding side.
  float approach = smoothstep(-1.0, 1.0, cos(angle));
  vec3 blueWhite = vec3(0.79, 0.84, 1.0);
  vec3 deepRed = vec3(1.0, 0.27, 0.0);
  vec3 color = mix(deepRed, blueWhite, approach);

  // Inner-rim heating intensifies the disk toward the event horizon.
  color *= hotBand * (1.0 + turbulence * 0.48 + shear * 0.3 + uPulse * 0.36);

  gl_FragColor = vec4(color, hotBand * 0.86);
}
