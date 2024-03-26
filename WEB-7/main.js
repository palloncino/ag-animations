let spheres = [];
let routeSelected = false;
let currentPhase = 0;
let scaleTimerStarted = false;
let scaleTimer = 0;
let currentHoveredSphereId = null;
let hoverLock = true;
let firstTimeScatter = true;
let firstScatterClick = true;
let VIEWPORT = "";
let currentTargets = [];
let endAnimationHeightMeasurement;
let endAnimation = false;
let disabledPress = false;
let timestampEndingAnimation;
let durationEndingAnimation = 2000;

if (window.innerWidth > 1440) {
  VIEWPORT = "monitor";
} else if (window.innerWidth <= 1440 && window.innerWidth >= 600) {
  VIEWPORT = "laptop";
} else {
  VIEWPORT = "mobile";
}

const phases = ["FLOATING", "ECLIPSE", "SCATTER", "REDIRECT"];

const CbgTextHeading = document.getElementById("cbg_text_heading");
const art_direction_container = document.getElementById("art_direction");
const design_container = document.getElementById("design");
const visual_art_container = document.getElementById("visual_art");
const web_development_container = document.getElementById("web_development");
const data_analysis_container = document.getElementById("data_analysis");
const social_media_container = document.getElementById("social_media");

function domContainerMapping(name) {
  switch (name) {
    case "art_direction":
      return art_direction_container;

    case "design":
      return design_container;

    case "visual_art":
      return visual_art_container;

    case "web_development":
      return web_development_container;

    case "data_analysis":
      return data_analysis_container;

    case "social_media":
      return social_media_container;

    default:
      art_direction_container;
  }
}

function setup() {
  let p5Canvas = createCanvas(windowWidth, windowHeight);
  p5Canvas.id("p5Canvas");
  spheres = [
    { x: -300, y: 100, size: 80, currentSize: 80, targetSize: 80, color: "#000", text: "" },
    { x: 300, y: -100, size: 80, currentSize: 80, targetSize: 80, color: "#F79B00", text: "" },
    {
      x: 0,
      y: 0,
      size: 80,
      currentSize: 80,
      targetSize: 80,
      color: "#F79B00",
      text: "Art direction",
      id: "art_direction",
    },
    { x: 0, y: 0, size: 80, currentSize: 80, targetSize: 80, color: "#F79B00", text: "Design", id: "design" },
    { x: 0, y: 0, size: 80, currentSize: 80, targetSize: 80, color: "#F79B00", text: "Visual Art", id: "visual_art" },
    {
      x: 0,
      y: 0,
      size: 80,
      currentSize: 80,
      targetSize: 80,
      color: "#F79B00",
      text: "Web development",
      id: "web_development",
    },
    {
      x: 0,
      y: 0,
      size: 80,
      currentSize: 80,
      targetSize: 80,
      color: "#F79B00",
      text: "Data analysis",
      id: "data_analysis",
    },
    {
      x: 0,
      y: 0,
      size: 80,
      currentSize: 80,
      targetSize: 80,
      color: "#F79B00",
      text: "Social media",
      id: "social_media",
    },
  ];
  setTimeout(() => (currentPhase = (currentPhase + 1) % phases.length), 0);
}

function exitSceneAndRedirect(_sphere) {
  endAnimation = true;
  timestampEndingAnimation = millis();
  let keeper;

  // Reset the position of the first sphere and ensure it is visible
  spheres[0].x = -400; // Set the x position to -200
  spheres[0].y = -400; // Set the y position to -200
  spheres[0].isExiting = false; // Ensure it is not marked as exiting
  spheres[0].currentSize = 80; // Ensure it is not marked as exiting

  // Now, handle the rest of the spheres for exiting or keeping
  spheres.slice(2, 8).forEach((sphere) => {
    if (sphere.id !== _sphere.id) {
      sphere.isExiting = true; // Mark the sphere as exiting
    } else {
      keeper = sphere; // Keep the selected sphere
      keeper.isLastOrange = true;
    }
  });
}

function mousePressed() {
  if (disabledPress) {
    return;
  }
  // Ensure this logic only applies during the "ECLIPSE" phase
  if (phases[currentPhase] === "ECLIPSE") {
    if (hoverLock) {
      return;
    }
    const clickedSphere = checkSphereClicked();
    if (clickedSphere) {
      // A sphere was clicked, transition to the next phase
      currentPhase = (currentPhase + 1) % phases.length;
    }
  }
  if (phases[currentPhase] === "SCATTER") {
    if (firstScatterClick) {
      firstScatterClick = false;
      return;
    } else {
      for (let sphere of spheres.slice(2)) {
        let distance = dist(mouseX - width / 2, mouseY - height / 2, sphere.x, sphere.y);
        if (distance < sphere.size / 2) {
          exitSceneAndRedirect(sphere);
          return;
        }
      }
    }
  }
}


function draw() {
  background("#F0EBE6");
  translate(width / 2, height / 2);

  let isHoveringAnySphere = false;
  const hoverScale = 1.2;
  let visibleSpheres = [];

  noStroke();

  if (phases[currentPhase] === "FLOATING") {
    visibleSpheres = spheres.slice(0, 2);
    const orbitCenter = [
      { x: 150, y: -50 },
      { x: -150, y: 50 },
    ];
    applyOrbitalBehavior(visibleSpheres[1], orbitCenter[0], 30, 20, 100, true);
    applyOrbitalBehavior(visibleSpheres[0], orbitCenter[1], 30, 20, 100, false);
  }

  if (phases[currentPhase] === "ECLIPSE") {
    visibleSpheres = spheres.slice(0, 2);
    spheres[0].x = lerp(spheres[0].x, 0, 0.05);
    spheres[0].y = lerp(spheres[0].y, 0, 0.05);

    spheres[1].x = lerp(spheres[1].x, 0, 0.05);
    spheres[1].y = lerp(spheres[1].y, 0, 0.05);

    // Check if both spheres have reached their target positions
    const threshold = 1; // Small threshold for considering position reached
    let distance1 = dist(spheres[0].x, spheres[0].y, 0, 0);
    let distance2 = dist(spheres[1].x, spheres[1].y, 0, 0);
    if (distance1 < threshold && distance2 < threshold && !scaleTimerStarted) {
      scaleTimerStarted = true;
      scaleTimer = millis(); // Start timer
    }

    // After 500ms have passed since the timer started, begin scaling
    if (scaleTimerStarted && millis() - scaleTimer > 500) {
      spheres[0].currentSize = lerp(spheres[0].currentSize, 120, 0.05);
      hoverLock = false;
    }
  }

  if (phases[currentPhase] === "SCATTER") {
    if (!hoverLock && firstTimeScatter) {
      hoverLock = true;
      firstTimeScatter = false;
      setTimeout(() => {
        if (!(VIEWPORT === "mobile")) {
          hoverLock = false;
        }
      }, 500);
    }
    visibleSpheres = spheres.slice(2, 8);

    // According to the viewport size
    const monitorTargets = [
      { x: -500, y: -150 },
      { x: -300, y: -250 },
      { x: -100, y: -300 },
      { x: 100, y: -300 },
      { x: 300, y: -250 },
      { x: 500, y: -150 },
    ];
    const laptopTargets = [
      { x: -375, y: -112.5 },
      { x: -225, y: -187.5 },
      { x: -75, y: -225 },
      { x: 75, y: -225 },
      { x: 225, y: -187.5 },
      { x: 375, y: -112.5 },
    ];
    const mobileTargets = [
      { x: -(window.innerWidth / 4), y: -(window.innerHeight / 4) },
      { x: -(window.innerWidth / 4), y: 0 },
      { x: -(window.innerWidth / 4), y: window.innerHeight / 4 },
      { x: window.innerWidth / 4, y: window.innerHeight / 4 },
      { x: window.innerWidth / 4, y: 0 },
      { x: window.innerWidth / 4, y: -(window.innerHeight / 4) },
    ];

    if (VIEWPORT === "monitor") {
      currentTargets = monitorTargets;
      endAnimationHeightMeasurement = -250;
    } else if (VIEWPORT === "laptop") {
      endAnimationHeightMeasurement = -187.5;
      currentTargets = laptopTargets;
    } else {
      endAnimationHeightMeasurement = -140;
      currentTargets = mobileTargets;
    }

    spheres[2].x = lerp(spheres[2].x, currentTargets[0].x, 0.05);
    spheres[2].y = lerp(spheres[2].y, currentTargets[0].y, 0.05);

    spheres[3].x = lerp(spheres[3].x, currentTargets[1].x, 0.05);
    spheres[3].y = lerp(spheres[3].y, currentTargets[1].y, 0.05);

    spheres[4].x = lerp(spheres[4].x, currentTargets[2].x, 0.05);
    spheres[4].y = lerp(spheres[4].y, currentTargets[2].y, 0.05);

    spheres[5].x = lerp(spheres[5].x, currentTargets[3].x, 0.05);
    spheres[5].y = lerp(spheres[5].y, currentTargets[3].y, 0.05);

    spheres[6].x = lerp(spheres[6].x, currentTargets[4].x, 0.05);
    spheres[6].y = lerp(spheres[6].y, currentTargets[4].y, 0.05);

    spheres[7].x = lerp(spheres[7].x, currentTargets[5].x, 0.05);
    spheres[7].y = lerp(spheres[7].y, currentTargets[5].y, 0.05);
  }

  for (let sphere of visibleSpheres) {
    if (sphere.isExiting) {
      sphere.y = lerp(sphere.y, -1000, 0.05);
    } else if (sphere.isOrbiting) {
      const el = domContainerMapping(sphere.id);
      if (el) {
        el.style.visibility = "visible";
        el.style.opacity = 1;
      }
    }

    let d = dist(mouseX - width / 2, mouseY - height / 2, sphere.x, sphere.y);
    let isHovering = d < sphere.size / 2;
    sphere.currentSize = lerp(sphere.currentSize, sphere.targetSize, 0.1);

    if (!hoverLock) {
      sphere.targetSize = isHovering ? sphere.size * hoverScale : sphere.size;
    }

    if (isHovering) {
      handleSphereHover(sphere);
      isHoveringAnySphere = true;
    }

    fill(sphere.color);
    ellipse(sphere.x, sphere.y, sphere.currentSize);

    if (endAnimation) {
      hoverLock = true;

      let elapsedTime = millis() - timestampEndingAnimation;
      let t = elapsedTime / durationEndingAnimation; // Calculate the normalized time elapsed

      if (t >= 1) {
        t = 1;
        animating = false; // Stop the animation when the duration is reached or exceeded
        CbgTextHeading.style.visibility = 'visible';
        CbgTextHeading.style.opacity = 1;
      }

      let easedT = easeOutQuad(t);

      spheres[0].x = lerp(-200, -10, easedT);
      spheres[0].y = lerp(-200, endAnimationHeightMeasurement - 30, easedT);

      if (sphere.isLastOrange) {
        sphere.x = lerp(sphere.x, 20, t);
        sphere.y = lerp(sphere.y, endAnimationHeightMeasurement, t);
        sphere.currentSize = 80;
      }

      fill(spheres[0].color);
      ellipse(spheres[0].x, spheres[0].y, spheres[0].currentSize);

      disabledPress = true;
    }

    // Displaying text on each sphere, if it has text
    if (sphere.text && !sphere.isExiting && !sphere.isLastOrange) {
      drawCurvedText(sphere);
    }
  }

  // If no sphere is hovered, call handleNoHover
  if (!isHoveringAnySphere) {
    handleNoHover();
  }

  cursor(isHoveringAnySphere ? "pointer" : "default");
}

function handleSphereHover(sphere) {
  if (currentHoveredSphereId !== sphere.id) {
    const el = domContainerMapping(sphere.id);
    if (el && !hoverLock) {
      el.style.visibility = "visible";
      el.style.opacity = 1;
    }
    currentHoveredSphereId = sphere.id;
  }
}

function handleNoHover() {
  if (currentHoveredSphereId) {
    const el = domContainerMapping(currentHoveredSphereId);
    if (el) {
      el.style.visibility = "hidden";
      el.style.opacity = 0;
    }
    currentHoveredSphereId = null;
  }
}

function checkSphereClicked() {
  for (let i = 0; i < spheres.length; i++) {
    const sphere = spheres[i];
    const d = dist(mouseX - width / 2, mouseY - height / 2, sphere.x, sphere.y);
    if (d < sphere.size / 2) {
      return sphere; // Return the clicked sphere
    }
  }
  return null; // No sphere was clicked
}

function drawCurvedText(sphere) {
  let radius = sphere.currentSize / 2 + 20; // Adjust radius for text placement
  let textSizeVariable = 16; // Adjustable text size
  textSize(textSizeVariable);

  let circumference = TWO_PI * radius; // Circle circumference where text is placed

  // Function to calculate the angle degree occupied by each character
  function charAngleDegrees(charWidth, circumference) {
    return (charWidth / circumference) * 360; // Angle in degrees
  }

  // Calculate total angle occupied by the text
  let totalTextAngle = 0;
  for (let char of sphere.text) {
    let charWidth = textWidth(char); // Get width in pixels
    totalTextAngle += charAngleDegrees(charWidth, circumference); // Sum angles
  }

  // Calculate the starting angle to center the text at the top of the sphere
  let startAngleDegrees = -90 - totalTextAngle / 2;

  let currentAngleDegrees = startAngleDegrees;
  for (let i = 0; i < sphere.text.length; i++) {
    let char = sphere.text[i];
    let charWidth = textWidth(char);
    let charAngle = charAngleDegrees(charWidth, circumference);

    // Position for each character
    let angle = radians(currentAngleDegrees + charAngle / 2); // Center character in its allocated angle
    let x = sphere.x + cos(angle) * radius;
    let y = sphere.y + sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle + HALF_PI); // Adjust rotation to draw text upright
    fill(0); // Text color
    noStroke();
    textAlign(CENTER, CENTER);
    text(char, 0, 0); // Draw the character
    pop();

    // Update the current angle for the next character
    currentAngleDegrees += charAngle;
  }
}

function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}