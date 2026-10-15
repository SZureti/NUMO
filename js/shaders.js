/** GLSL is kept separate from scene setup so the visual mathematics are easy to study. */
export const numberVertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aLayer;
  uniform float uMorph;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uMotion;
  uniform float uBurst;
  varying float vLight;
  void main() {
    // Smoothstep reaches a precise target; frame rate does not affect the morph duration.
    float blend = smoothstep(0.0, 1.0, uMorph);
    vec3 p = mix(position, aTarget, blend);
    float moving = uMotion * uIntensity;
    // Related smooth sine waves deform neighboring vertices coherently.
    float wave = sin(p.y * 2.5 + uTime * 0.65 + aLayer * 2.8);
    p.x += wave * 0.085 * moving;
    p.y += sin(p.x * 3.0 - uTime * 0.5 + aLayer * 4.0) * 0.035 * moving;
    p.z += cos(p.y * 2.0 + uTime * 0.5) * 0.10 * moving;
    // A temporary expansion lets the contours breathe during transitions and victories.
    p.xy *= 1.0 + sin(blend * 3.14159265) * 0.035 * uMotion + uBurst * 0.08;
    vLight = 0.36 + aLayer * 0.64;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
export const numberFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vLight;
  void main() {
    gl_FragColor = vec4(uColor, 0.26 + vLight * 0.45);
    #include <colorspace_fragment>
  }
`;
