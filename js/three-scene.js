import * as THREE from "../vendor/three.module.js";
import { FontLoader } from "../vendor/FontLoader.js";
import { numberVertexShader, numberFragmentShader } from "./shaders.js";

const LAYERS = 34;
const SAMPLES = 620;
const DURATION = 1050;

/** GPU-rendered contour sculpture. It knows the visible number, never the secret. */
export async function createNumberScene(container) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  const fontResponse = await fetch(
    new URL("../assets/fonts/helvetiker_bold.typeface.json", import.meta.url),
  );
  if (!fontResponse.ok) {
    renderer.dispose();
    throw new Error("Number font could not be loaded.");
  }
  const font = new FontLoader().parse(await fontResponse.json());
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.z = 8;
  const geometry = new THREE.BufferGeometry();
  const cache = new Map();
  let motion = true;
  let visible = !document.hidden;
  let frameId = 0;
  let morphStart = 0;
  let currentValue = "00";
  let startTime = performance.now();
  let burstStart = -10000;

  /**
   * Every value has the same vertex count, even “100”. Sample each closed outline by
   * arc length, then stack the outlines in depth. Short line segments avoid joining
   * an outer edge to a hole. Equal-sized buffers can interpolate on the GPU.
   */
  function makeTarget(text) {
    if (cache.has(text)) return cache.get(text).slice();
    const shapes = font.generateShapes(text, 1);
    const paths = shapes.flatMap((shape) => [shape, ...shape.holes]);
    const lengths = paths.map((path) => path.getLength());
    const totalLength = lengths.reduce((sum, length) => sum + length, 0);
    const allPoints = paths.flatMap((path) => path.getPoints(32));
    const bounds = new THREE.Box2().setFromPoints(allPoints);
    const center = bounds.getCenter(new THREE.Vector2());
    const size = bounds.getSize(new THREE.Vector2());
    const scaleY = 2.95 / size.y;
    const scaleX = Math.min(scaleY * 0.72, 3.6 / size.x);
    const result = new Float32Array(LAYERS * SAMPLES * 2 * 3);
    let index = 0;
    for (let layer = 0; layer < LAYERS; layer++) {
      const depth = layer / (LAYERS - 1);
      for (let sample = 0; sample < SAMPLES; sample++) {
        let distance = (sample / SAMPLES) * totalLength;
        let pathIndex = 0;
        while (pathIndex < paths.length - 1 && distance > lengths[pathIndex])
          distance -= lengths[pathIndex++];
        for (let end = 0; end < 2; end++) {
          const along = Math.min(
            1,
            (distance + ((end * totalLength) / SAMPLES) * 0.94) /
              lengths[pathIndex],
          );
          const point = paths[pathIndex].getPointAt(along);
          // Slight scale and lateral changes create the ribbon-like volume in the reference.
          const contourScale = 1 + Math.sin(depth * Math.PI) * 0.075;
          result[index++] =
            (point.x - center.x) * scaleX * contourScale + (depth - 0.5) * 0.1;
          result[index++] = (point.y - center.y) * scaleY * contourScale;
          result[index++] = (depth - 0.5) * 0.76;
        }
      }
    }
    // Bounded by 101 possible values; each value is built only when needed.
    if (cache.size > 12) cache.delete(cache.keys().next().value);
    cache.set(text, result.slice());
    return result;
  }
  const initial = makeTarget("00");
  const layers = new Float32Array(LAYERS * SAMPLES * 2);
  for (let i = 0; i < layers.length; i++)
    layers[i] = Math.floor(i / (SAMPLES * 2)) / (LAYERS - 1);
  geometry.setAttribute("position", new THREE.BufferAttribute(initial, 3));
  geometry.setAttribute(
    "aTarget",
    new THREE.BufferAttribute(initial.slice(), 3),
  );
  geometry.setAttribute("aLayer", new THREE.BufferAttribute(layers, 1));
  const material = new THREE.ShaderMaterial({
    vertexShader: numberVertexShader,
    fragmentShader: numberFragmentShader,
    uniforms: {
      uMorph: { value: 1 },
      uTime: { value: 0 },
      uIntensity: { value: 0.7 },
      uMotion: { value: 1 },
      uBurst: { value: 0 },
      uColor: { value: new THREE.Color("#d7ff3f") },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sculpture = new THREE.LineSegments(geometry, material);
  // Both morph endpoints fit the camera; disable stale initial-position frustum bounds.
  sculpture.frustumCulled = false;
  scene.add(sculpture);
  container.append(renderer.domElement);

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = Math.max(
      7.5,
      2.25 / (Math.tan(THREE.MathUtils.degToRad(18)) * camera.aspect),
    );
    camera.updateProjectionMatrix();
    render(performance.now());
  }
  function render(now) {
    const time = (now - startTime) / 1000;
    material.uniforms.uMorph.value = motion
      ? Math.min(1, (now - morphStart) / DURATION)
      : 1;
    material.uniforms.uTime.value = motion ? time : 0;
    material.uniforms.uBurst.value = motion
      ? Math.max(0, 1 - (now - burstStart) / 1500)
      : 0;
    sculpture.rotation.y = motion ? Math.sin(time * 0.23) * 0.12 : 0;
    sculpture.rotation.x = motion ? Math.sin(time * 0.19) * 0.025 : 0;
    renderer.render(scene, camera);
  }
  function tick(now) {
    frameId = 0;
    if (!visible || !motion) return;
    render(now);
    frameId = requestAnimationFrame(tick);
  }
  function updateLoop() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    if (visible) {
      render(performance.now());
      if (motion) frameId = requestAnimationFrame(tick);
    }
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    updateLoop();
  });
  renderer.domElement.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    visible = false;
    cancelAnimationFrame(frameId);
    container.classList.remove("rendered");
  });
  renderer.domElement.addEventListener("webglcontextrestored", () => {
    visible = !document.hidden;
    container.classList.add("rendered");
    updateLoop();
  });
  resize();
  container.classList.add("rendered");
  updateLoop();
  return {
    setNumber(value, outcome = "READY") {
      const text = String(value).padStart(2, "0");
      material.uniforms.uColor.value.set(
        outcome === "LOST"
          ? "#9670ff"
          : outcome === "high"
            ? "#eee9ff"
            : "#d7ff3f",
      );
      if (outcome === "WON") burstStart = performance.now();
      if (text !== currentValue) {
        const previous = geometry.getAttribute("position");
        const target = geometry.getAttribute("aTarget");
        // Preserve the current intermediate shape if a second guess arrives mid-morph.
        const t = material.uniforms.uMorph.value;
        const blend = t * t * (3 - 2 * t);
        for (let i = 0; i < previous.array.length; i++)
          previous.array[i] += (target.array[i] - previous.array[i]) * blend;
        previous.needsUpdate = true;
        target.array.set(makeTarget(text));
        target.needsUpdate = true;
        morphStart = performance.now();
        currentValue = text;
      }
      if (!motion) render(performance.now());
    },
    setMotion(enabled) {
      motion = enabled;
      material.uniforms.uMotion.value = enabled ? 1 : 0;
      updateLoop();
    },
    setIntensity(value) {
      material.uniforms.uIntensity.value = value * 2;
      if (!motion) render(performance.now());
    },
  };
}
