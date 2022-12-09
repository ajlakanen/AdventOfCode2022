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
  // console.log(cols);
  let left = true;
  for (let ix = 0; ix < col; ix++) {
    if (array[row][ix] >= array[row][col]) left = false;
  }

  let right = true;
  for (let ix = col + 1; ix < cols; ix++) {
    if (array[row][ix] >= array[row][col]) right = false;
    //console.log("row", row, "col", col, "right", right);
  }

  let top = true;
  for (let iy = 0; iy < row; iy++) {
    if (array[iy][col] >= array[row][col]) top = false;
  }

  let bottom = true;
  for (let iy = row + 1; iy < array.length; iy++) {
    if (array[iy][col] >= array[row][col]) bottom = false;
  }

  let visible = left || right || top || bottom;
  if (visible) {
    return true;
  }
  return false;
  // const rows = Array(array.length)
  //   .fill()
  //   .map((_, i) => i)
  //   .filter((i) => i !== row);

  //  console.log(
  //    row,
  //    col,
  //    array
  //      .filter((r, i) => rows.includes(i))
  //      .map((c, i) => c[col])
  //      .reduce((acc, curr) => (curr >= array[row][col] ? false : acc), true)
  //  );
  //
  //  //cols
  //  const cols = Array(array.length)
  //    .fill()
  //    .map((_, i) => i)
  //    .filter((i) => i !== col);
  //  for (const c in cols) if (array[row][c] >= array[row][col]) return false;
  // return true;
};

let visibles = 0;
for (let iy = 1; iy < matrix.length - 1; iy++) {
  for (let ix = 1; ix < matrix.length - 1; ix++) {
    if (isVisible(matrix, iy, ix)) visibles++;
  }
}

console.log(visibles + matrix.length * 2 + matrix[0].length * 2 - 4);
