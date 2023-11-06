function voronoize() {
  //Create an Image
  let margins = [];
  colorMode(RGB)

  //Load all Pixels
  console.log(huts)
  
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (
        grid[i][j].altitude >= waterLevel + 2 &&
        grid[i][j].altitude <= highlandLevel
      ) {
        grid[i][j].allDist = [];
        huts.forEach((hut) => {
          grid[i][j].allDist.push({
            occupiedBy: hut,
            // dist:
            // Math.round(dist(i, j, hut.x, hut.y),1) / hut.weight ** weightFactor,
            dist: dist(i, j, hut.i, hut.j) / hut.weight,
          });
        });

        let min = 1000;

        grid[i][j].allDist.sort((a, b) => (a.dist > b.dist ? 1 : -1));
        if (grid[i][j].allDist[0].dist < claimRange){
          grid[i][j].belong = grid[i][j].allDist[0].occupiedBy;
          grid[i][j].allDist[0].occupiedBy.control.push(grid[i][j]);
          grid[i][j].attrition = 4;
          fill(grid[i][j].allDist[0].occupiedBy.color);
          noStroke()
          rectMode(CENTER)
          rect(i * res, j * res, res, res);
        }
        if(abs(grid[i][j].allDist[0].dist - grid[i][j].allDist[1].dist) <= 0.1 &&
          grid[i][j].allDist[0].dist< claimRange){
          grid[i][j].attrition = 1;
          margins.push(grid[i][j]);
        }
      }
    }
  }
}
