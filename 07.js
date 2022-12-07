const { dir } = require("console");
const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("07-data-mini.txt", "utf-8");
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

function cd(target) {
  if (target === "..") {
    currentDir = currentDir.slice(0, currentDir.lastIndexOf("/"));
    if (currentDir === "") currentDir = "/";
  } else if (target === "/") {
    currentDir = "/";
  } else {
    const dir = target;
    currentDir = currentDir === "/" ? `/${dir}` : `${currentDir}/${dir}`;
  }
}

const ls = (lsStartsAt) => {
  const lsEndsAt = lsEnds(lsStartsAt);
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
    if (commands[i][1] === "ls") {
      const list = ls(i + 1);
    }
    i++;
  }
};

// console.log(lines);

const commands = lines.map((line) => line.split(" "));
// console.log(commands);
let currentDir = "/";
let fileSystem = new Map();
fileSystem.set("/", []);

execute(commands);
//console.log("fileSystem", fileSystem);

// fileSystem.forEach((value, key) => {
//   console.log(key);
//   console.log(fileSystem.get(key).value);
// });

const iter = fileSystem.entries();

for (let i = 0; i < fileSystem.size; i++) {
  const i = iter.next();
  console.log(i.value[0], i.value[1]);
  const sum = [...i.value[1]].reduce((acc, curr) => {
    acc + curr.size;
  }, 0);
  console.log(
    [...i.value[1]]
      .map((x) => x.size)
      .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0)
  );
}