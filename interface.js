let gridSpacingX = 130;
let gridSpacingY = 50;
// This is the space between grid cells
let gridOrigin = { x: 5, y: rows * res }; // Starting point of the grid on the canvas

function redrawMap() {
  updatePixels();
}

function imageCache() {
  loadPixels();
}

const inputs = [
  {
    label: "Random Seed (int):",
    col: 0,
    row: 0,
    callback: setSeed,
    default: 8,
  },
  { label: "steps (int):", col: 3, row: 0, callback: autoStep, default: 150 },
];

let steps = inputs[1].default;

const buttons = [
  { label: "GO! (START!)", col: 2, row: 0, callback: reload },
  {
    label: "AUTO - wait for proceeding",
    col: 5,
    row: 0,
    callback: autoPopulate,
  },
  { label: "Save Canvas", col: 0, row: 1, callback: saveImg },

  { label: "Water Value", col: 0, row: 3, callback: waterValueShow },
  { label: "Farm Value", col: 1, row: 3, callback: farmValueShow },
  { label: "Trade Route", col: 2, row: 3, callback: tradeRoute },
  { label: "Terrain Defense Value", col: 3, row: 3, callback: terrainDefense },
  { label: "Security Value", col: 4, row: 3, callback: securityValueShow },
  { label: "Traffic Value", col: 5, row: 3, callback: trafficValueShow },
  { label: "Farmer Value", col: 6, row: 3, callback: farmerValueShow },

  { label: "New Lord", col: 0, row: 2, callback: lord },
  { label: "New Farmer", col: 1, row: 2, callback: farmerPopulate },
  { label: "New Merchant", col: 2, row: 2, callback: merchantPopulate },
  // { label: "Newcomer", col: 3, row: 3, callback: newcomerPopulate },
  { label: "voronoize", col: 0, row: 4, callback: voronoize },

  { label: "Redraw roads", col: 1, row: 5, callback: drawRoutes },
  { label: "trees", col: 1, row: 4, callback: trees },
  { label: "walls", col: 2, row: 4, callback: walls },

  { label: "Redraw Map", col: 0, row: 5, callback: redrawMap },
  { label: "Recover Contour", col: 2, row: 5, callback: contour },
  { label: "Map Cache", col: 3, row: 5, callback: imageCache },

  { label: "road traffic", col: 4, row: 5, callback: roadTraffic },
];

// A function to calculate the position based on grid coordinates
function gridPosition(col, row) {
  return {
    x: gridOrigin.x + col * gridSpacingX,
    y: gridOrigin.y + row * gridSpacingY,
  };
}

function setupProgressBar() {
  let autoButtonPos = gridPosition(4, 0); // Position of the AUTO button
  let progressBar = createDiv("");
  progressBar.id("progress-bar");
  progressBar.style("width", "0%");
  progressBar.style("height", "20px");
  progressBar.style("background-color", "pink").style("border", "1px solid");
  progressBar.position(autoButtonPos.x, autoButtonPos.y + gridSpacingY); // Position below the button
}

function createGridButton(buttonConfig) {
  let pos = gridPosition(buttonConfig.col, buttonConfig.row);
  let btn = createButton(buttonConfig.label);
  if (buttonConfig.label == "GO! (START!)") {
    btn.style("color", "magenta").style("font-weight", "bold");
  }
  if (buttonConfig.label == "AUTO - wait for proceeding") {
    btn.style("font-weight", "bold");
  }
  btn.position(pos.x, pos.y);
  btn.mousePressed(buttonConfig.callback);

  return btn;
}

function setupButtons() {
  // Create buttons using the button configurations
  buttons.forEach(createGridButton);
}

function createGridInput(inputConfig) {
  let pos = gridPosition(inputConfig.col, inputConfig.row);
  let inputText = createP(inputConfig.label);
  inputText.style("font-size", "14px");
  inputText.position(pos.x, pos.y);
  let inp = createInput("120");
  inp.value(inputConfig.default);
  inp.position(pos.x + 130, pos.y + 15);
  inp.size(30);
  inp.input(inputConfig.callback);
  return inp;
}

function setupInputs() {
  // Create inputs using the input configurations
  inputs.forEach(createGridInput);
}

function coverPage() {
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
}
