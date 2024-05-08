document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 600) {
    customMobileEffectCBG();
  } else {
    customDesktopEffectCBG();
  }
});

function customMobileEffectCBG() {
  const heroHeader = document.getElementById('hero-header');

  // Set initial state for the hero header
  heroHeader.style.transform = 'scale(1)';
  heroHeader.style.transition = 'transform 1s ease-out, opacity 0.5s ease-out'; // Smooth transition
  heroHeader.style.opacity = '1';

  // Define the end state of the animation
  function triggerAnimation() {
    heroHeader.style.transform = 'scale(0)';  // Scale down to zero
    heroHeader.style.opacity = '1';  // Fade out the header

    // Allow scrolling after the animation is complete
    setTimeout(() => {
      document.body.style.overflowY = 'auto'; // Enable vertical scrolling
    }, 1000); // This should match the longest duration in the CSS transitions
  }

  // Listen for any touch start event on the entire body
  document.body.addEventListener('touchstart', function() {
    triggerAnimation();
  }, { once: true }); // Ensure this only happens once
}




function customDesktopEffectCBG() {
  const backgroundSky = document.querySelector(".background-sky");
  const foregroundFactory = document.querySelector(".foreground-factory");
  backgroundSky.style.position = "fixed";
  foregroundFactory.style.position = "fixed";

  const heroHeader = document.getElementById("hero-header");
  let maxScroll = 500;
  let effectiveScrollY = 0;

  // Ensure the heroHeader starts fully visible without any clipping.
  heroHeader.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

  function updateHeroHeader(scrollDelta) {
    effectiveScrollY += scrollDelta;
    effectiveScrollY = Math.max(0, Math.min(effectiveScrollY, maxScroll));
    let progress = effectiveScrollY / maxScroll;

    // Scale calculation
    let scale;
    if (progress <= 0.5) {
      // Scale up from 1 to 1.2 as progress goes from 0 to 0.5
      scale = 1 + progress * 0.4; // Progress 0.5 => scale 1.2
    } else {
      // Scale down from 1.2 to 0.5 as progress goes from 0.5 to 1
      scale = 1.2 - (progress - 0.5) * 1.4; // Progress 1 => scale 0.5
    }
    heroHeader.style.transform = `scale(${scale})`;

    // Adjust clipPath calculation to start fully visible and gradually clip
    const clipPercent = 50 * progress;

    // Apply the updated clipPath to create the shrinking effect
    heroHeader.style.clipPath = `polygon(${clipPercent}% ${clipPercent}%, ${
      100 - clipPercent
    }% ${clipPercent}%, ${100 - clipPercent}% ${
      100 - clipPercent
    }%, ${clipPercent}% ${100 - clipPercent}%)`;

    if (effectiveScrollY >= maxScroll) {
      document.body.style.overflowY = "auto";
      window.removeEventListener("wheel", onWheel);
    } else {
      document.body.style.overflowY = "hidden";
    }
  }

  function onWheel(e) {
    e.preventDefault();
    updateHeroHeader(e.deltaY);
  }

  window.addEventListener("wheel", onWheel, { passive: false });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.body.style.overflowY = "auto"; // Re-enable scrolling
        window.addEventListener("wheel", onWheel, { passive: false });
      }
    });
  });

  const sentinel = document.createElement("div");
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}
