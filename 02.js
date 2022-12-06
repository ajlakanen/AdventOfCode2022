const f = require("fs");

// 1. read data to lines
let turns = [];

const dataRaw = f.readFileSync("02-data.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  turns.push(line.replace(" ", ""));
});

console.log(turns);

const rps = new Map();
rps.set("AX", 4); // rock vs rock         => 1 + 3
rps.set("BX", 1); // paper vs rock        => 1 + 0
rps.set("CX", 7); // scissors vs rock     => 1 + 6
rps.set("AY", 8); // rock vs paper        => 2 + 6
rps.set("BY", 5); // paper vs paper       => 2 + 3
rps.set("CY", 2); // scissors vs paper    => 2 + 0
rps.set("AZ", 3); // rock vs scissors     => 3 + 0
rps.set("BZ", 9); // paper vs scissors    => 3 + 6
rps.set("CZ", 6); // scissors vs scissors => 3 + 3

const sum = turns.reduce((acc, curr) => {
  return acc + rps.get(curr);
}, 0);

console.log(sum);

const rps2 = new Map();
rps2.set("AX", 3); // rock & lose -> scissors     => 3 + 0
rps2.set("BX", 1); // paper & lose -> rock        => 1 + 0
rps2.set("CX", 2); // scissors & lose -> paper    => 2 + 0
rps2.set("AY", 4); // rock & draw -> rock         => 1 + 3
rps2.set("BY", 5); // paper & draw -> paper       => 2 + 3
rps2.set("CY", 6); // scissors & draw -> scissors => 3 + 3
rps2.set("AZ", 8); // rock & win -> paper         => 2 + 6
rps2.set("BZ", 9); // paper & win -> scissors     => 3 + 6
rps2.set("CZ", 7); // scissors & win -> rock      => 1 + 6

const sum2 = turns.reduce((acc, curr) => {
  return acc + rps2.get(curr);
}, 0);

console.log(sum2);
