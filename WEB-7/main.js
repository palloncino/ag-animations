let spheres = [];
let currentPhase = 0;
let scaleTimerStarted = false;
let scaleTimer = 0;
const phases = ["FLOATING", "ECLIPSE", "SCATTER", "ANOTHER_PHASE"];

function setup() {
  let p5Canvas = createCanvas(windowWidth, windowHeight);
  p5Canvas.id("p5Canvas");
  spheres = [
    { x: -100, y: -20, size: 60, currentSize: 60, targetSize: 60, color: "#000", text: "" },
    { x: 100, y: 20, size: 60, currentSize: 60, targetSize: 60, color: "#F79B00", text: "" },

    { x: 0, y: 0, size: 60, currentSize: 60, targetSize: 60, color: "#F79B00", text: "Art direction" },
    { x: 0, y: 0, size: 60, currentSize: 60, targetSize: 60, color: "#F79B00", text: "Design" },
    { x: 0, y: 0, size: 60, currentSize: 60, targetSize: 60, color: "#F79B00", text: "Visual Art" },
    { x: 0, y: 0, size: 60, currentSize: 60, targetSize: 60, color: "#F79B00", text: "Web development" },
    { x: 0, y: 0, size: 60, currentSize: 60, targetSize: 60, color: "#F79B00", text: "Data analysis" },
    { x: 0, y: 0, size: 60, currentSize: 60, targetSize: 60, color: "#F79B00", text: "Social media" },
  ];
}

function mouseClicked() {
  currentPhase = (currentPhase + 1) % phases.length;
}

function draw() {
  background(220);
  translate(width / 2, height / 2);

  const hoverScale = 1.5;
  let visibleSpheres = [];

  noStroke();

  if (phases[currentPhase] === "FLOATING") {
    visibleSpheres = spheres.slice(0, 2);
    spheres[0].y += sin(frameCount / 10) * 2;
    spheres[1].y += sin(frameCount / 10) * 2;
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
      spheres[0].currentSize = lerp(spheres[0].currentSize, 80, 0.05);
    }
  }

  if (phases[currentPhase] === "SCATTER") {
    visibleSpheres = spheres.slice(2, 8);

    spheres[2].x = lerp(spheres[2].x, -500, 0.05);
    spheres[2].y = lerp(spheres[2].y, 0, 0.05);

    spheres[3].x = lerp(spheres[3].x, -300, 0.05);
    spheres[3].y = lerp(spheres[3].y, 0, 0.05);

    spheres[4].x = lerp(spheres[4].x, -100, 0.05);
    spheres[4].y = lerp(spheres[4].y, 0, 0.05);

    spheres[5].x = lerp(spheres[5].x, 100, 0.05);
    spheres[5].y = lerp(spheres[5].y, 0, 0.05);

    spheres[6].x = lerp(spheres[6].x, 300, 0.05);
    spheres[6].y = lerp(spheres[6].y, 0, 0.05);

    spheres[7].x = lerp(spheres[7].x, 500, 0.05);
    spheres[7].y = lerp(spheres[7].y, 0, 0.05);
  }

  for (let sphere of visibleSpheres) {
    let d = dist(mouseX - width / 2, mouseY - height / 2, sphere.x, sphere.y);
    let isHovering = d < sphere.size / 2;
    sphere.targetSize = isHovering ? sphere.size * hoverScale : sphere.size;
    sphere.currentSize = lerp(sphere.currentSize, sphere.targetSize, 0.1);

    fill(sphere.color);
    ellipse(sphere.x, sphere.y, sphere.currentSize);

    if (phases[currentPhase] === "SCATTER" && sphere.text) {
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(16);
      text(sphere.text, sphere.x, sphere.y);
    }
  }
}
