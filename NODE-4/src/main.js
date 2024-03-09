import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { cameraSettings, environmentSettings, objectSettings, rendererSettings, scaleSettings, createRenderer, createObject } from "./config";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import hdrPath from "./background.hdr";

let scene, camera, renderer, raycaster, mouse;
const objects = []; // Array to keep track of interactive objects

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

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const loader = new RGBELoader();
  loader.load(hdrPath, function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
  });

  for (let i = 0; i < 3; i++) {
    const position = new THREE.Vector3((i - 1) * objectSettings.cube.spaceBetween, 0.5, 0);
    const cube = createObject(objectSettings.cube.geometry, objectSettings.cube.material, position);
    scene.add(cube);
    objects.push(cube);
  }

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("keydown", onDocumentKeyDown, false);


  animate();
}


function onDocumentKeyDown(event) {
  const keyCode = event.which;
  const moveStep = 5; // Adjust this value to control the speed of the movement

  // Vector for forward/backward movement
  let forward = new THREE.Vector3();
  // Get the direction in which the camera is looking
  camera.getWorldDirection(forward);
  forward.normalize();

  if (keyCode == 37) {
      // Left arrow key - Move left
      camera.position.x -= moveStep;
  } else if (keyCode == 38) {
      // Up arrow key - Move forward
      camera.position.addScaledVector(forward, moveStep);
  } else if (keyCode == 39) {
      // Right arrow key - Move right
      camera.position.x += moveStep;
  } else if (keyCode == 40) {
      // Down arrow key - Move backward
      camera.position.addScaledVector(forward, -moveStep);
  }

  // Update OrbitControls target to ensure the camera properly orbits around a point in space
  controls.target.addScaledVector(forward, keyCode == 38 ? moveStep : (keyCode == 40 ? -moveStep : 0));
  controls.update();
}


function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(objects);

  for (let i = 0; i < objects.length; i++) {
    objects[i].scale.copy(
      intersects.length > 0 && objects[i] === intersects[0].object
        ? scaleSettings.hoverScale
        : scaleSettings.normalScale
    );
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
