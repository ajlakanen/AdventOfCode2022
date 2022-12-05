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
const data = f.readFileSync("03-data.txt", "utf-8");
data.split(/\r?\n/).forEach((line) => {
  rucksacks.push(line);
});

// console.log(rucksacks);

const commonChars = rucksacks
  .map((r) => {
    return _.intersection(
      [...r.slice(0, r.length / 2)],
      [...r.slice(r.length / 2, r.length)]
    );
  })
  .flat();

// console.log(commonChars)

const charcodes = commonChars.map((e) => {
  return cc(e);
});

// console.log(charcodes);

const sum = charcodes.reduce((acc, curr) => {
  return acc + curr;
}, 0);

console.log(sum);

const sumOfGroupsOfThree = rucksacks.reduce((acc, curr, index) => {
  if (index % 3 === 0)
    return (
      acc +
      cc(
        _.intersection(
          [...rucksacks[index]],
          [...rucksacks[index + 1]],
          [...rucksacks[index + 2]]
        )[0]
      )
    );
  else return acc;
}, 0);

console.log(sumOfGroupsOfThree);
