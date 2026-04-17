uniform float uTime;
uniform float uOpacity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying vec2 vUv;

float hash(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 point) {
  // Integer and fractional components are separated for smooth interpolation.
  vec2 cell = floor(point);
  vec2 fraction = fract(point);

  // Corner samples define the local random field.
  float a = hash(cell);
  float b = hash(cell + vec2(1.0, 0.0));
  float c = hash(cell + vec2(0.0, 1.0));
  float d = hash(cell + vec2(1.0, 1.0));

  // Hermite interpolation avoids visible grid seams.
  vec2 smoothFraction = fraction * fraction * (3.0 - 2.0 * fraction);

  return mix(a, b, smoothFraction.x)
    + (c - a) * smoothFraction.y * (1.0 - smoothFraction.x)
    + (d - b) * smoothFraction.x * smoothFraction.y;
}

float fbm(vec2 point) {
  // Fractal Brownian motion layers several octaves into a cloud volume.
  float value = 0.0;
  float amplitude = 0.55;

  for (int octave = 0; octave < 5; octave++) {
    value += amplitude * noise(point);
    point *= 2.02;
    amplitude *= 0.5;
  }

  return value;
}

vec2 curlField(vec2 point) {
  // The curl approximation creates rotational flow instead of linear drift.
  float sampleOffset = 0.08;
  float top = fbm(point + vec2(0.0, sampleOffset));
  float bottom = fbm(point - vec2(0.0, sampleOffset));
  float right = fbm(point + vec2(sampleOffset, 0.0));
  float left = fbm(point - vec2(sampleOffset, 0.0));

  return normalize(vec2(top - bottom, left - right));
}

void main() {
  // UV space is remapped around the center to create volumetric depth.
  vec2 centered = vUv - 0.5;

  // Time advects the field as if hot gas is folding through magnetic turbulence.
  vec2 flow = curlField(centered * 2.4 + uTime * 0.04);
  float cloudA = fbm(centered * 3.4 + flow * 0.35 + uTime * 0.02);
  float cloudB = fbm(centered * 5.8 - flow * 0.42 - uTime * 0.018);
  float mask = smoothstep(0.25, 0.92, cloudA * 0.7 + cloudB * 0.5);

  // Radial attenuation keeps the brightest gas near the nebula core.
  float radial = smoothstep(0.78, 0.12, length(centered));
  float density = mask * radial * uOpacity;

  // Three astronomical color profiles blend across the turbulent field.
  vec3 color = mix(uColorA, uColorB, cloudA);
  color = mix(color, uColorC, cloudB * 0.55);

  gl_FragColor = vec4(color, density * 0.48);
}
