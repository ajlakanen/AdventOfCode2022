const f = require("fs");

const sortNumbers = (a, b) => {
  return parseInt(a) - parseInt(b);
};

// Original data is in form (e.g.) 2-4,6-8
// where a=2, b=4, c=6, d=8
const isFullyContained = (a, b, c, d) => {
  if (parseInt(a) === parseInt(c)) return 1;
  if (parseInt(d) <= parseInt(b)) return 1;
  return 0;
};

let lines = [];

// read the data
const dataRaw = f.readFileSync("04-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

// console.log(lines);

// assignment pairs are sorted so that the the first of the pairs
// is always the one that has the smaller first number
let assignments = lines
  .map((l) => l.split(","))
  .map((l) => l.sort(sortNumbers).map((a) => a.split("-")));

//console.log(assignments);

let sum = 0;
assignments.forEach((element) => {
  [[a, b], [c, d]] = element;
  sum += isFullyContained(a, b, c, d);
});

console.log(sum);
