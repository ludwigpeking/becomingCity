function aTree(i, j) {
  const r = random(res / 4, res / 2);
  noStroke();
  // fill(0, 100);
  // circle(i * res + 2, j * res - 2, 2 * r + 2);
  fill(100 + random(30), 150 + random(60), 80 + random(20));
  push();
  translate(i * res +random(res)-res/2, j * res+random(res)-res/2);
  // translate(i*res,j*res)
  rotate(random(PI));
  beginShape();
  var xoff = 0,
    yoff = 0;
  for (var a = 0; a < 2 * PI; a += PI / 12) {
    curveVertex(
      r * sin(a) * (1 + 0.5 * noise(xoff)),
      r * cos(a) * (1 + 0.5 * noise(yoff))
    );
    xoff += 1;
    yoff += 1;
  }
  endShape(CLOSE);
  pop();
}

function trees() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      if (!grid[i][j].occupied && random(grid[i][j].altitude) > random(10)) {
        aTree(i, j);
      }

      if (
        !grid[i][j].road &&
        grid[i][j].occupied &&
        grid[i][j].belong != null &&
        dist(i, j, grid[i][j].belong.x, grid[i][j].belong.y) < res * 4 &&
        dist(i, j, grid[i][j].belong.x, grid[i][j].belong.y) > res &&
        0.1 > random()
      ) {
        aTree(grid[i][j].belong.x, grid[i][j].belong.y);
      }
    }
  }
}

function fieldPattern() {
  for (let f = 3; f < huts.length; f++) {
    for (let spot of huts[f].control) {
    }
  }
}
