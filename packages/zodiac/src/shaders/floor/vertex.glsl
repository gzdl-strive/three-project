precision mediump float;

varying vec2 vUv;

void main() {
  vec3 newPosition = position;
  newPosition.z = 1.0;
  gl_Position = vec4(newPosition, 1.0);
  vUv = uv;
}