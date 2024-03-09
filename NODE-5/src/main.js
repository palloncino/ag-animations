import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import hdrPath from "./background.hdr";
import { cameraSettings, createRenderer, gltfLoader, rendererSettings } from "./config";

let scene, camera, renderer;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    cameraSettings.fov,
    cameraSettings.aspect,
    cameraSettings.near,
    cameraSettings.far
  );
  camera.position.copy(cameraSettings.position);

  renderer = createRenderer(rendererSettings);
  document.body.appendChild(renderer.domElement);

  new OrbitControls(camera, renderer.domElement);

  const modelUrl = new URL("./assets/models/shapes/test1.glb", import.meta.url).href;
  gltfLoader.load(modelUrl, function (gltf) {
    scene.add(gltf.scene);
  });

  const loader = new RGBELoader();
  loader.load(hdrPath, function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  });

  window.addEventListener("resize", onWindowResize, false);
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
