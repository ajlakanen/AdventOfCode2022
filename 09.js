const f = require("fs");
const { cloneWith, tail } = require("lodash");

let motions = [];

// read the data
const dataRaw = f.readFileSync("09-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  motions.push([line.split(" ")[0], parseInt(line.split(" ")[1])]);
});

let headPosition = [0, 0];
let tailPosition = [0, 0];
let tailVisited = new Map();
tailVisited.set("00", 1);

const newHeadPosition = (headPosition, direction) => {
  switch (direction) {
    case "U":
      return [headPosition[0], headPosition[1] + 1];
    case "R":
      return [headPosition[0] + 1, headPosition[1]];
    case "D":
      return [headPosition[0], headPosition[1] - 1];
    case "L":
      return [headPosition[0] - 1, headPosition[1]];
    default:
      return headPosition;
  }
};

const newTailPosition = (headPosition, tailPosition, direction) => {
  const dx = headPosition[0] - tailPosition[0];
  const dy = headPosition[1] - tailPosition[1];

  const moves = new Map();
  moves.set("-11U", [-1, 1]);
  moves.set("-11R", [0, 0]);
  moves.set("-11D", [0, 0]);
  moves.set("-11L", [-1, 1]);
  moves.set("01U", [0, 1]);
  moves.set("01R", [0, 0]);
  moves.set("01D", [0, 0]);
  moves.set("01L", [0, 0]);
  moves.set("11U", [1, 1]);
  moves.set("11R", [1, 1]);
  moves.set("11D", [0, 0]);
  moves.set("11L", [0, 0]);
  moves.set("-10U", [0, 0]);
  moves.set("-10R", [0, 0]);
  moves.set("-10D", [0, 0]);
  moves.set("-10L", [-1, 0]);
  moves.set("00U", [0, 0]);
  moves.set("00R", [0, 0]);
  moves.set("00D", [0, 0]);
  moves.set("00L", [0, 0]);
  moves.set("10U", [0, 0]);
  moves.set("10R", [1, 0]);
  moves.set("10D", [0, 0]);
  moves.set("10L", [0, 0]);
  moves.set("-1-1U", [0, 0]);
  moves.set("-1-1R", [0, 0]);
  moves.set("-1-1D", [-1, -1]);
  moves.set("-1-1L", [-1, -1]);
  moves.set("0-1U", [0, 0]);
  moves.set("0-1R", [0, 0]);
  moves.set("0-1D", [0, -1]);
  moves.set("0-1L", [0, 0]);
  moves.set("1-1U", [0, 0]);
  moves.set("1-1R", [1, -1]);
  moves.set("1-1D", [1, -1]);
  moves.set("1-1L", [0, 0]);

  const tailDirection = moves.get(`${dx}${dy}${direction}`);
  const newTailPosition = [
    tailPosition[0] + tailDirection[0],
    tailPosition[1] + tailDirection[1],
  ];
  return newTailPosition;
};

for (let i = 0; i < motions.length; i++) {
  const [direction, amount] = motions[i];
  for (let j = 0; j < amount; j++) {
    tailPosition = newTailPosition(headPosition, tailPosition, direction);
    tailPosAsStr = `${tailPosition[0]}${tailPosition[1]}`;
    if (tailVisited.has(tailPosAsStr)) {
      tailVisited.set(tailPosAsStr, tailVisited.get(tailPosAsStr) + 1);
    } else tailVisited.set(tailPosAsStr, 1);
    headPosition = newHeadPosition(headPosition, direction);
  }
}

console.log(tailVisited.size);
