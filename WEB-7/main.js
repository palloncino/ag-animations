let spheres = [];
let currentPhase = 0;
const phases = ["FLOATING", "ECLIPSE", "SCATTER", "ANOTHER_PHASE"]; // Example phases

function setup() {
  let p5Canvas = createCanvas(windowWidth, windowHeight);
  p5Canvas.id("p5Canvas");
  spheres = [
    { x: -100, y: 20, size: 40, color: "green", text: "" },
    { x: 100, y: -20, size: 40, color: "blue", text: "" },

    { x: 0, y: 0, size: 40, color: "orange", text: "" },
    { x: 0, y: 0, size: 40, color: "yellow", text: "" },
    { x: 0, y: 0, size: 40, color: "red", text: "" },
    { x: 0, y: 0, size: 40, color: "purple", text: "" },
  ];
}

function mouseClicked() {
  currentPhase = (currentPhase + 1) % phases.length;
}

function draw() {
  background(220);
  translate(width / 2, height / 2);

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
    visibleSpheres = spheres.slice(2, 6); // Determine which spheres are visible during SCATTER phase

    // Smoothly transition sphere[2] to its target
    spheres[2].x = lerp(spheres[2].x, -300, 0.05); // Start from current x to -300
    spheres[2].y = lerp(spheres[2].y, 0, 0.05); // Start from current y to 0

    // Smoothly transition sphere[3] to its target
    spheres[3].x = lerp(spheres[3].x, -100, 0.05); // Start from current x to -100
    spheres[3].y = lerp(spheres[3].y, 0, 0.05); // Start from current y to 0

    // Smoothly transition sphere[4] to its target
    spheres[4].x = lerp(spheres[4].x, 100, 0.05); // Start from current x to 100
    spheres[4].y = lerp(spheres[4].y, 0, 0.05); // Start from current y to 0

    // Smoothly transition sphere[5] to its target
    spheres[5].x = lerp(spheres[5].x, 300, 0.05); // Start from current x to 300
    spheres[5].y = lerp(spheres[5].y, 0, 0.05); // Start from current y to 0
  }

  // Draw only the visible spheres
  for (let sphere of visibleSpheres) {
    fill(sphere.color);
    ellipse(sphere.x, sphere.y, sphere.size);

    // If there's text for the sphere, draw it
    if (sphere.text) {
      fill(0); // Text color
      textAlign(CENTER, CENTER);
      text(sphere.text, sphere.x, sphere.y);
    }
  }
}
