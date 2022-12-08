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

const sortNumbers = (a, b) => {
  return parseInt(a) - parseInt(b);
};

const cd = (to) => {
  if (to === "..") {
    currentDir = currentDir.slice(0, currentDir.lastIndexOf("/"));
    if (currentDir === "") currentDir = "/";
  } else if (to === "/") {
    currentDir = "/";
  } else {
    currentDir = currentDir === "/" ? `/${to}` : `${currentDir}/${to}`;
  }
};

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

// Part 1 starts here

let iterator = fileSystem.entries();
let under100kSum = 0;
let dirSizesRecursive = [];

for (let i = 0; i < fileSystem.size; i++) {
  const i = iterator.next();
  const dir = i.value[0];

  const dirSizeRecursive = [...fileSystem]
    .filter((kv) => `${kv}`.startsWith(dir))
    .map((kv) => kv[1])
    .flat()
    .map((files) => parseInt(files.size))
    .reduce((acc, curr) => acc + curr, 0);

  dirSizesRecursive.push(dirSizeRecursive);
  if (dirSizeRecursive < 100000) under100kSum += dirSizeRecursive;
}

console.log(under100kSum);

// Part 2 starts here

let dirSizes = [];
iterator = fileSystem.entries();

for (let i = 0; i < fileSystem.size; i++) {
  const next = iterator.next();
  const dirSize = [...next.value[1]]
    .map((a) => a.size)
    .reduce((acc, curr) => acc + parseInt(curr), 0);
  dirSizes.push(dirSize);
}

const dirSize = dirSizes.reduce((acc, curr) => acc + curr, 0);
console.log(
  dirSizesRecursive.sort(sortNumbers).filter((s) => dirSize - s < 40000000)[0]
);
