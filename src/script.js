import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });

const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Color
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: {
      value: 0,
    },
    uWavesSpeed: { value: 0.75 },
    uWavesElevation: { value: 0.2 },
    uWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: {
      value: 0.11,
    },
    uColorMultiplier: {
      value: 5,
    },
  },
});

// Debug
gui.add(waterMaterial.uniforms.uWavesElevation, "value").min(0).max(1).step(0.01).name("uWavesElevation");

gui.add(waterMaterial.uniforms.uWavesFrequency.value, "x").min(0).max(10).step(0.01).name("uWavesFrequency X");

gui.add(waterMaterial.uniforms.uWavesFrequency.value, "y").min(0).max(10).step(0.01).name("uWavesFrequency Y");

gui.add(waterMaterial.uniforms.uWavesSpeed, "value").min(0).max(4).step(0.01).name("uWavesSpeed");

gui.add(waterMaterial.uniforms.uSmallWavesElevation, "value").min(0).max(1).step(0.01).name("uSmallWavesElevation");

gui.add(waterMaterial.uniforms.uSmallWavesFrequency, "value").min(0).max(30).step(0.01).name("uSmallWavesFrequency");

gui.add(waterMaterial.uniforms.uSmallWavesIterations, "value").min(0).max(5).step(1).name("uSmallWavesIterations");

gui.add(waterMaterial.uniforms.uSmallWavesSpeed, "value").min(0).max(4).step(0.01).name("uSmallWavesSpeed");

gui
  .addColor(debugObject, "depthColor")
  .name("depthColor")
  .onChange(() => waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor));

gui
  .addColor(debugObject, "surfaceColor")
  .name("surfaceColor")
  .onChange(() => waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor));

gui.add(waterMaterial.uniforms.uColorOffset, "value").min(0).max(4).step(0.01).name("uColorOffset");

gui.add(waterMaterial.uniforms.uColorMultiplier, "value").min(0).max(10).step(0.01).name("uColorMultiplier");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
