document.addEventListener("DOMContentLoaded", function () {
  const word = document.getElementById("Scroll_to_discover_span");
  const wordContainer = document.querySelector(".Scroll_to_discover");
  const animationCanvas = document.getElementById("animation-canvas");
  const heroHeader = document.getElementById("hero-header");

  wordContainer.style.transition = '.5s';

  function triggerAnimation() {
    word.style.animation = "none";
    void word.offsetWidth; // Trigger reflow to restart animation
    word.style.animation = "test 1s forwards";
  }
  setInterval(triggerAnimation, 3000);

  const observer = new IntersectionObserver(entries => {
    // Track whether 'word' is intersecting with either target element
    let isIntersectingWithTarget = false;
    let intersectingElements = []; // Keep track of which elements are intersecting

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isIntersectingWithTarget = true;
        intersectingElements.push(entry.target.id); // Add id of intersecting element
      }
    });


    // Update 'word' color based on intersection status
    word.style.color = isIntersectingWithTarget ? "white" : "black";
    wordContainer.style.background = isIntersectingWithTarget ? "black" : "transparent";
  }, {
    root: null, // Observing relative to the viewport
    threshold: 0.1 // Callback is executed when 10% of the target is visible
  });

  // Start observing both elements
  observer.observe(animationCanvas);
  observer.observe(heroHeader);
});


function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

Promise.all([
  loadImage("./assets/images/bg.png"),
  loadImage("./assets/images/bg-2.png"),
  loadImage("./assets/images/monkey.webp"),
  loadImage("./assets/images/tree.png"),
])
  .then((images) => {
    removeLoadingOverlay();
  })
  .catch((error) => {
    console.error("An image failed to load:", error);
  });

function removeLoadingOverlay() {
  document.getElementById("loading-overlay").classList.add("hide");
}
