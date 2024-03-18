document.addEventListener("DOMContentLoaded", function () {
  // Canvas setup
  const canvas = document.getElementById("animation-canvas");
  const ctx = canvas.getContext("2d");
  const contentCanvasElement = document.querySelector('.content-canvas');

  // Configuration variables
  const START_IMAGE_NUMBER = 0; // Starting image index
  const TOTAL_IMAGES = 430; // Total number of available images
  const CANVAS_MAX_WIDTH = 800; // Max canvas width
  const CANVAS_MAX_HEIGHT = 500; // Max canvas height, maintaining 8:5 aspect ratio
  const VIEWPORT_THRESHOLD = 800; // Width threshold for canvas resizing
  const MARGIN = 32; // Total margin size (16px per side)
  const SCROLL_PIXELS_PER_CHANGE = 10; // Number of pixels scrolled before changing image

  let canvasInView = false; // Tracks whether .content-canvas is in view

  // Intersection Observer callback
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        canvasInView = true; // .content-canvas is in view
      } else {
        canvasInView = false; // .content-canvas has left the view
      }
    });
  };

  // Create an observer
  const observerOptions = {
    root: null, // observing the viewport
    threshold: 0.1 // callback is executed when 10% of the target is visible
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Assuming there is an element with the class .content-canvas in your DOM
  if (contentCanvasElement) {
    observer.observe(contentCanvasElement); // Start observing
  }

  // Initial canvas size adjustment
  setCanvasSize();

  // Update canvas size and position
  function updateCanvasSizeAndPosition() {
    const rect = contentCanvasElement.getBoundingClientRect();
    // Set canvas dimensions to match the target element
    canvas.width = rect.width;
    canvas.height = rect.height;
    // Position canvas to cover the target element
    canvas.style.position = 'absolute';
    canvas.style.top = `0`;
    canvas.style.left = `${rect.left}px`;
  }

  // Initial canvas size and position adjustment
  updateCanvasSizeAndPosition();

  // Adjust canvas size and position on window resize
  window.addEventListener("resize", updateCanvasSizeAndPosition);

  let currentImage = new Image();

  const imageCache = {};

  let manualScrollY = 0; // Initialize a manual scroll position

  // Handles scroll event to change images, with cache check and preload optimization
  window.addEventListener("wheel", () => {
    if (!canvasInView) {
      // If .content-canvas is not in view, exit the function
      return;
    }
    // Adjust the manual scroll position based on the wheel delta
    manualScrollY += event.deltaY;
    // Ensure manualScrollY does not go below 0
    manualScrollY = Math.max(manualScrollY, 0);

    let scrollUnits = Math.floor(manualScrollY / SCROLL_PIXELS_PER_CHANGE) + START_IMAGE_NUMBER;
    let imageIndex = scrollUnits % TOTAL_IMAGES;
    imageIndex = Math.max(imageIndex, 1); // Ensure image index is within bounds

    const imageName = imageIndex.toString().padStart(6, "0") + ".jpg";
    const imagePath = `./canvas-bg-images/${imageName}`;

    // Use the cached image if available
    if (imageCache[imagePath]) {
      currentImage = imageCache[imagePath];
      drawImageCoverCanvas(currentImage);
    } else {
      let img = new Image();
      img.onload = () => {
        drawImageCoverCanvas(img);
        imageCache[imagePath] = img; // Cache the loaded image
      };
      img.src = imagePath;
    }

    // Preload nearby images with cache check
    const preloadIndices = [imageIndex, imageIndex - 1, imageIndex + 1].filter(
      (index) => index > 0 && index <= TOTAL_IMAGES
    );

    preloadIndices.forEach((index) => {
      const preloadImageName = index.toString().padStart(6, "0") + ".jpg";
      const preloadImagePath = `./canvas-bg-images/${preloadImageName}`;
      // Only preload if the image is not already in the cache
      if (!imageCache[preloadImagePath]) {
        const img = new Image();
        img.onload = () => {
          imageCache[preloadImagePath] = img; // Optionally cache preloaded images
        };
        img.src = preloadImagePath;
      }
    });
  });

  // Draws the current image covering the canvas, maintaining aspect ratio
  function drawImageCoverCanvas(img) {
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio); // Use the largest ratio to cover canvas

    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }

  // Sets the canvas size based on the viewport width
  function setCanvasSize() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < VIEWPORT_THRESHOLD) {
      // Adjust canvas size for narrow viewports
      const canvasWidth = viewportWidth - MARGIN; // Subtract margin from viewport width
      canvas.width = canvasWidth;
      canvas.height = (canvasWidth * 5) / 8; // Maintain 8:5 aspect ratio
    } else {
      // Use default size for wider viewports
      canvas.width = CANVAS_MAX_WIDTH;
      canvas.height = CANVAS_MAX_HEIGHT;
    }
  }
});
