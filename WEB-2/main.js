document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 600) {
    customMobileEffectCBG();
  } else {
    customDesktopEffectCBG();
  }
});

function customMobileEffectCBG() {
  // Flag to track whether scrolling is allowed or not
  let scrollingAllowed = false;
  let counter = 0;
  const maxCounter = 50;  // This value determines how many scroll events are required to completely hide the header
  const heroHeader = document.getElementById("hero-header");

  // Function to prevent scrolling
  function preventScrolling() {
    if (!scrollingAllowed) {
      window.scrollTo(0, 0); // Scroll back to the top
    }
  }

  // Prevent scrolling initially
  preventScrolling();

  // Update the --vh CSS variable when the window is resized
  window.addEventListener("resize", function () {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  });

  // Handle scroll event
  window.addEventListener("scroll", function (e) {
    // Prevent default scrolling behavior
    e.preventDefault();

    if (counter < maxCounter) {
      counter += 1;
      updateHeroHeader(counter, maxCounter);
      preventScrolling();  // Keep preventing the natural scroll until fully hidden
    } else {
      scrollingAllowed = true;  // Allow natural scrolling after the header is fully hidden
      document.body.style.overflowY = "auto";  // Enable scrolling
    }

    console.log(counter);
  });

  function updateHeroHeader(counter, maxCounter) {
    let progress = counter / maxCounter;

    // Scale calculation
    let scale;
    if (progress <= 0.5) {
      scale = 1 + progress * 0.4;  // Scale up from 1 to 1.2
    } else {
      scale = 1.2 - (progress - 0.5) * 1.4;  // Then scale down from 1.2 to 0.5
    }
    heroHeader.style.transform = `scale(${scale})`;

    // Clip path adjustment for visual shrink effect
    const clipPercent = 50 * progress;
    heroHeader.style.clipPath = `polygon(${clipPercent}% ${clipPercent}%, ${100 - clipPercent}% ${clipPercent}%, ${100 - clipPercent}% ${100 - clipPercent}%, ${clipPercent}% ${100 - clipPercent}%)`;
  }
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
