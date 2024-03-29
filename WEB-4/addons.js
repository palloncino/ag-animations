// At the top of your 3d-robot.js or any script that needs THREE/GLTFLoader
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js";

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const word = document.getElementById("Scroll_to_discover_span");
  const wordContainer = document.querySelector(".Scroll_to_discover");
  const animationCanvas = document.getElementById("animation-canvas");
  const heroHeader = document.getElementById("hero-header");

  // Styling
  wordContainer.style.transition = ".5s";

  // Function to trigger animation
  function triggerAnimation() {
    word.style.animation = "none";
    void word.offsetWidth; // Trigger reflow to restart animation
    word.style.animation = "test 1s forwards";
  }
  setInterval(triggerAnimation, 3000);

  // Intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      // Track whether 'word' is intersecting with either target element
      let isIntersectingWithTarget = false;
      let intersectingElements = []; // Keep track of which elements are intersecting

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isIntersectingWithTarget = true;
          intersectingElements.push(entry.target.id); // Add id of intersecting element
        }
      });

      // Update 'word' color based on intersection status
      word.style.color = isIntersectingWithTarget ? "white" : "black";
      wordContainer.style.background = isIntersectingWithTarget ? "black" : "transparent";
    },
    {
      root: null, // Observing relative to the viewport
      threshold: 0.1, // Callback is executed when 10% of the target is visible
    }
  );

  // Start observing both elements
  observer.observe(animationCanvas);
  observer.observe(heroHeader);
});

// Function to load GLB model using GLTFLoader
function loadGLTFModel(src) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      src,
      (gltf) => {
        resolve(gltf.scene);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        reject(new Error("Failed to load GLB model: " + src));
      }
    );
  });
}

// Modify loadResource function to call updateProgress on success
function loadResource(src, type) {
  return new Promise((resolve, reject) => {
    let media;

    if (type === "image" || type === "video") {
      media = type === "image" ? new Image() : document.createElement("video");
      media.onload = media.onloadedmetadata = () => {
        updateProgress(); // Update progress on load
        resolve(media);
      };
      media.onerror = () => {
        reject(new Error(`Failed to load ${type}: ${src}`));
      };
      media.src = src;
    } else if (type === "glb") {
      loadGLTFModel(src)
        .then((scene) => {
          updateProgress(); // Update progress on load
          resolve(scene);
        })
        .catch((error) => reject(error));
    } else {
      reject(new Error("Unsupported media type"));
    }
  });
}

// Limit for dynamically loaded images
const LOAD_SERIES_OF_PIC_LIMIT = 200;

// Array to hold promises for loading media resources
const mediaPromises = [
  loadResource("./assets/images/bg.png", "image"),
  loadResource("./assets/images/bg-2.png", "image"),
  loadResource("./assets/images/monkey.webp", "image"),
  loadResource("./assets/videos/drone-jungle.mp4", "video"),
  loadResource("./assets/models/robot.glb", "glb"),
];

// Dynamically add loadResource promises for media within the specified limit
for (let i = 1; i <= LOAD_SERIES_OF_PIC_LIMIT; i++) {
  const src = `./canvas-bg-images/${i}.jpg`;
  mediaPromises.push(loadResource(src, "image"));
}

// Wait for all media to be loaded
Promise.all(mediaPromises)
  .then(() => {
    // All media loaded successfully
    removeLoadingOverlay();
  })
  .catch((error) => {
    console.error("A media file failed to load:", error);
  });

let loadedAssets = 0;
const totalAssets = mediaPromises.length;

function updateProgress() {
  loadedAssets++;
  const progressPercentage = (loadedAssets / totalAssets) * 100;
  document.getElementById("loadingBar").style.width = `${progressPercentage.toFixed(2)}%`;
}

// Function to remove loading overlay
function removeLoadingOverlay() {
  document.getElementById("loading-overlay").classList.add("hide");
}
