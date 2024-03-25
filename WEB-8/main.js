let spheres = [
  { x: -100, y: 0, size: 80, currentSize: 80, targetSize: 80, color: "red", text: "Web Development" },
  { x: 100, y: 0, size: 80, currentSize: 80, targetSize: 80, color: "yellow", text: "Design" }
];

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
}

function draw() {
  background(180);
  translate(width / 2, height / 2); // Adjust canvas drawing origin to the center

  spheres.forEach(sphere => {
    drawSphereWithText(sphere);
  });
}

function drawSphereWithText(sphere) {
  // Draw the sphere
  fill(sphere.color);
  noStroke();
  ellipse(sphere.x, sphere.y, sphere.size);

  // Draw the curved text
  drawCurvedText(sphere);
}

function drawCurvedText(sphere) {
  let radius = sphere.size / 2 + 20; // Adjusting to place text above the sphere
  let spacing = 8; // Default spacing, adjust if necessary
  
  // Adjusting the spacing based on the text length if needed
  let totalAngle = (sphere.text.length - 1) * spacing;
  
  // Calculate starting angle to center text
  let startAngle = -90 - (totalAngle / 2);

  for (let i = 0; i < sphere.text.length; i++) {
    let angle = startAngle + (i * spacing);
    let x = cos(angle) * radius + sphere.x;
    let y = sin(angle) * radius + sphere.y;
    
    push(); // Saving the current state
    translate(x, y); // Translating to character position
    rotate(angle + 90); // Rotating character for upright orientation
    fill(0); // Text color (change if needed)
    noStroke();
    text(sphere.text[i], 0, 0); // Drawing character
    pop(); // Restoring previous state
  }
}
