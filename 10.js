const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("10-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

const WIDTH = 40;
const HEIGHT = 6;

let cycles = [];
let x = 1;

for (let i = 0; i < lines.length; i++) {
  const [instruction, value] = lines[i].split(" ");
  if (instruction === "noop") cycles.push(x);
  else {
    cycles = cycles.concat([x, x]);
    x += parseInt(value);
  }
}

console.log(
  cycles
    .slice(19)
    .reduce(
      (acc, curr, i) => (i % 40 === 0 ? acc.concat((i + 20) * curr) : acc),
      []
    )
    .reduce((acc, curr) => acc + curr, 0)
);

const rows = Array.from({ length: WIDTH / HEIGHT + 1 }, (_, i) => i * 40);
console.log(
  rows.map((r) =>
    cycles
      .slice(r, r + WIDTH)
      .map((c, i) => (c >= i - 1 && c <= i + 1 ? "X" : " "))
      .flat()
      .join("")
  )
);
