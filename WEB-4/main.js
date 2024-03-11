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

  const tappingHand = document.createElement("img");
  tappingHand.src = "./assets/images/tap-1.png";
  tappingHand.id = "tapping-hand";
  tappingHand.style.transition = 'opacity 2s';
  tappingHand.style.position = "absolute";
  tappingHand.style.zIndex = "1000";
  tappingHand.style.height = "70px";
  tappingHand.style.width = "50px";
  tappingHand.style.bottom = "20px";
  tappingHand.style.left = "50%";
  tappingHand.style.transform = "translate(-50%, -50%)";
  document.body.appendChild(tappingHand);

  const tapText = document.createElement("div");
  tapText.textContent = "tap to continue";
  tapText.className = "tap-text";
  tapText.style.transition = 'opacity 2s';
  tapText.style.position = "absolute";
  tapText.style.zIndex = "1001";
  tapText.style.bottom = "140px";
  tapText.style.left = "50%";
  tapText.style.transform = "translateX(-50%)";
  tapText.style.color = "white";
  tapText.style.fontSize = "16px";
  tapText.style.fontWeight = "700";
  document.body.appendChild(tapText);

  let visibilityToggle = true;
  const intervalID = setInterval(() => {
    tappingHand.style.opacity = visibilityToggle ? ".8" : "0";
    tapText.style.opacity = visibilityToggle ? "1" : "0";
    visibilityToggle = !visibilityToggle;
  }, 5000);

  heroHeader.addEventListener("click", function () {
    clearInterval(intervalID); // Clear the interval to stop toggling
    heroHeader.style.opacity = "0";
    tappingHand.style.display = "none";
    tapText.style.display = "none";
    setTimeout(() => {
      heroHeader.style.visibility = "hidden";
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
