const f = require("fs");
const { zip } = require("lodash");
const _ = require("lodash");
const util = require("util");

// extract charcode from character
const cc = (char) => {
  const charCode = char.charCodeAt(0);
  // lowercase
  if (charCode >= 97 && charCode <= 122) return charCode - 96;
  // uppercase
  if (charCode >= 65 && charCode <= 90) return charCode - 38;
  // error
  return 0;
};

let rucksacks = [];

// read the data
// result: [[ 'LLBPGtltrGPBMMsLcLMMVMp', 'RhhfCDTwRwRdTfwDllRRRDhC' ], ... ]
const data = f.readFileSync("03-data-mini.txt", "utf-8");
data.split(/\r?\n/).forEach((line) => {
  rucksacks.push([
    line.slice(0, line.length / 2),
    line.slice(line.length / 2, line.length),
  ]);
});

console.log(rucksacks);

const commonChars = rucksacks
  .map((r) => {
    return _.intersection([...r[0]], [...r[1]]);
  })
  .flat();

console.log(util.inspect(commonChars, { maxArrayLength: null }));

const charcodes = commonChars.map((e) => {
  return cc(e);
});

console.log(util.inspect(charcodes, { maxArrayLength: null }));

const sum = charcodes.reduce((acc, curr) => {
  return acc + curr;
}, 0);

console.log(sum);
