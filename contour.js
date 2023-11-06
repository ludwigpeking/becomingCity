//Richard Qian Li refactored...
//source: The Coding Train / Daniel Shiffman
let altitude;
function contour() {
  background(100, 150, 255);
  for (let altitude = 0; altitude < 100; altitude += 5) {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // if (i % 5 == 0 && j % 5 == 0) {
        //   fill(0);
        //   noStroke();
        //   textSize(15);
        //   text(grid[i][j].altitude, grid[i][j].x, grid[i][j].y + 10);
        //   stroke(0);
        //   noFill();
        // }
        let f0 = grid[i][j].altitude - altitude;
        let f1 = grid[i + 1][j].altitude - altitude;
        let f2 = grid[i + 1][j + 1].altitude - altitude;
        let f3 = grid[i][j + 1].altitude - altitude;

        let x = i * res ; // center offset
        let y = j * res ; // center offset
        let a = createVector(x + (res * f0) / (f0 - f1), y);
        let b = createVector(x + res, y + (res * f1) / (f1 - f2));
        let c = createVector(x + res * (1 - f2 / (f2 - f3)), y + res);
        let d = createVector(x, y + res * (1 - f3 / (f3 - f0)));

        let state = getState(f0, f1, f2, f3);
        switch (state) {
          case 0:
            break;
          case 1:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(c.x, c.y);
            vertex(x, y + res);
            vertex(d.x, d.y);
            endShape();
            drawLine(c, d);
            break;
          case 2:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();

            vertex(b.x, b.y);
            vertex(x + res, y + res);
            vertex(c.x, c.y);
            endShape();
            drawLine(b, c);
            break;
          case 3:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(b.x, b.y);
            vertex(x + res, y + res);
            vertex(x, y + res);
            vertex(d.x, d.y);
            endShape();
            drawLine(b, d);
            break;
          case 4:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(a.x, a.y);
            vertex(x + res, y);
            vertex(b.x, b.y);
            endShape();
            drawLine(a, b);
            break;
          case 5:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(a.x, a.y);
            vertex(x + res, y);
            vertex(b.x, b.y);
            vertex(c.x, c.y);
            vertex(x, y + res);
            vertex(d.x, d.y);
            endShape();
            drawLine(a, d);
            drawLine(b, c);
            break;
          case 6:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(a.x, a.y);
            vertex(x + res, y);
            vertex(x + res, y + res);

            vertex(c.x, c.y);
            endShape();
            drawLine(a, c);
            break;
          case 7:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(a.x, a.y);
            vertex(x + res, y);
            vertex(x + res, y + res);
            vertex(x, y + res);
            vertex(d.x, d.y);
            endShape();
            drawLine(a, d);
            break;
          case 8:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(x, y);
            vertex(a.x, a.y);
            vertex(d.x, d.y);
            endShape();
            drawLine(a, d);
            break;
          case 9:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(x, y);
            vertex(a.x, a.y);
            vertex(c.x, c.y);
            vertex(x, y + res);
            endShape();

            drawLine(a, c);
            break;
          case 10:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(x, y);
            vertex(a.x, a.y);
            vertex(b.x, b.y);
            vertex(x + res, y + res);
            vertex(c.x, c.y);
            vertex(d.x, d.y);
            endShape();
            drawLine(a, b);
            drawLine(c, d);
            break;
          case 11:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(x, y);
            vertex(a.x, a.y);
            vertex(b.x, b.y);
            vertex(x + res, y + res);
            vertex(x, y + res);
            endShape();
            drawLine(a, b);
            break;
          case 12:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(x, y);
            vertex(x + res, y);
            vertex(b.x, b.y);
            vertex(d.x, d.y);
            endShape();
            drawLine(b, d);
            break;
          case 13:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(x, y);
            vertex(x + res, y);
            vertex(b.x, b.y);
            vertex(c.x, c.y);
            vertex(x, y + res);
            endShape();
            drawLine(b, c);
            break;
          case 14:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(x, y);
            vertex(x + res, y);
            vertex(x + res, y + res);
            vertex(c.x, c.y);
            vertex(d.x, d.y);
            endShape();
            drawLine(c, d);
            break;
          case 15:
            colorMode(HSB, 100);
            fill(50 - altitude * 5/6, 50 - (altitude * 2) / 3, 10+altitude);
            noStroke();
            beginShape();
            vertex(x, y);
            vertex(x + res, y);
            vertex(x + res, y + res);
            vertex(x, y + res);
            endShape();
            break;
        }
      }
    }
  }
}
function getState(f0, f1, f2, f3) {
  return (
    (f0 > 0 ? 8 : 0) + (f1 > 0 ? 4 : 0) + (f2 > 0 ? 2 : 0) + (f3 > 0 ? 1 : 0)
  );
}
function drawLine(v1, v2) {
  colorMode(RGB);
  stroke(200 - 2 * altitude, 150);
  strokeWeight(0.2);
  noFill();
  // line(v1.x, v1.y, v2.x, v2.y);
}

function contourColorSetting() {}
