// updated 12 Mar 2024 - Antonio Guiotto
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 600) {
    customMobileEffectCBG();
  } else {
    customDesktopEffectCBG();
  }
});

function customMobileEffectCBG() {
  const scrollToContinue = document.getElementById("scroll-to-continue");
  scrollToContinue.textContent = "Fai tap per scorrere";

  document.body.style.overflowY = "hidden";

  function adjustViewportHeight() {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  }

  window.addEventListener("resize", adjustViewportHeight);
  adjustViewportHeight();

  const heroHeader = document.getElementById("hero-header");
  heroHeader.style.transition = "opacity .5s";

  heroHeader.addEventListener("click", function () {
    heroHeader.style.opacity = "0";
    setTimeout(() => {
      heroHeader.style.visibility = "hidden";
      document.body.style.overflowY = "auto";
    }, 500);
  });
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
    heroHeader.style.clipPath = `polygon(${clipPercent}% ${clipPercent}%, ${100 - clipPercent}% ${clipPercent}%, ${
      100 - clipPercent
    }% ${100 - clipPercent}%, ${clipPercent}% ${100 - clipPercent}%)`;

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
