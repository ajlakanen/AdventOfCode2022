const f = require("fs");

let matrix = [];

// read the data
const dataRaw = f.readFileSync("08-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  matrix.push(line);
});

//console.log(matrix);

const isVisible = (array, row, col) => {
  const cols = array[0].length;
  let left = (right = top = bottom = true);
  for (let ix = 0; ix < col; ix++)
    if (array[row][ix] >= array[row][col]) left = false;
  for (let ix = col + 1; ix < cols; ix++)
    if (array[row][ix] >= array[row][col]) right = false;
  for (let iy = 0; iy < row; iy++)
    if (array[iy][col] >= array[row][col]) top = false;
  for (let iy = row + 1; iy < array.length; iy++)
    if (array[iy][col] >= array[row][col]) bottom = false;

  let visible = left || right || top || bottom;
  if (visible) return true;
  return false;
};

let visibles = 0;
for (let iy = 1; iy < matrix.length - 1; iy++) {
  for (let ix = 1; ix < matrix.length - 1; ix++) {
    if (isVisible(matrix, iy, ix)) visibles++;
  }
}

console.log(visibles + matrix.length * 2 + matrix[0].length * 2 - 4);
