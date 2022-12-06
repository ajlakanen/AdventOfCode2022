const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("05-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

//console.log(lines);

const findStackIndices = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "") return i - 1;
  }
};

const indicesLine = findStackIndices(lines);

const parseStartStacks = (lines) => {
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

let stacks = parseStartStacks(lines);
let instructions = [];
for (let i = indicesLine + 2; i < lines.length; i++) {
  const element = lines[i]
    .replace("move", "")
    .replace("from", "")
    .replace("to", "")
    .replace(" ", "")
    .split("  ");
  instructions.push(element);
}

// console.log(instructions);
// console.log(stacks);

for (let i = 0; i < instructions.length; i++) {
  const howMany = instructions[i][0];
  for (let j = 0; j < howMany; j++) {
    const from = instructions[i][1] - 1;
    const elementToMove = stacks[from].pop();
    const to = instructions[i][2] - 1;
    stacks[to].push(elementToMove);
  }
}

let tops = [];
stacks.forEach((stack) => {
  tops.push(stack.pop());
});

console.log(tops.join(""));
