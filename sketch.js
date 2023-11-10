// by Qian Li. ludwig.peking@gmail.com
// TODO: minimum distance between huts, security cast from castle and huts

const cols = 80;
const rows = 45;
const res = 12;
let seed = 8; //random seed

const farmerRange = 10;
const weightFactor = 0.5;
const claimRange = 20;
const noiseScale = 0.05;
const waterLevel = 0;
const farmMin = 0; // altitude of farm
const farmMax = 30;
const highlandLevel = 50;
let start, end, castlePos;
let farmerPos = [],
  merPos = [];

function mousePressed() {
  if (!(mouseX < 0 || mouseY < 0 || mouseX >= width || mouseY >= height)) {
    let x = floor(mouseX / res);
    let y = floor(mouseY / res);
    let newFarm = new Farmer(x, y, 1);
  }
}

function setup() {
  coverPage();
  setupButtons();
  setupInputs();
  // line 0 input
}

function reload() {
  randomSeed(seed);
  clearMap();

  minBuffer = 5;
  castes = ["Lord", "Farmer", "Merchant"];
  pg = createGraphics(cols * res, rows * res, P2D); //layer not yet used
  treeLayer = createGraphics(cols * res, rows * res, P2D);
  // camp = loadImage("camp.png");
  tiling();

  tradeRoute();
  colorMode(RGB);
  noStroke();
  fill(150);
  textSize(res * 1.2);
  textAlign(RIGHT);
  text(
    "11/2022, by Qian Li, ludwig.peking@gmail.com, ",
    width - 80,
    height - 10
  );
  fill(255, 10, 200);
  text(" with: p5*js", width - 10, height - 10);
  fill(200);
  textSize(res * 2);
  text(
    "banalSmasher.GENESIS[1].becomingCity.Seed[" + seed + "]",
    width - 10,
    height - 30
  );
  loadPixels();
}

function draw() {
  // noLoop()
  // showWater();
  for (var hut of huts) {
    // hut.shadow();
    hut.show();
  }
  // for (let habit of habitable) {
  //   fill(0);
  //   rect(habit.x, habit.y, res, res);
  // }
  // for (let tile of tiles) {
  //   noFill();
  //   stroke(0);
  //   strokeWeight(0.01);
  //   rect(tile.x, tile.y, res, res);
  // }
}

function clearMap() {
  route = []; // is the in progress path finding route.
  roads = []; // is the global array for road pixels.
  waters = [];
  wateredArea = [];
  farms = [];
  habitable = [];
  tilesCentralHabitable = [];
  mapEdge = [];
  edges = []; //voronoi edges
  grid = [];
  tiles = [];
  tilesCentral = [];
  huts = [];
  nr = 0;
  castleTiles = [];
  downhillFactor = 0.2;
  flatTerrainCost = 2;
  routes = [];
  routesNr = 0;
  routesFront = []; //array of routefront arrays
  routeTile = []; //road tiles
  shopfronts = []; // shopfront tiles
}
function autoStep() {
  console.log(steps);
  steps = int(this.value());
}
function setSeed() {
  seed = int(this.value());
}

function saveImg() {
  saveCanvas("Town Generation Value Grid", "jpg");
}

function tileReset() {
  for (let i = 0; i < cols + 1; i++) {
    for (let j = 0; j < rows + 1; j++) {
      grid[i][j].f = 0;
      grid[i][j].g = 99999;
      grid[i][j].h = 0;
      grid[i][j].from = null;
      // grid[i][j].neighbors = [];
    }
  }
}
