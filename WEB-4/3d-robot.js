// At the top of your 3d-robot.js or any script that needs THREE/GLTFLoader
import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';

// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000); // Adjust the aspect ratio to 1 (500/500)
camera.position.set(0, 1.2, 2.5); // Adjust camera position based on the model's scale

const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha: true for transparent background
renderer.setSize(500, 500); // Set the renderer size to 500x500
renderer.shadowMap.enabled = true; // Enable shadow rendering

// Append the renderer's canvas to the specified container instead of document.body
const container = document.querySelector(".glb-model-container");
container.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 30);
directionalLight.position.set(0, 0, 10); // Move the light closer to the model
directionalLight.castShadow = true;
// Adjust shadow camera frustum to fit the scene better
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = 50;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 20; // Decreased far value for a closer scene
scene.add(directionalLight);

// Add a point light for additional highlights and shadows
const pointLight = new THREE.PointLight(0xffffff, 0.8, 50);
pointLight.position.set(5, 5, 5);
pointLight.castShadow = true;
scene.add(pointLight);

// Hemisphere light for soft ambient lighting from above
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

// Check if GLTFLoader is available under the THREE namespace
if (GLTFLoader) {
  const loader = new GLTFLoader();
  loader.load(
    "./assets/models/robot.glb",
    function (gltf) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      scene.add(gltf.scene);

      const mixer = new THREE.AnimationMixer(gltf.scene);
      if (gltf.animations.length) {
        const action = mixer.clipAction(gltf.animations[0]);
        action.setLoop(THREE.LoopRepeat); // Set the loop mode
        action.play(); // Play the animation
      }

      const clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        mixer.update(delta); // Update the animation mixer on each frame

        renderer.render(scene, camera);
      }
      animate();
    },
    undefined,
    function (error) {
      console.error("An error happened", error);
    }
  );
} else {
  console.error("GLTFLoader not found. Ensure it is included in your project.");
}
