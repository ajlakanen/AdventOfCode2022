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

const generateNodes = (width, height, startPos) => {
  //let nodes = Array(height)
  //  .fill()
  //  .map((a) => [...Array(width)])
  //  .map((a) => a.fill(0));
  //nodes[startPos[0]][startPos[1]] = 1;
  //return nodes;
  let nodes = [];
  for (let iy = 0; iy < HEIGHT; iy++) {
    let row = [];
    for (let ix = 0; ix < WIDTH; ix++) {
      const node = new Node(-1, -1);
      row.push(node);
    }
    nodes.push(row);
  }
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
let closed = [];
nodes[START_POS[0]][START_POS[1]].update_h(100);
nodes[START_POS[0]][START_POS[1]].update_g(0);
open.push(START_POS);
console.log(nodes[START_POS[0]][START_POS[1]]);

nodes[1][0].update_h(50);
open.push([1, 0]);
console.log(nodes[1][0], open);

let i = 0;
while (i < 1) {
  console.log("open", open);
  let current = [0, 0];
  // find node in open list with the lowest f_cost
  open.forEach((pos) => {
    if (nodes[pos[0]][pos[1]].f <= nodes[current[0]][current[1]].f)
      current = pos;
  });
  console.log("current", current);
  open = open.filter((p) => !(p[0] === current[0] && p[1] === current[1]));
  console.log("open", open);
  i++;
}
