import * as THREE from "three";
import { Raycaster, Vector2 } from "three";
import {
  AUTO_PLAY,
  Phase,
  camera,
  colors,
  createSphere,
  createTextTexture,
  renderer,
  scene,
  spheres,
  spheresConfig,
} from "./config.js";

const TEXT_SIZE_SCALE = 0.5;
const FLOATING_AMPLITUDE = 0.4;
const FLOATING_FREQUENCY = 0.2;
const HOVER_SCALE = 1.5;
const LERP_SPEED = 0.05;
const SCATTER_INITIAL_POSITION = new THREE.Vector3(0, 0, 0);
const SPRITE_POSITION_OFFSET = new THREE.Vector3(0, 1.5, 0);
const FLOAT_LERP_SPEED = 0.02;
const DEFAULT_TO_ECLIPSE_DELAY = 0;
const ECLIPSE_TO_SCATTER_DELAY = 1000;

let currentPhase = Phase.FLOATING;
let raycaster = new Raycaster();
let mouse = new Vector2();
let intersectedSphere = null;

function autoAdvancePhases() {
  if (AUTO_PLAY) {
    setTimeout(() => {
      advancePhase(); // First phase advance after 1 second
      setTimeout(() => {
        advancePhase(); // Second phase advance after another second
      }, ECLIPSE_TO_SCATTER_DELAY);
    }, DEFAULT_TO_ECLIPSE_DELAY);
  }
}

document.addEventListener("click", advancePhase);

document.addEventListener("mousemove", onMouseMove, false);

function initialFloatingBehaviour() {
  spheres.forEach((sphere, index) => {
    const time = Date.now() * 0.001 + index;
    sphere.position.y += Math.sin(time) * 0.003;
    sphere.position.x += Math.cos(time) * 0.003;
  });
}

function advancePhase() {
  switch (currentPhase) {
    case Phase.FLOATING:
      currentPhase = Phase.ECLIPSE;
      const blackSphere = spheres[1];
      if (blackSphere) {
        blackSphere.userData.targetScale = 1.4;
      }
      break;
    case Phase.ECLIPSE:
      currentPhase = Phase.SCATTER;
      scatterSpheres();
      break;
    case Phase.SCATTER:
      break;
  }
}


function updateEclipseBehavior() {
  const orangeSphere = spheres[0];
  const blackSphere = spheres[1];

  // Ensure the target positions are set
  orangeSphere.position.lerp(new THREE.Vector3(0, 0, 1), LERP_SPEED);
  blackSphere.position.lerp(new THREE.Vector3(0, 0, 0), LERP_SPEED);

  // Update the scale of the black sphere if a targetScale is defined
  if (blackSphere.userData.targetScale !== undefined) {
    const targetScale = blackSphere.userData.targetScale;
    const currentScale = blackSphere.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, LERP_SPEED);
    blackSphere.scale.set(newScale, newScale, newScale);
  }
}

function updateSpriteOrientationToCamera() {
  spheres.forEach((sphere) => {
    sphere.children.forEach((child) => {
      if (child instanceof THREE.Sprite) {
        child.lookAt(camera.position);
      }
    });
  });
}

function scatterSpheres() {
  // Clear existing spheres from the scene and the array
  spheres.forEach((sphere) => scene.remove(sphere));
  spheres.length = 0;

  // Iterate over each sphere configuration to recreate spheres with text sprites
  spheresConfig.forEach((config) => {
    // Create a new sphere at the initial position
    const sphere = createSphere(colors.sphereOrange, SCATTER_INITIAL_POSITION);
    sphere.userData = {
      category: config.category,
      target: config.target,
      targetScale: 1,
      currentScale: 1,
    };

    // Add the new sphere to the array of spheres
    spheres.push(sphere);

    // Create text texture and sprite for the sphere
    const { texture, width, height } = createTextTexture(config.category);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);

    // Apply the TEXT_SIZE_SCALE to adjust the sprite's scale
    sprite.scale.set((width / 100) * TEXT_SIZE_SCALE, (height / 100) * TEXT_SIZE_SCALE, 1);

    // Use SPRITE_POSITION_OFFSET for the sprite's position
    sprite.position.copy(SPRITE_POSITION_OFFSET);

    // Make the sprite a child of the sphere so they move together
    sphere.add(sprite);
  });
}

function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function activateHoverEffectSphere() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(spheres);

  // Hide all category content divs first
  document.querySelectorAll(".category_content").forEach((div) => {
    div.classList.remove("show");
  });

  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    if (intersected !== intersectedSphere) {
      intersectedSphere = intersected;
    }
    intersectedSphere.userData.targetScale = HOVER_SCALE;

    // Find and show the corresponding div
    const categoryClass = intersected.userData.category;

    function getCategoryValue(category) {
      switch (category) {
        case "Heavy 3D":
          return "heavy-3d";
        case "Animated Web Design":
          return "animated-web-design";
        case "Practices":
          return "practices";
        case "Work webs":
          return "word-webs"; // Note: Confirm if this should be "word-webs" or "work-webs"
        case "Empty slot 1":
          return "empty-slot-1";
        case "Empty slot 2":
          return "empty-slot-2";
        default:
          return "unknown-category"; // Handle unknown or default case
      }
    }

    // let do a mapping here

    const contentDiv = document.querySelector(`.${getCategoryValue(categoryClass)}`);
    if (contentDiv) {
      contentDiv.style.display = "block"; // Make sure it's visible before adding 'show' class
      contentDiv.classList.add("show");
    }
  } else {
    if (intersectedSphere) {
      intersectedSphere.userData.targetScale = 1;
      intersectedSphere = null; // Ensure you clear the reference to the previously hovered sphere
    }
  }
}

function updateScatterToFloat() {
  let allReachedTargets = true; // Track if all spheres reached their target positions

  const time = Date.now() * 0.001; // Current time for floating effect

  spheres.forEach((sphere) => {
    const targetPosition = sphere.userData.target;
    if (!targetPosition) return; // Skip if no target is defined

    // Calculate floating effect
    const floatX = Math.sin(time * FLOATING_FREQUENCY) * FLOATING_AMPLITUDE;
    const floatY = Math.cos(time * FLOATING_FREQUENCY) * FLOATING_AMPLITUDE;

    // Target position with floating effect
    const floatingTargetPosition = new THREE.Vector3(
      targetPosition.x + floatX,
      targetPosition.y + floatY,
      targetPosition.z
    );

    // Check if the sphere is close to its floating target position
    const distance = sphere.position.distanceTo(floatingTargetPosition);
    if (distance > 0.01) {
      allReachedTargets = false;
      // Move the sphere towards its floating target position using FLOAT_LERP_SPEED
      sphere.position.lerp(floatingTargetPosition, FLOAT_LERP_SPEED);
    } else {
      // Once the sphere has reached its target, ensure it continues to float around that point
      sphere.position.set(floatingTargetPosition.x, floatingTargetPosition.y, floatingTargetPosition.z);
    }
  });

  if (allReachedTargets) {
    // Additional logic once all spheres have reached their targets can be placed here
  }
}

export function updateSpheresScale(spheres) {
  spheres.forEach((sphere) => {
    const targetScale = sphere.userData.targetScale;
    const currentScale = sphere.scale.x; // Assuming uniform scaling
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1); // Smoothly interpolate scale

    sphere.scale.set(newScale, newScale, newScale);
  });
}

function animate() {
  requestAnimationFrame(animate);

  switch (currentPhase) {
    case Phase.FLOATING:
      initialFloatingBehaviour();
      break;
    case Phase.ECLIPSE:
      updateEclipseBehavior();
      break;
    case Phase.SCATTER:
      updateScatterToFloat();
      activateHoverEffectSphere();
      break;
  }

  updateSpriteOrientationToCamera();

  updateSpheresScale(spheres);

  renderer.render(scene, camera);
}

autoAdvancePhases();

animate();
