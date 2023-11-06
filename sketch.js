// by Qian Li. ludwig.peking@gmail.com
// TODO: minimum distance between huts, security cast from castle and huts

const cols = 80;
const rows = 45;
const res = 12;
let seed = 8; //random seed
let steps = 100

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
  // if (!(mouseX < 0 || mouseY < 0 || mouseX >= width || mouseY >= height)) {
  //   let newHut = new Hut(round(mouseX / res), round(mouseY / res), nr);
  //   huts.push(newHut);
  //   grid[round(mouseX / res)][round(mouseY / res)].castled = true;
  //   if (nr != 1 && nr != 2) {
  //     realHuts.push(newHut);
  //   }
  //   console.log(newHut);
  //   nr++;
  // }
}

function setup() {
  createCanvas(cols * res, rows * res, P2D);
  
  textLayer = createGraphics(cols * res, rows * res, P2D);

  pixelDensity(1);
  colorMode(RGB);
  background(50);
  noStroke();
  fill(180);
  textSize(48);
  textAlign(CENTER);
  text("GENESIS[1].becomingCity", width / 2, height / 2);
  fill(150);
  textSize(14);
  text(
    "11/2022, by Qian Li, ludwig.peking@gmail.com, ",
    width / 2 - 50,
    height / 2 + 36
  );
  fill(255, 10, 200);
  text(" with: p5*js", width / 2 + 150, height / 2 + 36);
  fill(120);
  textSize(24);
  text(
    'Below, input random seed and click on "GO!"',
    width / 2,
    height / 2 + 72
  );

  

  // line 0 input

  let inputText = createP("Random Seed (int):");
  inputText.style("font-size", "14px");
  inputText.position(0, height - 5);
  let inp = createInput("120");
  inp.position(130, height + 10);
  inp.size(30);
  inp.input(setSeed);
  button10 = createButton("GO!");
  button10.position(170, height + 10);
  button10.mousePressed(reload);
  
  let inp2 = createInput("100");
  inp2.position(240, height + 10);
  inp2.size(50);
  inp2.input(autoStep);
  button01 = createButton("AUTO - wait for proceeding");
  button01.position(300, height + 10);
  button01.mousePressed(autoPopulate);
  


  // line 1 file and image operations
  button11 = createButton("save canvas");
  button11.position(0, height + 35);
  button11.mousePressed(saveImg);
  button12 = createButton("redraw Map");
  button12.position(100, height + 35);
  button12.mousePressed(updatePixels);
  button13 = createButton("contour");
  button13.position(200, height + 35);
  button13.mousePressed(contour);
  button14 = createButton("image cache");
  button14.position(270, height + 35);
  button14.mousePressed(loadPixels);
  button15 = createButton("clear map");
  button15.position(370, height + 35);
  button15.mousePressed(clearMap);

  // line 2 valuate operations
  button20 = createButton("water Value");
  button20.position(0, height + 60);
  button20.mousePressed(waterValueShow);
  button21 = createButton("farm Value");
  button21.position(90, height + 60);
  button21.mousePressed(farmValueShow);
  button22 = createButton("trade route");
  button22.position(180, height + 60);
  button22.mousePressed(tradeRoute);
  button23 = createButton("terrain defense");
  button23.position(270, height + 60);
  button23.mousePressed(terrainDefense);
  button24 = createButton("Security Value");
  button24.position(390, height + 60);
  button24.mousePressed(securityValueShow);
  button25 = createButton("Traffic Value");
  button25.position(500, height + 60);
  button25.mousePressed(trafficValueShow);
  button26 = createButton("farmer Value");
  button26.position(600, height + 60);
  button26.mousePressed(farmerValueShow);

  //line 3 populate castes
  let addPopulation = createP("add population:");
  addPopulation.style("font-size", "14px");
  addPopulation.position(0, height + 70);
  button31 = createButton("Lord");
  button31.position(115, height + 85);
  button31.mousePressed(lord);
  button32 = createButton("Farmer");
  button32.position(160, height + 85);
  button32.mousePressed(farmerPopulate);
  button33 = createButton("Merchant");
  button33.position(220, height + 85);
  button33.mousePressed(merchantPopulate);
  button34 = createButton("Newcomer");
  button34.position(300, height + 85);
  button34.mousePressed(newcomerPopulate);

  //line 4 road and claim operation
  button40 = createButton("voronoize");
  button40.position(0, height + 110);
  button40.mousePressed(voronoize);
  button41 = createButton("pathFinding");
  button41.position(80, height + 110);
  button41.mousePressed(pathFinding);
  button42 = createButton("road rraffic");
  button42.position(170, height + 110);
  button42.mousePressed(roadTraffic);
  button43 = createButton("redraw roads");
  button43.position(170, height + 110);
  button43.mousePressed(drawRoutes);

  //line 5 entourage
  button50 = createButton("trees");
  button50.position(0, height + 135);
  button50.mousePressed(trees);
  button52 = createButton("walls");
  button52.position(60, height + 135);
  button52.mousePressed(walls);
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
  text("banalSmasher.GENESIS[1].becomingCity.Seed["+ seed +"]"  , width - 10, height - 30);
  loadPixels();
}

function draw() {
  // noLoop()
  // showWater();

  for (var hut of huts) {
    // hut.shadow();
    hut.show();
  }
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
function autoStep(){
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
      grid[i][j].neighbors = [];
    }
  }
}
