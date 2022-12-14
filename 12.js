const f = require("fs");

class Node {
  constructor(row, col, g, h, parent) {
    (this.row = row), (this.col = col), (this.g = g);
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

const WIDTH = data[0].length;
const HEIGHT = data.length;
const DATA_PLAIN = dataRaw.split(/\r?\n/).join("");
const START_IDX = DATA_PLAIN.indexOf("S");
const TARGET_IDX = DATA_PLAIN.indexOf("E");
const START_POS = [START_IDX / WIDTH, START_IDX % WIDTH];
data[START_POS[0]][START_POS[1]] = 0;
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
      const node = new Node(
        iy,
        ix,
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
      );
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
open.push(START_POS);
let i = 0;
let currentPos = [0, 0];
while (true) {
  console.log("open", open);
  //const currentNode = nodes[currentPos[0]][currentPos[1]];
  // find node in open list with the lowest f_cost
  // open.forEach((pos) => {
  //   if (nodes[pos[0]][pos[1]].f <= currentNode.f) currentPos = pos;
  // });
  const currentPos = open.reduce(
    (acc, curr) =>
      nodes[curr[0]][curr[1]].f <= nodes[acc[0]][acc[1]].f ? curr : acc,
    open[0]
  );

  console.log("currentPos", currentPos);

  const currentNode = nodes[currentPos[0]][currentPos[1]];

  // remove current from open
  console.log("currentPos before removing", currentPos);
  open = open.filter(
    (p) => !(p[0] === currentPos[0] && p[1] === currentPos[1])
  );
  console.log("open after removing current", open);

  // add current to closed
  closed[currentPos[0]][currentPos[1]] = 1;

  // if current is the target node, path has been found
  console.log("currentPos", currentPos, "TARGET_POS", TARGET_POS);
  if (currentPos[0] === TARGET_POS[0] && currentPos[1] === TARGET_POS[1]) break;

  // Find out all neighbours that are traversable
  // and NOT closed.

  let neighbours = [];
  // up
  if (
    currentPos[0] - 1 >= 0 &&
    closed[currentPos[0] - 1][currentPos[1]] === 0 &&
    data[currentPos[0]][currentPos[1]] <=
      data[currentPos[0] - 1][currentPos[1]] + 1
  )
    neighbours.push(currentPos);
  // right
  if (
    currentPos[1] + 1 < WIDTH &&
    closed[currentPos[0]][currentPos[1] + 1] === 0 &&
    data[currentPos[0]][currentPos[1]] <=
      data[currentPos[0]][currentPos[1] + 1] + 1
  )
    neighbours.push([currentPos[0], currentPos[1] + 1]);
  // down
  if (
    currentPos[0] + 1 < HEIGHT &&
    closed[currentPos[0] + 1][currentPos[1]] === 0 &&
    data[currentPos[0]][currentPos[1]] <=
      data[currentPos[0] + 1][currentPos[1]] + 1
  )
    neighbours.push([currentPos[0] + 1, currentPos[1]]);
  // left
  if (
    currentPos[1] - 1 >= 0 &&
    closed[currentPos[0]][currentPos[1] - 1] === 0 &&
    data[currentPos[0]][currentPos[1]] <=
      data[currentPos[0] - 1][currentPos[1]] + 1
  )
    neighbours.push([currentPos[0], currentPos[1] - 1]);

  //console.log("neighbours", neighbours);

  neighbours.forEach((neighbourPos) => {
    const neighbourNode = nodes[neighbourPos[0]][neighbourPos[1]];
    const g = currentNode.g + 1;
    const h = manhattanDist(neighbourPos, TARGET_POS);
    // if new path to neighbour is shorter OR neighbour is not in open
    const neighbourInOpen =
      open.filter(
        (pos) => pos[0] === neighbourPos[0] && pos[1] === neighbourPos[1]
      ).length > 0;
    //console.log("neighbourInOpen", neighbourPos, neighbourInOpen);
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

  //console.log("closed", closed);
  // console.log("data", data);
  // console.log("neighbours", neighbours);
  // console.log("open", open);
  i++;
}

console.log(i, "steps");

const flatten = (node) => {
  if (node.parent === undefined) return [];
  return [node.parent.row, node.parent.col].concat(flatten(node.parent));
};

const flattened = flatten(nodes[TARGET_POS[0]][TARGET_POS[1]]);
console.log(flattened);
//console.log(nodes[START_POS[0]][START_POS[1]].parent);
//console.log(nodes[TARGET_POS[0]][TARGET_POS[1]].parent);
