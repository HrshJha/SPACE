uniform float uTime;
uniform float uMass;
varying vec2 vUv;

float starField(vec2 point) {
  // A hash-style star sampler provides tiny background light sources.
  vec2 cell = floor(point * 80.0);
  float seed = fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453);
  return smoothstep(0.985, 1.0, seed);
}

void main() {
  // UVs are centered to measure distance from the lens.
  vec2 centered = vUv - 0.5;
  float radius = length(centered);

  // A simple Schwarzschild-inspired radial bend warps the background stars.
  float bend = uMass * 0.026 / max(radius * radius + 0.002, 0.01);
  vec2 bentUv = vUv + normalize(centered + 0.0001) * bend;

  // The distant stars are sampled after distortion to create an Einstein ring hint.
  float stars = starField(bentUv + vec2(uTime * 0.002, 0.0));
  vec3 color = vec3(stars);

  // The photon sphere amplifies the warped light without filling the horizon.
  float ring = smoothstep(0.24, 0.16, abs(radius - 0.2));
  float secondaryRing = smoothstep(0.34, 0.26, abs(radius - 0.28));
  color += vec3(0.0, 0.76, 1.0) * ring * 0.72;
  color += vec3(0.42, 0.54, 1.0) * secondaryRing * 0.28;

  gl_FragColor = vec4(color, ring * 0.38 + secondaryRing * 0.18 + stars * 0.68);
}
