uniform float uTime;
uniform float uMass;
uniform vec2 uPointer;
uniform vec2 uMassPoint;
uniform float uMassPointStrength;
uniform float uMassPointActive;
varying vec2 vUv;
varying float vWarp;

void main() {
  // Base position begins as a flat Euclidean grid.
  vec3 transformed = position;
  vUv = uv;

  // Cursor coordinates are compared in local plane space.
  vec2 pointer = uPointer;
  vec2 delta = uv - pointer;

  // Inverse-square falloff mimics a gravity well with softening near the center.
  float distanceSquared = dot(delta, delta) + 0.005;
  float pull = uMass / distanceSquared;

  // A temporary right-click mass point creates a second, short-lived warp field.
  vec2 massDelta = uv - uMassPoint;
  float secondaryPull = 0.0;

  if (uMassPointActive > 0.5) {
    secondaryPull = (uMassPointStrength * 0.04) / (dot(massDelta, massDelta) + 0.004);
  }

  // The grid bends downward and ripples with a subtle time-varying wave.
  transformed.z -= (pull + secondaryPull) * 0.14;
  transformed.z += sin((uv.x + uv.y + uTime * 0.08) * 12.0) * 0.012;
  vWarp = pull + secondaryPull;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
