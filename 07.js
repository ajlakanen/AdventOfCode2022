const { dir } = require("console");
const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("07-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

// Gives exclusive index where the directory listing ends.
const lsEnds = (start) => {
  for (let i = start; i < commands.length; i++) {
    if (commands[i][0] === "$") return i;
  }
  return commands.length;
};

const addDirToStructure = (dir) => {
  if (fileSystem.get(dir) === undefined) fileSystem.set(dir, []);
};

const addFileToStructure = (dir, file) => {
  const files = fileSystem.get(dir);
  files.push(file);
  fileSystem.set(dir, files);
};

function cd(to) {
  if (to === "..") {
    currentDir = currentDir.slice(0, currentDir.lastIndexOf("/"));
    if (currentDir === "") currentDir = "/";
  } else if (to === "/") {
    currentDir = "/";
  } else {
    currentDir = currentDir === "/" ? `/${to}` : `${currentDir}/${to}`;
  }
}

const ls = (lsStartsAt, lsEndsAt) => {
  const filesAndDirs = commands.slice(lsStartsAt, lsEndsAt);
  for (let i = 0; i < filesAndDirs.length; i++) {
    if (filesAndDirs[i][0] === "dir") {
      const dir = filesAndDirs[i][1];
      addDirToStructure(
        currentDir === "/" ? `/${dir}` : `${currentDir}/${dir}`
      );
    } else {
      const file = { size: filesAndDirs[i][0], name: filesAndDirs[i][1] };
      addFileToStructure(currentDir, file);
    }
  }
};

const execute = (commands) => {
  let i = 0;
  while (i < commands.length) {
    if (commands[i][1] === "cd") {
      cd(commands[i][2]);
    }
    // Here we actually assume that ls command is given in every dir.
    // The ls command is the only one adding dirs to structure.
    if (commands[i][1] === "ls") {
      ls(i + 1, lsEnds(i + 1));
    }
    i++;
  }
};

const commands = lines.map((line) => line.split(" "));
let currentDir = "/";
let fileSystem = new Map();
fileSystem.set("/", []);

execute(commands);

const iter = fileSystem.entries();

let under100kSum = 0;
for (let i = 0; i < fileSystem.size; i++) {
  const i = iter.next();
  const dir = i.value[0];

  //const sum = [...i.value[1]].reduce((acc, curr) => {
  //  acc + curr.size;
  //}, 0);

  const recursiveSum = [...fileSystem]
    .filter((kv) => `${kv}`.startsWith(dir))
    .map((kv) => kv[1])
    .flat()
    .map((files) => parseInt(files.size))
    .reduce((acc, curr) => acc + curr, 0);

  if (recursiveSum < 100000) {
    console.log(`${dir}: ${recursiveSum}`);
    under100kSum += recursiveSum;
  }
}

console.log(under100kSum);
