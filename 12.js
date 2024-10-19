const f = require("fs");

/**
 * Node
 */
class Node {
  constructor(row, col, data, g, h, parent) {
    (this.row = row), (this.col = col), (this.data = data), (this.g = g);
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
const dataRaw = f.readFileSync("data/12-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  data.push(line.split("").map((c) => c.charCodeAt(0) - 97));
});

const WIDTH = data[0].length;
const HEIGHT = data.length;
const DATA_PLAIN = dataRaw.split(/\r?\n/).join("");
const START_IDX = DATA_PLAIN.indexOf("S");
const TARGET_IDX = DATA_PLAIN.indexOf("E");

// Get the highest value (char -> int) in the data
const MAX_VALUE = Math.max(...data.map((row) => Math.max(...row)));

const generateEmptyArray = (width, height, content = 0) => {
  let array = Array(height)
    .fill()
    .map((a) => [...Array(width)])
    .map((a) => a.fill(content));
  return array;
};

const generateNodes = (width, height, startPos) => {
  let nodes = [];
  for (let iy = 0; iy < height; iy++) {
    let row = [];
    for (let ix = 0; ix < width; ix++) {
      const node = new Node(
        iy,
        ix,
        data[iy][ix],
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

const manhattanDist = (pos, target) => {
  const dy = Math.abs(pos[0] - target[0]);
  const dx = Math.abs(pos[1] - target[1]);
  return dy + dx;
};

const flatten = (node) => {
  if (node.parent === undefined) return [];
  return [
    flatten(node.parent),
    "[" + node.parent.row + "," + node.parent.col + "]",
  ].flat();
};

const aStar = (startPos, targetPos) => {
  let nodes = generateNodes(WIDTH, HEIGHT, startPos);
  let open = [];
  let closed = generateEmptyArray(WIDTH, HEIGHT, 0);
  open.push(startPos);

  let i = 0;
  while (true) {
    // find node in open list with the lowest f_cost
    const currentPos = open.reduce(
      (acc, curr) =>
        nodes[curr[0]][curr[1]].f <= nodes[acc[0]][acc[1]].f ? curr : acc,
      open[0]
    );

    // No path found??
    if (currentPos === undefined) {
      return null;
    }

    const currentNode = nodes[currentPos[0]][currentPos[1]];

    // if current is the target node, path has been found
    if (
      currentNode.row === targetPos[0] &&
      currentNode.col === targetPos[1] &&
      currentNode.parent.data >= MAX_VALUE - 1
    )
      break;

    // remove current from open
    open = open.filter(
      (p) => !(p[0] === currentPos[0] && p[1] === currentPos[1])
    );

    // add current to closed
    closed[currentPos[0]][currentPos[1]] = 1;

    // Find out all neighbours that are traversable
    // and NOT closed.
    let neighbours = [];
    const directions = [
      [-1, 0], // down
      [0, 1], // right
      [1, 0], // up
      [0, -1], // left
    ];

    directions.forEach(([dy, dx]) => {
      const [newY, newX] = [currentPos[0] + dy, currentPos[1] + dx];
      if (
        newY >= 0 &&
        newY < HEIGHT &&
        newX >= 0 &&
        newX < WIDTH &&
        closed[newY][newX] === 0 &&
        data[currentPos[0]][currentPos[1]] + 1 >= data[newY][newX]
      ) {
        // if new position is the target position but
        // the value is not the highest, then skip
        if (newY === targetPos[0] && newX === targetPos[1]) {
          if (data[currentPos[0]][currentPos[1]] < MAX_VALUE - 1) return;
        }

        neighbours.push([newY, newX]);
      }
    });

    neighbours.forEach((neighbourPos) => {
      const neighbourNode = nodes[neighbourPos[0]][neighbourPos[1]];
      const g = currentNode.g + 1;
      const h = manhattanDist(neighbourPos, targetPos);
      // if new path to neighbour is shorter OR neighbour is not in open
      const neighbourInOpen =
        open.filter(
          (pos) => pos[0] === neighbourPos[0] && pos[1] === neighbourPos[1]
        ).length > 0;
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

    i++;
  }
  return nodes;
};

const part1 = () => {
  const START_POS = [START_IDX / WIDTH, START_IDX % WIDTH];
  data[START_POS[0]][START_POS[1]] = -1;
  const TARGET_POS = [Math.floor(TARGET_IDX / WIDTH), TARGET_IDX % WIDTH];

  const nodes = aStar(START_POS, TARGET_POS);

  const flattened = flatten(nodes[TARGET_POS[0]][TARGET_POS[1]]);
  console.log("Path length is " + flattened.length + ".");
};

const part2 = () => {
  // find all nodes with value 0
  const aNodes = [];
  for (let iy = 0; iy < HEIGHT; iy++) {
    for (let ix = 0; ix < WIDTH; ix++) {
      if (data[iy][ix] === 0) {
        aNodes.push([iy, ix]);
      }
    }
  }

  const TARGET_POS = [Math.floor(TARGET_IDX / WIDTH), TARGET_IDX % WIDTH];

  // find shortest path from all aNodes to all End (E)
  const paths = [];
  aNodes.forEach((node) => {
    const nodes = aStar([node[0], node[1]], TARGET_POS);
    if (nodes !== null) {
      const flattened = flatten(nodes[TARGET_POS[0]][TARGET_POS[1]]);
      paths.push(flattened.length);
    }
  });
  console.log("Shortest path is " + Math.min(...paths) + ".");
};

part1();
part2();
