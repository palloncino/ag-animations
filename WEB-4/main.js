document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 600) {
    customMobileEffectCBG();
  } else {
    customDesktopEffectCBG();
  }
});

function customMobileEffectCBG() {
  function adjustViewportHeight() {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  }

  window.addEventListener("resize", adjustViewportHeight);
  adjustViewportHeight();

  const heroHeader = document.getElementById("hero-header");
  heroHeader.style.transition = 'opacity .5s';
  const scroll_to_discover_span = document.getElementById("Scroll_to_discover_span");
  const scroll_to_discover_container = document.querySelector(".Scroll_to_discover");

  scroll_to_discover_container.style.background = '#000';
  scroll_to_discover_span.style.color = '#fff';
  scroll_to_discover_span.textContent = 'Tap to continue';

  heroHeader.addEventListener("click", function () {
    heroHeader.style.opacity = "0";
    scroll_to_discover_container.style.display = 'none';
    setTimeout(() => {
      heroHeader.style.visibility = "hidden";
    }, 500);
  });
}

let ignoreNextScrollEvent = false;

function customDesktopEffectCBG() {
  const backgroundSky = document.querySelector(".background-sky");
  const foregroundFactory = document.querySelector(".foreground-factory");
  backgroundSky.style.position = "fixed";
  foregroundFactory.style.position = "fixed";

  const scroll_to_discover_span = document.getElementById("Scroll_to_discover_span");
  const scroll_to_discover_container = document.querySelector(".Scroll_to_discover");

  function changeScrollTitleColor() {
    scroll_to_discover_container.style.background = '#000';
    scroll_to_discover_container.style.transition = '.5s';
    scroll_to_discover_span.style.color = '#fff';
  }

  changeScrollTitleColor();

  const heroHeader = document.getElementById("hero-header");
  let maxScroll = 500;
  let effectiveScrollY = 0;

  // Ensure the heroHeader starts fully visible without any clipping.
  heroHeader.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

  function updateHeroHeader(scrollDelta) {
    if (ignoreNextScrollEvent) {
      // If the flag is set, ignore this event and reset the flag for next events
      ignoreNextScrollEvent = false;
      return;
    }

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
      changeScrollTitleColor();
      scale = 1.2 - (progress - 0.5) * 1.4; // Progress 1 => scale 0.5
    }
    heroHeader.style.transform = `scale(${scale})`;

    // Adjust clipPath calculation to start fully visible and gradually clip
    const clipPercent = 50 * progress;

    // Apply the updated clipPath to create the shrinking effect
    heroHeader.style.clipPath = `polygon(${clipPercent}% ${clipPercent}%, ${100 - clipPercent}% ${clipPercent}%, ${
      100 - clipPercent
    }% ${100 - clipPercent}%, ${clipPercent}% ${100 - clipPercent}%)`;

    if (effectiveScrollY >= maxScroll) {
      document.body.style.overflowY = "auto";
      window.removeEventListener("wheel", onWheel);
      scroll_to_discover_container.style.background = 'transparent';
      scroll_to_discover_span.style.color = 'unset';
      ignoreNextScrollEvent = true;
      console.log(1)
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
