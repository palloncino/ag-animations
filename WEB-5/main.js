document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('animation-canvas');
  const ctx = canvas.getContext('2d');

  // Function to set canvas size
  function setCanvasSize() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 800) {
      const canvasWidth = viewportWidth - 32; // Subtract 2rem (16px per rem) from each side
      canvas.width = canvasWidth;
      canvas.height = (canvasWidth * 5) / 8; // Keep the 8:5 aspect ratio
    } else {
      canvas.width = 800; // Default width
      canvas.height = 500; // Default height, maintaining the 8:5 ratio
    }
  }

  setCanvasSize(); // Set the initial canvas size based on the current viewport width

  let currentImage = new Image();
  const START_IMAGE = 100; // Start from image number 100

  function drawImageCoverCanvas(img) {
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio); // Use the largest ratio

    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  }

  window.addEventListener('resize', setCanvasSize); // Adjust canvas size on window resize

  window.addEventListener('scroll', () => {
    const pixelsPerChange = 10;
    let scrollUnits = Math.floor(window.scrollY / pixelsPerChange) + START_IMAGE;
    let imageIndex = scrollUnits % 430; // 430 available images
    imageIndex = Math.max(imageIndex, 1); 

    const imageName = imageIndex.toString().padStart(6, '0') + '.jpg'; // Zero-padding the image index
    const imagePath = `./downloaded_images/${imageName}`; // Adjust the path as needed

    if (currentImage.src !== imagePath) {
      currentImage.onload = () => drawImageCoverCanvas(currentImage);
      currentImage.src = imagePath;
    }
  });
});
