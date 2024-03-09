import * as THREE from "three";
export const spheres = [];
export const state = {
  targetX: 0,
  targetY: 0,
};

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export let mousePosition3D = new THREE.Vector3();

export const AUTO_PLAY = true;

export const colors = {
  background: "#fff",
  sphereOrange: "#00CD72",
  sphereBlack: "#ea2323",
};

export const initialPositions = {
  orangeSphere: new THREE.Vector3(2, 2, -5),
  blackSphere: new THREE.Vector3(-2, -2, -5),
};

export const Phase = {
  FLOATING: "floating",
  ECLIPSE: "eclipse",
  SCATTER: "scatter",
};

export const spheresConfig = [
  { category: "Heavy 3D", target: new THREE.Vector3(-8, 3, 0) },
  { category: "Animated Web Design", target: new THREE.Vector3(-5, 4.25, 0) },
  { category: "Practices", target: new THREE.Vector3(-1.5, 5, 0) },
  { category: "Work webs", target: new THREE.Vector3(1.5, 5, 0) },
  { category: "Empty slot 1", target: new THREE.Vector3(5, 4.25, 0) },
  { category: "Empty slot 2", target: new THREE.Vector3(8, 3, 0) },
];

renderer.setSize(window.innerWidth, window.innerHeight);
resizeHandler(camera, renderer);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(colors.background);
camera.position.z = 10;
createSphere(colors.sphereOrange, initialPositions.orangeSphere);
createSphere(colors.sphereBlack, initialPositions.blackSphere);

document.addEventListener("mousemove", (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  // Update the mousePosition3D to reflect the mouse's position in 3D space
  mousePosition3D.set(x, y, 0.5).unproject(camera); // Set Z based on your scene configuration
  mousePosition3D.unproject(camera); // Converts the vector from screen space to 3D space
});

export function createSphere(color, position) {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(position.x, position.y, position.z);
  sphere.userData.targetScale = 1; // Initialize with normal scale
  sphere.userData.currentScale = 1; // Track current scale
  scene.add(sphere);
  spheres.push(sphere);
  return sphere;
}

export function createTextTexture(text, fontSize = 64, textColor = "#000000") {
  const padding = 10; // Padding around text
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  context.font = `${fontSize}px Arial`; // Set font to measure text
  const metrics = context.measureText(text);
  const textWidth = metrics.width;

  canvas.width = textWidth + padding * 2; // Adjust canvas width based on text width + padding
  canvas.height = fontSize + padding * 2; // Adjust canvas height based on font size + padding

  // Need to reset font since canvas size changed resets context
  context.font = `${fontSize}px Arial`;
  context.fillStyle = textColor;
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Draw text at center of the newly sized canvas
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return { texture, width: canvas.width, height: canvas.height };
}

export function resizeHandler(camera, renderer) {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
