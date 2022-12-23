const f = require("fs");

class Node {
  constructor(g, h, parent) {
    this.g = g;
    this.h = h;
    this.f = g + h;
    this.parent = parent;
  }

  update_h(h) {
    this.h = h;
    this.f = h + this.g;
  }

  update_g(g) {
    this.g = g;
    this.f = g + this.h;
  }
}

let data = [];

// read the data
const dataRaw = f.readFileSync("12-data-mini.txt", "utf-8");
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

const generateEmptyArray = (width, height, content = 0) => {
  let array = Array(height)
    .fill()
    .map((a) => [...Array(width)])
    .map((a) => a.fill(content));
  return array;
};

const generateNodes = (width, height, startPos) => {
  let nodes = [];
  for (let iy = 0; iy < HEIGHT; iy++) {
    let row = [];
    for (let ix = 0; ix < WIDTH; ix++) {
      const node = new Node(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
      row.push(node);
    }
    nodes.push(row);
  }
  nodes[startPos[0]][startPos[1]].update_h(0);
  nodes[startPos[0]][startPos[1]].update_g(0);
  return nodes;
};

// console.log(visited.length, visited[0].length);

const manhattanDist = (pos, target) => {
  const dy = Math.abs(pos[0] - target[0]);
  const dx = Math.abs(pos[1] - target[1]);
  return dy + dx;
};

let visited = generateNodes(WIDTH, HEIGHT, START_POS);
let pos = START_POS;

//while (!(pos[0] === TARGET_POS[0] && pos[1]) === TARGET_POS[1]) {
//  let direction = [0, 0];
//  // right
//
//  // down
//  // left
//  // up
//}

//const n = new Node(10, 20);
//console.log(n);
//n.update_g(20);
//console.log(n);
//
//const m = new Node(20, 20, n);
//console.log(m);

let nodes = generateNodes(WIDTH, HEIGHT, START_POS);
let open = [];
let closed = generateEmptyArray(WIDTH, HEIGHT, 0);
// console.log(closed);
//nodes[START_POS[0]][START_POS[1]].update_h(100);
//nodes[START_POS[0]][START_POS[1]].update_g(0);
//open.push(START_POS);
//console.log(nodes[START_POS[0]][START_POS[1]]);

//nodes[1][0].update_h(50);
//open.push([1, 0]);
//open.push([2, 0]);
//console.log(nodes[1][0]);
//console.log(nodes[2][0]);
//console.log(open);

let i = 0;
let currentPos = [0, 0];
while (i < 1) {
  //console.log("open", open);
  const currentNode = nodes[currentPos[0]][currentPos[1]];
  // find node in open list with the lowest f_cost
  open.forEach((pos) => {
    if (nodes[pos[0]][pos[1]].f <= currentNode.f) currentPos = pos;
  });
  //console.log("current", currentPos);

  // remove current from open
  open = open.filter(
    (p) => !(p[0] === currentPos[0] && p[1] === currentPos[1])
  );
  //console.log("open", open);

  // add current to closed
  closed[currentPos[0]][currentPos[1]] = 1;

  // if current is the target node, path has been found
  if (currentPos[0] === TARGET_POS[0] && currentPos[1] === TARGET_POS) return;

  // Find out all neighbours that are traversable
  // and NOT closed.
  // TODO: Neighbours with >1 height difference will be considered obstacles.

  let neighbours = [];
  // up
  if (currentPos[0] - 1 >= 0 && closed[currentPos[0]][currentPos[1]] === 0)
    neighbours.push(currentPos);
  // right
  if (
    currentPos[1] + 1 < WIDTH &&
    closed[currentPos[0]][currentPos[1] + 1] === 0
  )
    neighbours.push([currentPos[0], currentPos[1] + 1]);
  // down
  if (
    currentPos[0] + 1 < HEIGHT &&
    closed[currentPos[0] + 1][currentPos[1]] === 0
  )
    neighbours.push([currentPos[0] + 1, currentPos[1]]);
  // left
  if (currentPos[1] - 1 >= 0 && closed[currentPos[0]][currentPos[1] - 1] === 0)
    neighbours.push(currentPos);

  console.log("neighbours", neighbours);

  neighbours.forEach((neighbourPos) => {
    const neighbourNode = nodes[neighbourPos[0]][neighbourPos[1]];
    const g = currentNode.g + 1;
    const h = manhattanDist(neighbourPos, TARGET_POS);
    // if new path to neighbour is shorter OR neighbour is not in open
    const neighbourInOpen =
      open.filter((p) => p[0] === neighbourPos[0] && p[1] === neighbourPos[1])
        .length > 0;
    console.log("neighbourInOpen", neighbourPos, neighbourInOpen);
    if (!neighbourInOpen || g + h < neighbourNode.h) {
      // set f cost to neighbour
      neighbourNode.update_g(g);
      neighbourNode.update_h(h);

      // set parent of neighbour to current
      neighbourNode.parent = currentNode;

      // if neighbour is not in open, add neighbour to open
      if (!neighbourInOpen) open.push(neighbourPos);
    }
  });

  console.log("closed", closed);
  console.log("neighbours", neighbours);
  console.log("open", open);
  i++;
}
