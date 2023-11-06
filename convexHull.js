let offsetDist = 20;

function walls() {
  let points = [];
  let realHuts = huts
  for (let i = 0; i < realHuts.length; i++) {
    points.push(createVector(realHuts[i].x, realHuts[i].y));
  }
  // points = offset(points);
  let hull = convext(points);
  hullOffsetPoints = offset(hull)
  hull = convext(hullOffsetPoints)
  noFill();
  stroke(0, 150);
  strokeWeight(res/3);
  beginShape();
  for (let pt of hull) {
    vertex(pt.x + 3 , pt.y - 3 );
  }
  endShape(CLOSE);
  beginShape();
  stroke(180, 170, 140);

  for (let pt of hull) {
    vertex(pt.x  , pt.y );
  }
  endShape(CLOSE);
}

function convext(points) {
  let hull = [];

  let lowPoint;
  let index = 0;

  points.sort((a, b) => b.y - a.y);

  lowPoint = points[0].copy();

  for (let i = 0; i < points.length; i++) {
    points[i].sub(lowPoint);
  }
  points.sort((a, b) => a.heading() - b.heading());
  for (let i = 0; i < points.length; i++) {
    points[i].add(lowPoint);
  }
  hull = points;
  while (index < points.length - 2) {
    for (let i = 0; i < points.length; i++) {}
    v1 = p5.Vector.sub(hull[index + 1], hull[index]);
    v2 = p5.Vector.sub(hull[index + 2], hull[index + 1]);
    // console.log(p5.Vector.cross(v1, v2).z, hull.length);
    if (p5.Vector.cross(v1, v2).z < 0) {
      hull.splice(index + 1, 1);
      if (index != 0) {
        index -= 1;
      }
    } else if (p5.Vector.cross(v1, v2).z > 0) {
      index += 1;
    } else if (
      dist(
        hull[index + 2].x,
        hull[index + 2].y,
        hull[index].x,
        hull[index].y
      ) ==
      dist(
        hull[index + 2].x,
        hull[index + 2].y,
        hull[index + 1].x,
        hull[index + 1].y
      ) +
        dist(hull[index + 1].x, hull[index + 1].y, hull[index].x, hull[index].y)
    ) {
      //co-linear
      hull.splice(index + 1, 1);
      if (index != 0) {
        index -= 1;
      } else {
        hull.splice(index + 2, 1);
      }
    }
  }
  return hull;
}

function offset(points) {
  let offsetPoints = [];

  for (let pt of points) {
    for (let a = 0; a < 2 * PI; a += PI / 4) {
      let pt1 = pt.copy();
      let pt2 = createVector(sin(a) * offsetDist, cos(a) * offsetDist);

      pt1.add(pt2);
      point(pt1.x + res/2, pt1.y + res/2);
      offsetPoints.push(pt1);
    }
  }
  console.log(offsetPoints);
  points = points.concat(offsetPoints);
  return points;
}
