function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  let circleDiameter = 100;
  let circleX = width / 2;
  let circleY = height / 2;

  // Draw the circle
  ellipse(circleX, circleY, circleDiameter);

  // Your text
  let textStr = "Web development";
  let radius = circleDiameter / 2 + 20; // Adjust for text to appear above the circle
  
  // Fixed spacing between characters
  let spacing = 8;

  // Calculate the total angle covered by the text
  let totalAngle = (textStr.length - 1) * spacing;

  // Starting angle adjustment to move text to visual "top center" of the circle for the viewer
  // This places the center of the text at -90 degrees (the geometric 'left' of the circle, which appears as the top center to viewers)
  let startAngle = -90 - (totalAngle / 2);

  // Draw each character
  for (let i = 0; i < textStr.length; i++) {
    let angle = startAngle + (i * spacing);
    let x = circleX + cos(angle) * radius;
    let y = circleY + sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle + 90); // Adjust rotation for text orientation
    text(textStr[i], 0, 0);
    pop();
  }
}
