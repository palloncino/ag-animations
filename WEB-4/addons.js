document.addEventListener("DOMContentLoaded", function () {
  const word = document.getElementById("Scroll_to_discover_span");
  function triggerAnimation() {
    word.style.animation = "none";
    void word.offsetWidth;
    word.style.animation = "test 1s forwards";
  }
  setInterval(triggerAnimation, 3000);
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
  loadImage('./assets/images/bg.png'),
  loadImage('./assets/images/bg-2.png'),
  loadImage('./assets/images/monkey.webp'),
  loadImage('./assets/images/tree.png')
]).then(images => {
  removeLoadingOverlay();
}).catch(error => {
  console.error("An image failed to load:", error);
});

function removeLoadingOverlay() {
  document.getElementById('loading-overlay').classList.add('hide');
}

