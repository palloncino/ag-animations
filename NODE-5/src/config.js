import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const cameraSettings = {
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 500,
  position: new THREE.Vector3(0, 20, 100),
};

export const rendererSettings = {
  antialias: true,
};

export const gltfLoader = new GLTFLoader();

export function createRenderer(options) {
  const renderer = new THREE.WebGLRenderer(options.antialias ? { antialias: true } : undefined);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}
