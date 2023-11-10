var downhillFactor = 0.3;
var flatTerrainCost = 2;
var routes = [];
var routesNr = 0;
var routesFront = []; //array of routefront tiles
let routeTile = []; //road tiles
var shopfronts = []; // shopfront tiles
var waterMoveCost = 100; //test
let moveCost;
//traffic weights settings:
let interRegionalTrafficWeight = 3;

//A* path finding algorithm, between two spots
class Route {
  constructor(start, end, trafficWeight) {
    this.start = start;
    this.end = end;
    this.route = [];
    this.trafficWeight = trafficWeight;
  }
  show() {}
}

function pathFinding(start, end, trafficWeight) {
  //reset grid......
  let closeSet = [];
  tileReset();
  // addNeighbors();

  start.g = 0;
  let openSet = [];
  openSet.push(start);
  let current = start;

  route = [];

  //     //loop.............
  while (current != end) {
    openSet.sort((a, b) => (a.f > b.f ? 1 : -1));
    current = openSet[0];
    openSet.splice(0, 1);
    closeSet.push(current);

    for (let neighbor of current.neighbors) {
      if (
        !closeSet.includes(neighbor) &&
        !neighbor.wall &&
        !isWallInBetween(current, neighbor)
      ) {
        neighbor.h =
          sqrt((neighbor.i - end.i) ** 2 + (neighbor.j - end.j) ** 2) * 3;
        if (
          neighbor.water == true ||
          (isKnightMove(current, neighbor) &&
            waterInBetween(current, neighbor) == true)
        ) {
          moveCost =
            current.g +
            waterMoveCost * dist(neighbor.i, neighbor.j, end.i, end.j);
        } else {
          moveCost =
            current.g +
            neighbor.attrition *
              (max(
                0,
                neighbor.altitude - current.altitude,
                max(0, downhillFactor * (current.altitude - neighbor.altitude))
              ) +
                flatTerrainCost) *
              sqrt(
                (neighbor.i - current.i) ** 2 + (neighbor.j - current.j) ** 2
              );
        }
        if (moveCost < neighbor.g) {
          neighbor.from = current;
          neighbor.g = moveCost;
          neighbor.f = neighbor.g + neighbor.h;
        }

        if (openSet.includes(neighbor) == false) {
          openSet.push(neighbor);
        }
      }
    }
  }

  if (current == end) {
    var previous = end;
    while (previous.from != null) {
      if (isKnightMove(previous, previous.from)) {
        for (let middleTile of middleTilesOfKnightMove(
          previous,
          previous.from
        )) {
          middleTile.occupied = true;
          middleTile.road = true;
          roads.push(middleTile);
          // fill(255, 0, 0);
          // rect(middleTile.x, middleTile.y, res, res);
        }
      }

      route.push(previous);
      previous = previous.from;
      previous.occupied = true;
      previous.road = true;

      roads.push(previous);

      previous.traffic += trafficWeight; //to highway dest

      previous.attrition = round(1 / previous.traffic, 2); //the more the traffic the less the attrition
    }
    route.push(start);
    start.occupied = true;
    start.road = true;
    roads.push(start);

    //remove the trade route from buildable lots
    habitable = habitable.filter(function (el) {
      return !roads.includes(el);
    });
    routes.push(route);
    routesFront.push([]);
    colorMode(RGB);
    beginShape();
    noFill();

    strokeWeight(res / 5);
    stroke(255, trafficWeight * 20);
    // stroke(255,100)
    vertex(route[0].x, route[0].y);
    for (let step = 0; step < route.length; step++) {
      curveVertex(route[step].x, route[step].y);

      routeTile.push(grid[route[step].i][route[step].j]);
      //remove duplicates in routesFront[routeNr] array
      for (let e of route[step].neighbors) {
        if (!routesFront[routesNr].includes(e)) {
          routesFront[routesNr].push(e);
          shopfronts.push(e);
          // vector = p5.Vector(route[step].i - ,)
        }
      }
    }
    vertex(route[route.length - 1].x, route[route.length - 1].y);
    endShape();
    //route neighbor normal generation
    for (let step = 1; step < route.length - 1; step++) {
      let vector = createVector(
        route[step + 1].x - route[step - 1].x,
        route[step + 1].y - route[step - 1].y
      );
      let heading = vector.heading();
      for (let e of route[step].neighbors) {
        if (!e.rotate) {
          e.rotate = heading;
        }
      }
    }

    for (let shopfront of routesFront[routesNr]) {
      shopfront.trafficValue += trafficWeight;
    }
  }
  routesNr++;
}

function trafficValueShow() {
  for (let each of tiles) {
    colorMode(RGB);
    noStroke();
    rectMode(CENTER);
    let a = 3;
    fill(255, 1, 255, 50 * a);
    fill(255, 0, 0, 10 * sqrt(each.trafficValue));
    rect(each.x, each.y, res, res);
    // fill(0);
    // text(round(each.trafficValue), each.x, each.y + res);
  }
}

function tradeRoute() {
  start = random(mapEdge);
  rectMode(CENTER);
  colorMode(RGB);
  fill(255, 255, 0);
  rect(start.x, start.y, res, res);
  end = random(mapEdge);

  while (
    abs(end.i + end.j - start.i - start.j) < rows ||
    end.i == start.i ||
    end.j == start.j
  ) {
    end = random(mapEdge);
    if (
      abs(end.i + end.j - start.i - start.j) >= rows &&
      end.i != start.i &&
      end.j != start.j
    ) {
      break;
    }
  }
  colorMode(RGB);
  fill(255, 200, 0);
  rect(end.x, end.y, res, res);
  pathFinding(start, end, interRegionalTrafficWeight);
}

function roadTraffic() {
  for (let pave of roads) {
    stroke(50 * pave.traffic, 0, 0);
    strokeWeight((round(pave.traffic ** 0.3) * res) / 5);
    point(pave.x, pave.y);
  }
}

function drawRoutes() {
  noFill();
  colorMode(RGB);
  strokeWeight(res / 5);
  stroke(255, 50);

  for (let route of routes) {
    beginShape();
    vertex(route[0].x, route[0].y);
    for (var step = 0; step < route.length; step++) {
      curveVertex(route[step].x, route[step].y);
    }
    vertex(route[route.length - 1].x, route[route.length - 1].y);
    endShape();
  }
}

function isWallInBetween(tile1, tile2) {
  // If it is a knight move
  if (
    (Math.abs(tile1.i - tile2.i) === 2 && Math.abs(tile1.j - tile2.j) === 1) ||
    (Math.abs(tile1.i - tile2.i) === 1 && Math.abs(tile1.j - tile2.j) === 2)
  ) {
    // Check for walls in the middle squares that could block the knight move
    const orthogonal1 = grid[tile1.i][tile2.j];
    const orthogonal2 = grid[tile2.i][tile1.j];
    return (
      orthogonal1?.wall ||
      orthogonal2?.wall ||
      grid[tile1.i][Math.floor((tile1.j + tile2.j) / 2)]?.wall ||
      grid[Math.floor((tile1.i + tile2.i) / 2)][tile1.j]?.wall ||
      grid[Math.floor((tile1.i + tile2.i) / 2)][tile2.j]?.wall
    );
  }

  // If it is a diagonal move
  if (Math.abs(tile1.i - tile2.i) === 1 && Math.abs(tile1.j - tile2.j) === 1) {
    return grid[tile1.i][tile2.j]?.wall || grid[tile2.i][tile1.j]?.wall;
  }

  return false;
}

function waterInBetween(tile1, tile2) {
  // If it is a knight move
  if (
    (Math.abs(tile1.i - tile2.i) === 2 && Math.abs(tile1.j - tile2.j) === 1) ||
    (Math.abs(tile1.i - tile2.i) === 1 && Math.abs(tile1.j - tile2.j) === 2)
  ) {
    // Check for water in the middle squares that could block the knight move
    const orthogonal1 = grid[tile1.i][tile2.j];
    const orthogonal2 = grid[tile2.i][tile1.j];
    return (
      grid[tile1.i][Math.floor((tile1.j + tile2.j) / 2)]?.water ||
      grid[Math.floor((tile1.i + tile2.i) / 2)][tile1.j]?.water ||
      grid[Math.floor((tile1.i + tile2.i) / 2)][tile2.j]?.water
    );
  }

  // If it is a diagonal move
  if (Math.abs(tile1.i - tile2.i) === 1 && Math.abs(tile1.j - tile2.j) === 1) {
    return grid[tile1.i][tile2.j]?.water || grid[tile2.i][tile1.j]?.water;
  }

  return false;
}

function isKnightMove(tile1, tile2) {
  return (
    (Math.abs(tile1.i - tile2.i) === 2 && Math.abs(tile1.j - tile2.j) === 1) ||
    (Math.abs(tile1.i - tile2.i) === 1 && Math.abs(tile1.j - tile2.j) === 2)
  );
}

function middleTilesOfKnightMove(tile1, tile2) {
  if (Math.abs(tile1.i - tile2.i) === 2 && Math.abs(tile1.j - tile2.j) === 1) {
    return [
      grid[Math.floor((tile1.i + tile2.i) / 2)][tile1.j],
      grid[Math.floor((tile1.i + tile2.i) / 2)][tile2.j],
    ];
  }
  if (Math.abs(tile1.i - tile2.i) === 1 && Math.abs(tile1.j - tile2.j) === 2) {
    return [
      grid[tile1.i][Math.floor((tile1.j + tile2.j) / 2)],
      grid[tile2.i][Math.floor((tile1.j + tile2.j) / 2)],
    ];
  }
}
