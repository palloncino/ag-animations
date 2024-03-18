document.addEventListener("DOMContentLoaded", function () {
  // Canvas setup
  const canvas = document.getElementById("animation-canvas");
  const ctx = canvas.getContext("2d");

  // Configuration variables
  const START_IMAGE_NUMBER = 100; // Starting image index
  const TOTAL_IMAGES = 430; // Total number of available images
  const CANVAS_MAX_WIDTH = 800; // Max canvas width
  const CANVAS_MAX_HEIGHT = 500; // Max canvas height, maintaining 8:5 aspect ratio
  const VIEWPORT_THRESHOLD = 800; // Width threshold for canvas resizing
  const MARGIN = 32; // Total margin size (16px per side)
  const SCROLL_PIXELS_PER_CHANGE = 10; // Number of pixels scrolled before changing image

  // Initial canvas size adjustment
  setCanvasSize();

  // Adjusts canvas size on window resize
  window.addEventListener("resize", setCanvasSize);

  let currentImage = new Image();

  const imageCache = {};

  // Handles scroll event to change images, with cache check and preload optimization
  window.addEventListener("scroll", () => {
    let scrollUnits = Math.floor(window.scrollY / SCROLL_PIXELS_PER_CHANGE) + START_IMAGE_NUMBER;
    let imageIndex = scrollUnits % TOTAL_IMAGES;
    imageIndex = Math.max(imageIndex, 1); // Ensure image index is within bounds

    const imageName = imageIndex.toString().padStart(6, "0") + ".jpg";
    const imagePath = `./downloaded_images/${imageName}`;

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
      const preloadImagePath = `./downloaded_images/${preloadImageName}`;
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
