// TODO: minimal buffer distance between huts, security cast from castle and huts
// TODO: extents Hut class, community
// TODO:

let huts = [];
let nr = 0;
let castleTiles = [];

let minBuffer = 5;
let castes = ["Lord", "Farmer", "Merchant"];

//value system
// Lord : defense(from terrain); may consider traffic
// Farmer : security, farm value
// merchant : security, traffic

function autoPopulate(i = 0) {
  if (i === 0) {
    lord(); // Call lord() only at the beginning
  }

  if (i < steps) {
    let dice = random(1);
    if (dice < 0.4) {
      merchantPopulate();
    } else {
      farmerPopulate();
    }
    updateProgressBar(((i + 1) / steps) * 100);

    // Schedule the next iteration
    setTimeout(() => autoPopulate(i + 1), 0);
  }
}

function updateProgressBar(percent) {
  let progressBar = select("#progress-bar");
  progressBar.style("width", percent / 3 + "%");

  // Update the text inside the progress bar
  progressBar.html(Math.round(percent) + "%");
}

function lord() {
  let newCastle = new Lord();
  huts.push(newCastle);
  nr++;
  newCastle.makeBuffer();
  farmValue();
}

class Lord {
  constructor() {
    this.buffer = 2;
    this.trafficWeight = 3;

    // the tile with highest 'defense'from terrain is selected as castle position
    tilesCentralHabitable.sort((a, b) => (a.defense < b.defense ? 1 : -1));
    castlePos = tilesCentralHabitable[0];
    this.i = castlePos.i;
    this.j = castlePos.j;
    this.x = this.i * res;
    this.y = this.j * res;
    castleTiles.push(castlePos);
    this.color = color(255);

    pathFinding(grid[this.i][this.j], start, this.trafficWeight);
    pathFinding(grid[this.i][this.j], end, this.trafficWeight);
    castlePos.attrition = 500;
    castlePos.occupied = true;
    castlePos.occupiedBy = this;

    habitable = habitable.filter((item) => item !== castlePos);
    tilesCentralHabitable = tilesCentralHabitable.filter(
      (item) => item !== castlePos
    );
    for (let neighbor of castlePos.neighbors) {
      neighbor.occupied = true;
    }
    // grid[this.i][this.j].wall = true;

    this.weight = 1;
    this.nr = nr; //not necessary
    this.control = []; //not clarified

    //caste security to the realm
    for (let habit of habitable) {
      // habit.security +=
      //   5 +
      //   log(1 / ((habit.i - castlePos.i) ** 2 + (habit.j - castlePos.j) ** 2)) /
      //     log(10);
      habit.security +=
        100 / dist(habit.i, habit.j, castlePos.i, castlePos.j) ** 2;
    }
  }
  makeBuffer() {
    //farm value initiates

    for (let u = this.i - this.buffer; u < this.i + this.buffer; u++) {
      for (let v = this.j - this.buffer; v < this.j + this.buffer; v++) {
        if (
          u >= 0 &&
          u < cols &&
          v >= 0 &&
          v < rows &&
          dist(this.i, this.j, u, v) <= this.buffer
        ) {
          grid[u][v].buffer = true;
          grid[u][v].habitable = false;

          habitable = habitable.filter((item) => item !== grid[u][v]);
          tilesCentralHabitable = tilesCentralHabitable.filter(
            (item) => item !== grid[u][v]
          );
        }
      }
    }
  }
  show() {
    colorMode(RGB);
    strokeWeight(0.5);
    stroke(0);
    rectMode(CENTER);
    fill(this.color);
    rect(this.x, this.y, res * 2, res * 2);
    circle(this.x, this.y, res * 1.5);
    circle(this.x - res, this.y - res, res);
    circle(this.x + res, this.y + res, res);
    circle(this.x + res, this.y - res, res);
    circle(this.x - res, this.y + res, res);
    // rectMode(CORNER);
  }
  shadow() {
    colorMode(RGB);
    strokeWeight(0.5);
    stroke(0);
    rectMode(CENTER);
    fill(50);
    rect(this.x + 3, this.y - 3, res * 2, res * 2);

    // rectMode(CORNER);
  }
}

function farmerPopulate() {
  let newCastle = new Farmer();
  huts.push(newCastle);
  nr++;
  newCastle.makeBuffer();
  farmValue();
}

class Farmer {
  constructor() {
    this.buffer = 1;
    this.trafficWeight = 1;

    // the tile with highest 'defense'from terrain is selected as castle position
    habitable.sort((a, b) => (a.farmerValue < b.farmerValue ? 1 : -1));
    castlePos = habitable[0];
    this.i = castlePos.i;
    this.j = castlePos.j;
    this.x = this.i * res;
    this.y = this.j * res;
    this.R = 120 + random(50);
    this.G = 120 + random(50);
    this.B = 50 + random(50);
    this.color = color(120 + random(50), 120 + random(50), 50 + random(50));
    this.treeColor = color(
      20 + random(100),
      120 + random(100),
      20 + random(100)
    );
    this.treeSize = random(0.5, 1);
    grid[this.i][this.j].wall = true;

    // pathFinding(grid[this.i][this.j], start, this.trafficWeight);
    // pathFinding(grid[this.i][this.j], end, this.trafficWeight);
    if (castleTiles[0]) {
      pathFinding(castlePos, castleTiles[0], this.trafficWeight * 2);
    } else {
      pathFinding(castlePos, start, this.trafficWeight);
      pathFinding(castlePos, end, this.trafficWeight);
    }
    castlePos.attrition = 500;
    castlePos.wall = true;
    castlePos.occupied = true;
    castlePos.occupiedBy = this;
    habitable = habitable.filter((item) => item !== castlePos);
    tilesCentralHabitable = tilesCentralHabitable.filter(
      (item) => item !== castlePos
    );
    for (let neighbor of castlePos.neighbors) {
      neighbor.occupied = true;
    }

    this.weight = 1;
    this.nr = nr; //not necessary
    this.control = []; //voronoi claimed tiles
    // the farmer will increase the farmerNr of the tiles in farmerRange
    for (
      let u = castlePos.i - farmerRange;
      u < castlePos.i + farmerRange;
      u++
    ) {
      for (
        let v = castlePos.j - farmerRange;
        v < castlePos.j + farmerRange;
        v++
      ) {
        if (u >= 0 && u < cols && v >= 0 && v < rows) {
          if (
            dist(castlePos.i, castlePos.j, grid[u][v].i, grid[u][v].j) <=
            farmerRange
          ) {
            grid[u][v].farmerNr++;

            grid[u][v].security +=
              5 /
              dist(grid[u][v].i, grid[u][v].j, castlePos.i, castlePos.j) ** 2;
          }
        }
      }
    }
  }
  makeBuffer() {
    for (
      let u = this.i - round(this.buffer);
      u < this.i + round(this.buffer);
      u++
    ) {
      for (
        let v = this.j - round(this.buffer);
        v < this.j + round(this.buffer);
        v++
      ) {
        if (
          u >= 0 &&
          u < cols &&
          v >= 0 &&
          v < rows &&
          dist(this.i, this.j, u, v) < this.buffer
        ) {
          grid[u][v].buffer = true;
          grid[u][v].habitable = false;

          habitable = habitable.filter((item) => item !== grid[u][v]);
          tilesCentralHabitable = tilesCentralHabitable.filter(
            (item) => item !== grid[u][v]
          );
        }
      }
    }
  }
  show() {
    colorMode(RGB);
    push();
    translate(this.x + res / 8, this.y - res / 8);
    if (grid[this.i][this.j].rotate) {
      rotate(grid[this.i][this.j].rotate);
    }
    fill(0);
    rect(0, 0, grid[this.i][this.j].farmerValue ** 0.35 * 3, res * 0.8);
    circle(0, (this.treeSize * res) / 2, this.treeSize * res);
    pop();
    strokeWeight(0.5);
    stroke(0);
    noStroke();

    fill(this.R + 120, this.G + 110, this.B + 110);

    push();
    translate(this.x, this.y);
    if (grid[this.i][this.j].rotate) {
      rotate(grid[this.i][this.j].rotate);
    }

    rectMode(CENTER);
    // rect(0, 0, res * 0.8, res * 0.8);
    rect(0, 0, grid[this.i][this.j].farmerValue ** 0.35 * 3, res * 0.8);
    fill(this.treeColor);
    noStroke();
    circle(0, (this.treeSize * res) / 2, this.treeSize * res);
    pop();
  }
  shadow() {
    colorMode(RGB);
    noStroke();
    fill(30);
    ellipse(this.x + 2, this.y - 2, 1.1 * res, 1.1 * res);
  }
}
function merchantPopulate() {
  merchantValue();
  let newCastle = new Merchant();
  huts.push(newCastle);
  nr++;
  newCastle.makeBuffer();
}
class Merchant {
  constructor() {
    this.buffer = 0;
    this.trafficWeight = 3;
    habitable.sort((a, b) => (a.merchantValue < b.merchantValue ? 1 : -1));
    castlePos = habitable[0];
    this.i = castlePos.i;
    this.j = castlePos.j;
    this.x = this.i * res;
    this.y = this.j * res;
    this.color = color(220 + random(70), 130 + random(70), 50 + random(50));

    pathFinding(grid[this.i][this.j], start, this.trafficWeight);
    pathFinding(grid[this.i][this.j], end, this.trafficWeight);
    if (castleTiles[0])
      pathFinding(grid[this.i][this.j], castleTiles[0], this.trafficWeight * 2);
    castlePos.attrition = 500;
    castlePos.occupied = true;
    castlePos.wall = true;
    castlePos.occupiedBy = this;
    habitable = habitable.filter((item) => item !== castlePos);
    tilesCentralHabitable = tilesCentralHabitable.filter(
      (item) => item !== castlePos
    );

    for (let neighbor of castlePos.neighbors) {
      neighbor.occupied = true;
    }

    this.weight = 1;
    this.nr = nr; //not necessary
    this.control = []; //not clarified
    // it will increase security value of the tiles in Range(use farmer Range for a while)
    for (
      let u = castlePos.i - farmerRange;
      u < castlePos.i + farmerRange;
      u++
    ) {
      for (
        let v = castlePos.j - farmerRange;
        v < castlePos.j + farmerRange;
        v++
      ) {
        if (u >= 0 && u < cols && v >= 0 && v < rows) {
          if (
            dist(castlePos.i, castlePos.j, grid[u][v].i, grid[u][v].j) <=
            farmerRange
          ) {
            // grid[u][v].security += 1;
            grid[u][v].security +=
              5 /
              dist(grid[u][v].i, grid[u][v].j, castlePos.i, castlePos.j) ** 2;
          }
        }
      }
    }
  }
  makeBuffer() {
    for (let u = this.i - this.buffer; u < this.i + this.buffer; u++) {
      for (let v = this.j - this.buffer; v < this.j + this.buffer; v++) {
        if (
          u >= 0 &&
          u < cols + 1 &&
          v >= 0 &&
          v < rows + 1 &&
          dist(this.i, this.j, u, v) <= this.buffer
        ) {
          grid[u][v].buffer = true;
          grid[u][v].habitable = false;

          habitable = habitable.filter((item) => item !== grid[u][v]);
          tilesCentralHabitable = tilesCentralHabitable.filter(
            (item) => item !== grid[u][v]
          );
        }
      }
    }
  }
  show() {
    colorMode(RGB);
    strokeWeight(0.5);
    stroke(0);
    noStroke();
    let diameter = grid[this.i][this.j].trafficValue ** 0.4;
    push();
    translate(this.x + res / 8, this.y - res / 8);
    if (grid[this.i][this.j].rotate) {
      rotate(grid[this.i][this.j].rotate);
    }
    fill(0);
    rect(0, 0, diameter, diameter * 0.8);
    pop();

    fill(this.color);
    push();
    translate(this.x, this.y);
    if (grid[this.i][this.j].rotate) {
      rotate(grid[this.i][this.j].rotate);
    }

    rectMode(CENTER);
    // rect(0, 0, res * 0.8, res * 0.8);
    rect(0, 0, diameter, diameter * 0.8);

    // rectMode(CORNER);
    pop();
  }
  shadow() {
    colorMode(RGB);
    noStroke();
    stroke(0);

    push();
    translate(this.x + 2, this.y - 2);
    if (grid[this.i][this.j].rotate) {
      rotate(grid[this.i][this.j].rotate);
    }

    rectMode(CENTER);
    fill(30);
    rect(0, 0, res * 0.6, res * 0.8);
    fill(30);
    // rectMode(CORNER);
    pop();
  }
}
function newcomerPopulate() {
  newcomerValue();
  let newCastle = new Newcomer();
  huts.push(newCastle);
  nr++;
  newCastle.makeBuffer();
  newcommerValue();
}
