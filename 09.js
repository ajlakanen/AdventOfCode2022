const f = require("fs");

let motions = [];

// read the data
const dataRaw = f.readFileSync("09-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  motions.push([line.split(" ")[0], parseInt(line.split(" ")[1])]);
});

let head = [0, 0];
let tail = [0, 0];
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

const newTailPosition = (headPosition, tailPosition) => {
  const dx = headPosition[0] - tailPosition[0];
  const dy = headPosition[1] - tailPosition[1];

  const moves = new Map();
  // 2 rows above
  moves.set("-22", [-1, 1]); // why is this possible??
  moves.set("-12", [-1, 1]);
  moves.set("02", [0, 1]);
  moves.set("12", [1, 1]);
  moves.set("22", [1, 1]); // why is this possible??
  // 1 row above
  moves.set("-21", [-1, 1]);
  moves.set("21", [1, 1]);

  // same row
  moves.set("-20", [-1, 0]);
  moves.set("20", [1, 0]);

  // 1 row below
  moves.set("-2-1", [-1, -1]);
  moves.set("2-1", [1, -1]);

  // 2 rows below
  moves.set("-2-2", [-1, -1]); // why is this possible??
  moves.set("-1-2", [-1, -1]);
  moves.set("0-2", [0, -1]);
  moves.set("1-2", [1, -1]);
  moves.set("2-2", [1, -1]); // why is this possible??

  if (!moves.has(`${dx}${dy}`)) return tailPosition;
  const tailDirection = moves.get(`${dx}${dy}`);
  const newTailPosition = [
    tailPosition[0] + tailDirection[0],
    tailPosition[1] + tailDirection[1],
  ];
  return newTailPosition;
};

for (let i = 0; i < motions.length; i++) {
  const [direction, amount] = motions[i];
  for (let j = 0; j < amount; j++) {
    tail = newTailPosition(head, tail);
    tailPosAsStr = `${tail[0]}${tail[1]}`;
    if (tailVisited.has(tailPosAsStr)) {
      tailVisited.set(tailPosAsStr, tailVisited.get(tailPosAsStr) + 1);
    } else tailVisited.set(tailPosAsStr, 1);
    head = newHeadPosition(head, direction);
  }
}

console.log(tailVisited.size);

let tails = Array(9)
  .fill()
  .map((a) => [0, 0]);
head = [0, 0];
tailVisited = new Map();
tailVisited.set("00", 1);
for (let i = 0; i < motions.length; i++) {
  const [direction, amount] = motions[i];
  for (let j = 0; j < amount; j++) {
    head = newHeadPosition(head, direction);
    for (let k = 0; k < tails.length; k++) {
      const tail = tails[k];
      const headNow = k === 0 ? head : tails[k - 1];
      tails[k] = newTailPosition(headNow, tail);
    }
    tailPosAsStr = `${tails[tails.length - 1][0]}${tails[tails.length - 1][1]}`;
    if (tailVisited.has(tailPosAsStr)) {
      tailVisited.set(tailPosAsStr, tailVisited.get(tailPosAsStr) + 1);
    } else tailVisited.set(tailPosAsStr, 1);
  }
}
console.log(tailVisited.size);
