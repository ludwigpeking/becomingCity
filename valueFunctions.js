function terrainDefense() {
  let to = color(255, 0, 0, 255);
  let from = color(255, 255, 0, 0);
  colorMode(RGB); // Try changing to HSB.
  let interA = lerpColor(from, to, 0.33);
  let interB = lerpColor(from, to, 0.66);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].defense > 0) {
        noStroke();
        colorMode(RGB);
        let fillColor = lerpColor(from, to, grid[i][j].defense / 1200);
        fill(fillColor);
        rectMode(CENTER);
        rect(grid[i][j].x, grid[i][j].y, res, res);
        fill(0);
        textSize(res * 0.8);
        text(
          round(grid[i][j].defense / 100),
          grid[i][j].x + res / 3,
          grid[i][j].y + res / 3
        );
      }
    }
  }
}

function waterValue() {
  for (let water of waters) {
    for (
      let u = water.i - waterAccessDist;
      u < water.i + waterAccessDist;
      u++
    ) {
      for (
        let v = water.j - waterAccessDist;
        v < water.j + waterAccessDist;
        v++
      ) {
        if (u >= 0 && u < cols && v >= 0 && v < rows) {
          if (
            grid[u][v].altitude < highlandLevel &&
            grid[u][v].water == false &&
            dist(water.i, water.j, grid[u][v].i, grid[u][v].j) < waterAccessDist
          ) {
            grid[u][v].waterAccess = true;
            if (!wateredArea.includes(grid[u][v])) {
              wateredArea.push(grid[u][v]);
            }
          }
        }
      }
    }
  }
}

function waterValueShow() {
  for (let area of wateredArea) {
    noStroke();
    colorMode(RGB);
    fill(0, 0, 255, 50);
    rect(area.x, area.y, res, res);
  }
}

//farm value initiates, farmValue is from the amount of farms available around
function farmValue() {
  for (let tile of tiles) {
    tile.farmValue = 0;
  }
  for (let farm of farms) {
    for (let u = farm.i - farmerRange; u < farm.i + farmerRange; u++) {
      for (let v = farm.j - farmerRange; v < farm.j + farmerRange; v++) {
        if (u >= 0 && u < cols + 1 && v >= 0 && v < rows + 1) {
          if (
            grid[u][v].wall == false &&
            grid[u][v].water == false &&
            dist(farm.i, farm.j, grid[u][v].i, grid[u][v].j) < farmerRange
          ) {
            grid[u][v].farmValue += 1 / (farm.farmerNr + 1);
            if (farm.waterAccess == true) {
              grid[u][v].farmValue += 1 / (farm.farmerNr + 1);
            }
          }
        }
      }
    }
  }
  for (let habit of habitable) {
    habit.farmerValue = (habit.farmValue / 20) * sqrt(habit.security); //farmer's preference
  }
}

function farmValueShow() {
  colorMode(HSB);
  for (let lot of habitable) {
    fill(100 - lot.farmValue * 0.1, 100, 100);
    //fill( lot.farmValue, 255 - lot.farmValue, 0);
    noStroke();
    rect(lot.x, lot.y, res, res);
    fill(0);
    textSize(8);
    text(round(lot.farmValue / 15), lot.x + res / 3, lot.y + res / 3);
  }
  colorMode(RGB);
}

function farmerValueShow() {
  colorMode(HSB);
  for (let lot of habitable) {
    fill(sqrt(lot.farmerValue) * 3, 100, 100);
    //fill( lot.farmValue, 255 - lot.farmValue, 0);
    noStroke();
    rectMode(CENTER);
    rect(lot.x, lot.y, res, res);
    fill(0);
    textSize(8);
    text(round(sqrt(lot.farmerValue)) * 3, lot.x + res / 3, lot.y + res / 3);
  }
  colorMode(RGB);
}

function securityValueShow() {
  for (let habit of habitable) {
    noStroke();
    colorMode(RGB);
    rectMode(CENTER);
    fill(255, 200, 0, habit.security * 50);
    rect(habit.x, habit.y, res, res);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(8);
    text(round(habit.security), habit.x, habit.y);
  }
}

function merchantValue() {
  for (let tile of tiles) {
    tile.merchantValue = tile.security * tile.trafficValue;
  }
}

function newcomerValue() {
  for (let tile of tiles) {
    tile.merchantValue = tile.security * tile.trafficValue;
  }
}

function merchantValueShow() {
  for (let habit of habitable) {
    habit.merchantValue = habit.security * habit.trafficValue;
  }
}
