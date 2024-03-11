document.addEventListener("DOMContentLoaded", function () {
  const heroHeader = document.getElementById("hero-header");
  let isClipped = false; // State to track if the header is currently clipped

  function clipHeroHeader() {
    heroHeader.style.animation = "clipHeroHeader 1s forwards";
    isClipped = true;
    // After the animation, allow the page to scroll
    document.body.style.overflowY = "auto";
  }

  function unclipHeroHeader() {
    heroHeader.style.animation = "unclipHeroHeader 1s forwards";
    isClipped = false;
  }

  // Modified touch start and move events
  window.addEventListener(
    "touchmove",
    function (e) {
      if (!isClipped) {
        // Only clip if not already clipped
        clipHeroHeader();
      }
    },
    { passive: false }
  );

  // IntersectionObserver to observe when user scrolls back to top
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && isClipped) {
          // If at the top and header is clipped, unclip
          unclipHeroHeader();
        }
      });
    },
    { threshold: [0] }
  );

  // The sentinel to observe
  const sentinel = document.createElement("div");
  document.body.prepend(sentinel);
  observer.observe(sentinel);
});
