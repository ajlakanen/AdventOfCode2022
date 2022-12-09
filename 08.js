const f = require("fs");

let matrix = [];

// read the data
const dataRaw = f.readFileSync("08-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  l = [];
  [...line].map((a) => l.push(parseInt(a)));
  matrix.push(l);
});

const isVisible = (array, row, col) => {
  const rows = array.length;
  const cols = array[0].length;
  let left = (right = top = bottom = true);

  // left to right
  let leftMinDist = col;
  for (let ix = 0; ix < col; ix++) {
    if (array[row][ix] >= array[row][col]) {
      left = false;
      leftMinDist = col - ix;
    }
  }

  // right to left
  let rightMinDist = cols - 1 - col;
  for (let ix = cols; ix >= col + 1; ix--) {
    if (array[row][ix] >= array[row][col]) {
      right = false;
      rightMinDist = ix - col;
    }
  }

  // top to bottom
  let topMinDist = row;
  for (let iy = 0; iy < row; iy++) {
    if (array[iy][col] >= array[row][col]) {
      top = false;
      topMinDist = row - iy;
    }
  }

  // bottom to top
  let bottomMinDist = rows - 1 - row;
  for (let iy = rows - 1; iy >= row + 1; iy--) {
    if (array[iy][col] >= array[row][col]) {
      bottom = false;
      bottomMinDist = iy - row;
    }
  }

  let visible = left || right || top || bottom;
  let scenicScore = leftMinDist * rightMinDist * topMinDist * bottomMinDist;
  return { visible, scenicScore };
};

let visibles = 0;
let maxScenicScore = 0;
for (let iy = 1; iy < matrix.length - 1; iy++) {
  for (let ix = 1; ix < matrix.length - 1; ix++) {
    const { visible, scenicScore } = isVisible(matrix, iy, ix);
    if (visible) visibles++;
    if (scenicScore > maxScenicScore) maxScenicScore = scenicScore;
  }
}

console.log(visibles + matrix.length * 2 + matrix[0].length * 2 - 4);
console.log(maxScenicScore);
