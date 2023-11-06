const waterAccessDist = 7;
let route = []; // is the in progress path finding route.
let roads = []; // is the global array for road pixels.
let waters = [];
let wateredArea = [];
let farms = [];
let habitable = [];
let tilesCentralHabitable = [];
let mapEdge = [];
let edges = []; //voronoi edges
let grid = [];
let tiles = [];
let tilesCentral = [];

class Tile {
  constructor(i, j, attrition) {
    this.i = i;
    this.j = j;
    this.x = i * res;
    this.y = j * res;
    this.altitude = 0; //perlin noise
    this.neighbors = [];

    //from pathfinding
    this.from = null;
    this.g = 99999;
    this.h = 0;
    this.attrition = attrition; //cost factor for making path, reduced when
    this.f = 99999;
    this.path = false; // used by path
    this.wall = false; // inaccessible terrain
    this.road = false; //roadwayrized when traffic hits certain value
    this.traffic = 0;
    this.trafficValue = 0;
    this.rotate = null;

    //ownership
    this.defense = 0; //topo higher
    this.security = 1; //from lord and neighbor

    // Neighbors

    this.castled = false;
    this.belong = null; //claimed by
    this.allDist = []; //distance to houses to determin

    this.occupied = false; // if occupied by building: lord, farmer[] or merchant[]
    this.occupiedBy = null; //should be a building object
    this.claimed = {}; // to be clarify
    this.buffer = false;
    this.habitable = true;

    this.water = false;
    this.waterEdge = false;
    this.waterEdgeSecond = false;
    this.waterAccess = false;
    this.waterValue = 0; // not yet used

    this.farm = false;
    this.farmValue = 0; //available farms in range
    this.farmValueDiv = 0; //available farms divided by farmer population
    this.farmerNr = 0; //farmer population in range
    this.farmerValue = this.security + this.farmValue;

    this.merchantValue = this.security * this.traffic;
  }

  show() {
    noStroke();
    // fill(180, 180, 170, 150);
    fill(180, 0, 0, 150);
    rect(this.x, this.y, res, res);

    // if ((this.y % 20 == 0) & (this.x % 5 == 0)) {
    //   // fill(0);
    //   // noStroke();
    //   // text(this.attrition, this.x, this.y);
    // }
  }
}

function tiling() {
  noiseSeed(seed);
  colorMode(RGB)
  for (let i = 0; i < cols + 1; i++) {
    grid.push([]);
    for (let j = 0; j < rows + 1; j++) {
      grid[i][j] = new Tile(i, j, 1);
      tiles.push(grid[i][j]);
      if (
        i > cols / 4 &&
        i < (cols * 3) / 4 &&
        j > rows / 4 &&
        j < (rows * 3) / 4
      ) {
        tilesCentral.push(grid[i][j]);
      }
      // 3 octave frequency perlin noise
      grid[i][j].altitude = round(
        40 * noise(noiseScale * grid[i][j].x, noiseScale * grid[i][j].y) +
          60 *
            noise(
              0.3 * noiseScale * grid[i][j].x,
              0.3 * noiseScale * grid[i][j].y
            ) +
          150 *
            (noise(
              0.1 * noiseScale * grid[i][j].x,
              0.1 * noiseScale * grid[i][j].y
            ) -
              0.6)
      );
      // grid[i][j].altitude = round(
      //   100*noise(0.01*noiseScale * grid[i][j].x, 0.01*noiseScale * grid[i][j].y)
      // );
      if (grid[i][j].altitude <= waterLevel) {
        grid[i][j].attrition = 1;
        grid[i][j].water = true;
        grid[i][j].altitude = -14
        waters.push(grid[i][j]);
        noStroke();
        fill(100, 200, 255);
        // rect(grid[i][j].x, grid[i][j].y, res, res);
      } else if (grid[i][j].altitude > highlandLevel) {
        //grid[i][j].wall = true;
        noStroke();
        fill(200);
        // rect(grid[i][j].x, grid[i][j].y, res, res);
      } else if (
        grid[i][j].altitude > farmMin &&
        grid[i][j].altitude <= farmMax
      ) {
        grid[i][j].farm = true;
        farms.push(grid[i][j]);
        noStroke();
        fill(0, 100, 20);
        // rect(grid[i][j].x, grid[i][j].y, res, res);
        habitable.push(grid[i][j]);
      } else {
        noStroke();
        fill(100, 150, 70);
        // rect(grid[i][j].x, grid[i][j].y, res, res);
        habitable.push(grid[i][j]);
      }
    }
  }
  tilesCentralHabitable = tilesCentral.filter((value) =>
    habitable.includes(value)
  );
  waterValue();
  farmValue();

  //farm value initiates, farmValue is from the amount of farms available around
  for (let farm of farms) {
    for (let u = farm.i - farmerRange; u < farm.i + farmerRange; u++) {
      for (let v = farm.j - farmerRange; v < farm.j + farmerRange; v++) {
        if (u >= 0 && u < cols && v >= 0 && v < rows) {
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

  addNeighbors();
  contour();
  //defense value initiates, waterAccess is required
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].waterAccess == false || grid[i][j].water == true) {
        grid[i][j].defense = 0;
      } else {
        let altitudeChange = 0;
        for (let neighbor of grid[i][j].neighbors) {
          for (let subNeighbor of neighbor.neighbors){
            altitudeChange += grid[i][j].altitude - subNeighbor.altitude;
          }
        }
        grid[i][j].defense = altitudeChange;
      }
    }
  }
  mapEdgeDefine();
}

function addNeighbors() {
  for (var i = 0; i < cols+1; i++) {
    for (var j = 0; j < rows+1; j++) {
      if (i < cols ) {
        grid[i][j].neighbors.push(grid[i + 1][j]);
      }
      if (i > 0) {
        grid[i][j].neighbors.push(grid[i - 1][j]);
      }
      if (j < rows ) {
        grid[i][j].neighbors.push(grid[i][j + 1]);
      }
      if (j > 0) {
        grid[i][j].neighbors.push(grid[i][j - 1]);
      }
      if (i > 0 && j > 0) {
        grid[i][j].neighbors.push(grid[i - 1][j - 1]);
      }
      if (i < cols  && j > 0) {
        grid[i][j].neighbors.push(grid[i + 1][j - 1]);
      }
      if (i > 0 && j < rows ) {
        grid[i][j].neighbors.push(grid[i - 1][j + 1]);
      }
      if (i < cols && j < rows ) {
        grid[i][j].neighbors.push(grid[i + 1][j + 1]);
      }
    }
  }
}

function mapEdgeDefine() {
  for (let tile of tiles) {
    if (
      tile.i == 0 ||
      tile.i == cols  ||
      tile.j == 0 ||
      tile.j == rows 
    ) {
      mapEdge.push(tile);
      // fill(255,0,0)
      // rect(tile.x,tile.y, res,res)
    }
  }
}

function showWater() {
  for (let water of waters) {
    fill(140, 180, 250);
    noStroke();
    rect(water.x, water.y, res, res);
  }
}
