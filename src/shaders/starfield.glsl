uniform float uTime;
varying vec3 vColor;
varying float vPhase;

float twinkle(float phase) {
  // A layered sine stack produces a star-like scintillation curve.
  float shimmer = sin(uTime * 0.6 + phase) * 0.5 + 0.5;
  float sparkle = sin(uTime * 1.4 + phase * 2.7) * 0.5 + 0.5;
  return mix(shimmer, sparkle, 0.45);
}

void main() {
  // The sprite coordinate places each fragment inside a circular star disk.
  vec2 centered = gl_PointCoord - 0.5;

  // Radial falloff softens the star edge rather than clipping it harshly.
  float radius = length(centered);

  // Twinkle modulates intensity without changing the star's spectral hue.
  float intensity = twinkle(vPhase) * smoothstep(0.5, 0.0, radius);

  // The final color respects stellar classification while blooming at the core.
  vec3 color = vColor * (0.7 + intensity * 0.8);
  gl_FragColor = vec4(color, intensity);
}
