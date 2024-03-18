// Assuming THREE is globally available after loading it from a CDN in your HTML

// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 2); // Adjust camera position based on the model's scale

const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha: true for transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Append the renderer's canvas to the specified container instead of document.body
const container = document.querySelector(".content-1-inner-container");
container.appendChild(renderer.domElement);

// Lighting to make the model visible
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 0).normalize();
scene.add(directionalLight);

// Check if GLTFLoader is available under the THREE namespace
if (GLTFLoader) {
  const loader = new GLTFLoader();
  loader.load(
    "./assets/models/robot.glb",
    function (gltf) {
      scene.add(gltf.scene);

      const mixer = new THREE.AnimationMixer(gltf.scene);
      if (gltf.animations.length) {
        const action = mixer.clipAction(gltf.animations[0]);
        action.setLoop(THREE.LoopRepeat);
        action.play();
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
