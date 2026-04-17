uniform float uTime;
uniform float uSpin;
uniform float uHover;
varying vec2 vUv;

float ring(vec2 point, float radius, float width) {
  // The accretion silhouette is softened so the lensing ring feels luminous.
  return smoothstep(radius + width, radius, length(point))
    - smoothstep(radius, radius - width, length(point));
}

void main() {
  // UVs are centered to treat the black hole as a radial lens.
  vec2 centered = vUv - 0.5;

  // Radius approximates distance from the event horizon in screen space.
  float radius = length(centered);

  // Angular motion implies a rotating spacetime metric around the singularity.
  float angle = atan(centered.y, centered.x) + uTime * (0.1 + uSpin * 0.04);

  // Lensing grows sharply near the photon sphere.
  float lensing = 0.012 / max(radius * radius, 0.006);
  vec2 bent = centered + normalize(centered) * lensing;

  // The warped field produces secondary image streaks around the horizon.
  float streaks = sin(angle * 8.0 - uTime * 0.8) * 0.5 + 0.5;
  float photonRing = ring(bent, 0.23 + uHover * 0.02, 0.035);
  float halo = smoothstep(0.42, 0.08, radius);

  // The event horizon itself remains black; only the surrounding light survives.
  vec3 color = mix(vec3(0.08, 0.11, 0.28), vec3(0.79, 0.84, 1.0), streaks);
  color *= photonRing * (0.6 + halo * 0.4);

  float alpha = photonRing * 0.95 + halo * 0.12;
  if (radius < 0.17) {
    color = vec3(0.0);
    alpha = 1.0;
  }

  gl_FragColor = vec4(color, alpha);
}
