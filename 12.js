const f = require("fs");

let data = [];

// read the data
const dataRaw = f.readFileSync("12-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  data.push(line.split("").map((c) => c.charCodeAt(0) - 97));
});

//console.log(lines);

const WIDTH = data[0].length;
const HEIGHT = data.length;
const DATA_PLAIN = dataRaw.split(/\r?\n/).join("");
const START_IDX = DATA_PLAIN.indexOf("S");
const TARGET_IDX = DATA_PLAIN.indexOf("E");
const START_POS = [START_IDX / WIDTH, START_IDX % WIDTH];
const TARGET_POS = [Math.floor(TARGET_IDX / WIDTH), TARGET_IDX % WIDTH];

// console.log(START_POS, TARGET_POS);

const generateVisitedArray = (width, height, startPos) => {
  let visited = Array(height)
    .fill()
    .map((a) => [...Array(width)])
    .map((a) => a.fill(0));
  visited[startPos[0]][startPos[1]] = 1;
  return visited;
};

let visited = generateVisitedArray(WIDTH, HEIGHT, START_POS);
console.log(visited.length, visited[0].length);

let pos = START_POS;

const distToTarget = (pos, target) => {
  const dy = Math.abs(pos[0] - target[0]);
  const dx = Math.abs(pos[1] - target[1]);
  return dy + dx;
};
