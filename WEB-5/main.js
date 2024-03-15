document.addEventListener('scroll', () => {
  const container = document.getElementById('animation-container');
  const totalImages = 430; // Total number of images
  const pixelsPerFrame = 1;
  const totalPixels = totalImages * pixelsPerFrame;
  let scrollFraction = window.scrollY / totalPixels;
  scrollFraction = Math.min(1, scrollFraction); // Ensure it doesn't exceed 1

  const frameIndex = Math.floor(scrollFraction * totalImages);

  // Using a relative path from the root of the server
  container.style.backgroundImage = `url('./downloaded_images/${frameIndex.toString().padStart(6, '0')}.jpg')`;
});
