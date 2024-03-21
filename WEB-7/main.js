let spheres = [];
let currentPhase = 0;
const phases = ["FLOATING", "ECLIPSE", "SCATTER", "ANOTHER_PHASE"]; // Example phases

function setup() {
  let p5Canvas = createCanvas(windowWidth, windowHeight);
  p5Canvas.id("p5Canvas");
  spheres = [
    { x: -100, y: 20, size: 40, currentSize: 40, targetSize: 40, color: "#F79B00", text: "" },
    { x: 100, y: -20, size: 40, currentSize: 40, targetSize: 40, color: "#000", text: "" },

    { x: 0, y: 0, size: 40, currentSize: 40, targetSize: 40, color: "#F79B00", text: "" },
    { x: 0, y: 0, size: 40, currentSize: 40, targetSize: 40, color: "#F79B00", text: "" },
    { x: 0, y: 0, size: 40, currentSize: 40, targetSize: 40, color: "#F79B00", text: "" },
    { x: 0, y: 0, size: 40, currentSize: 40, targetSize: 40, color: "#F79B00", text: "" },
    { x: 0, y: 0, size: 40, currentSize: 40, targetSize: 40, color: "#F79B00", text: "" }
  ];
}

function mouseClicked() {
  currentPhase = (currentPhase + 1) % phases.length;
}

function draw() {
  background(220);
  translate(width / 2, height / 2);

  const hoverScale = 1.5;
  let visibleSpheres;

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
  }

  if (phases[currentPhase] === "SCATTER") {
    visibleSpheres = spheres.slice(2, 7);

    spheres[2].x = lerp(spheres[2].x, -400, 0.05);
    spheres[2].y = lerp(spheres[2].y, 0, 0.05);
    spheres[3].x = lerp(spheres[3].x, -200, 0.05);
    spheres[3].y = lerp(spheres[3].y, 0, 0.05);
    spheres[4].x = lerp(spheres[4].x, 0, 0.05);
    spheres[4].y = lerp(spheres[4].y, 0, 0.05);
    spheres[5].x = lerp(spheres[5].x, 200, 0.05);
    spheres[5].y = lerp(spheres[5].y, 0, 0.05);
    spheres[6].x = lerp(spheres[6].x, 400, 0.05);
    spheres[6].y = lerp(spheres[6].y, 0, 0.05);
  }

  // Draw only the visible spheres
  for (let sphere of visibleSpheres) {
    let d = dist(mouseX - width / 2, mouseY - height / 2, sphere.x, sphere.y);
    let isHovering = d < sphere.size / 2;
    sphere.targetSize = isHovering ? sphere.size * hoverScale : sphere.size;
    // Smoothly transition currentSize towards targetSize
    sphere.currentSize = lerp(sphere.currentSize, sphere.targetSize, 0.1);

    // Use currentSize for drawing
    fill(sphere.color);
    ellipse(sphere.x, sphere.y, sphere.currentSize);

    // If there's text for the sphere, draw it
    if (sphere.text) {
      fill(0); // Text color
      textAlign(CENTER, CENTER);
      text(sphere.text, sphere.x, sphere.y);
    }
  }
}
