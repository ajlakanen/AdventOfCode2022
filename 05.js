const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("05-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

const findStackIndices = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "") return i - 1;
  }
};

const indicesLine = findStackIndices(lines);

const parseStartingStacks = (lines) => {
  // TODO: This is stupid. If >=10 stacks exist, this will break.
  const numberOfStacks = lines[indicesLine].replace(/\s/g, "").length;
  let stacks = Array(numberOfStacks)
    .fill()
    .map((a) => []);

  for (let i = indicesLine - 1; i >= 0; i--) {
    const line = lines[i];
    for (let j = 0; j < numberOfStacks; j++) {
      const element = line[j * 4 + 1];
      if (element !== " ") stacks[j].push(element);
    }
  }
  return stacks;
};

const parseInstructions = (lines, instructionsStartAt) => {
  let instructions = [];
  for (let i = instructionsStartAt; i < lines.length; i++) {
    const element = lines[i]
      .replace("move", "")
      .replace("from", "")
      .replace("to", "")
      .replace(" ", "")
      .split("  ");
    instructions.push(element);
  }
  return instructions;
};

function printStacksTops(stacks) {
  let tops = [];
  stacks.forEach((stack) => {
    tops.push(stack.pop());
  });

  console.log(tops.join(""));
  return tops;
}

let stacks = parseStartingStacks(lines);
let instructions = parseInstructions(lines, indicesLine + 2);

// Part 1 starts here

for (let i = 0; i < instructions.length; i++) {
  const howMany = instructions[i][0];
  for (let j = 0; j < howMany; j++) {
    const from = instructions[i][1] - 1;
    const elementToMove = stacks[from].pop();
    const to = instructions[i][2] - 1;
    stacks[to].push(elementToMove);
  }
}

printStacksTops(stacks);

// Part 2 starts here

stacks = parseStartingStacks(lines);

for (let i = 0; i < instructions.length; i++) {
  const howMany = instructions[i][0];
  const from = instructions[i][1] - 1;
  const elementsToMove = stacks[from].slice(stacks[from].length - howMany);
  const to = instructions[i][2] - 1;
  stacks[to] = stacks[to].concat(elementsToMove);
  stacks[from] = stacks[from].slice(0, stacks[from].length - howMany);
}

printStacksTops(stacks);
