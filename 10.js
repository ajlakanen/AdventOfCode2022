const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("10-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

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
