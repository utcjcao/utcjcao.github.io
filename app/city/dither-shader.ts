// Dithered Object shader adapted from Canvas UI by David Haz.
// Source: https://canvasui.dev/docs/components/dithered-object
// License: see CANVAS_UI_LICENSE.md in this directory.

export const POST_VERT = `
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

export const POST_FRAG = `
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uGridSize;

const mat4 THRESHOLDS = mat4(
  0.94118, 0.29412, 0.76471, 0.05882,
  0.47059, 0.70588, 0.23529, 0.52941,
  0.82353, 0.11765, 0.88235, 0.17647,
  0.35294, 0.58824, 0.41176, 0.64706
);

vec3 toSrgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

vec3 nearestColor(vec3 color) {
  vec3 palette[3] = vec3[3](
    vec3(20.0, 18.0, 19.0) / 255.0,
    vec3(216.0, 187.0, 137.0) / 255.0,
    vec3(112.0, 101.0, 90.0) / 255.0
  );
  vec3 nearest = palette[0];
  float closest = dot(color - nearest, color - nearest);
  for (int i = 1; i < 3; i++) {
    vec3 difference = color - palette[i];
    float distance = dot(difference, difference);
    if (distance < closest) {
      closest = distance;
      nearest = palette[i];
    }
  }
  return nearest;
}

void main() {
  vec2 fragCoord = vUv * uResolution;
  vec2 pixelUv = (floor(fragCoord / uGridSize) + 0.5) * uGridSize / uResolution;
  vec4 tex = texture(tDiffuse, pixelUv);
  vec3 color = toSrgb(tex.rgb);
  ivec2 cell = ivec2(mod(fragCoord / uGridSize, 4.0));
  if (dot(color, vec3(1.0)) < THRESHOLDS[cell.x][cell.y]) color = vec3(0.0);
  outColor = vec4(nearestColor(color) * tex.a, tex.a);
}`;
