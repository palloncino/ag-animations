let spheres = [];
let currentPhase = 0;
let scaleTimerStarted = false;
let scaleTimer = 0;
let currentHoveredSphereId = null;
const phases = ["FLOATING", "ECLIPSE", "SCATTER", "REDIRECT"];
const hiddenContent = document.getElementById("hidden-content");

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
    { x: -100, y: -20, size: 80, currentSize: 80, targetSize: 80, color: "#000", text: "" },
    { x: 100, y: 20, size: 80, currentSize: 80, targetSize: 80, color: "#F79B00", text: "" },
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
  setTimeout(() => (currentPhase = (currentPhase + 1) % phases.length), 500);
}

function mouseClicked() {
  if (currentPhase === 0) {
    return;
  }
  currentPhase = (currentPhase + 1) % phases.length;
}

function applyOrbitalBehavior(sphere, orbitCenter, majorAxis, minorAxis, frameOffset, clockwise = true) {
  const directionMultiplier = clockwise ? 1 : -1;
  const angle = (frameCount + frameOffset) * 0.02 * directionMultiplier;
  sphere.x = orbitCenter.x + cos(angle) * majorAxis;
  sphere.y = orbitCenter.y + sin(angle) * minorAxis;
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
    }
  }

  if (phases[currentPhase] === "SCATTER") {
    visibleSpheres = spheres.slice(2, 8);

    spheres[2].x = lerp(spheres[2].x, -500, 0.05);
    spheres[2].y = lerp(spheres[2].y, -150, 0.05);

    spheres[3].x = lerp(spheres[3].x, -300, 0.05);
    spheres[3].y = lerp(spheres[3].y, -250, 0.05);

    spheres[4].x = lerp(spheres[4].x, -100, 0.05);
    spheres[4].y = lerp(spheres[4].y, -300, 0.05);

    spheres[5].x = lerp(spheres[5].x, 100, 0.05);
    spheres[5].y = lerp(spheres[5].y, -300, 0.05);

    spheres[6].x = lerp(spheres[6].x, 300, 0.05);
    spheres[6].y = lerp(spheres[6].y, -250, 0.05);

    spheres[7].x = lerp(spheres[7].x, 500, 0.05);
    spheres[7].y = lerp(spheres[7].y, -150, 0.05);
  }

  if (phases[currentPhase] === "REDIRECT") {
    visibleSpheres = [];
    document.body.style.overflow = "unset";
    const canvas = document.querySelector("#p5Canvas");
    canvas.style.display = "none";
  }

  for (let sphere of visibleSpheres) {
    let d = dist(mouseX - width / 2, mouseY - height / 2, sphere.x, sphere.y);
    let isHovering = d < sphere.size / 2;
    sphere.targetSize = isHovering ? sphere.size * hoverScale : sphere.size;
    sphere.currentSize = lerp(sphere.currentSize, sphere.targetSize, 0.1);

    if (isHovering) {
      handleSphereHover(sphere);
      isHoveringAnySphere = true;
    }

    fill(sphere.color);
    ellipse(sphere.x, sphere.y, sphere.currentSize);

    // Displaying text on each sphere, if it has text
    if (sphere.text) {
      fill(0); // Text color
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(16);
      text(sphere.text, sphere.x, sphere.y);
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
    if (el) {
      el.style.visibility = "visible";
      el.style.opacity = 1;
    }
    if (currentHoveredSphereId) {
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
