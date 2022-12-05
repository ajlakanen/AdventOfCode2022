const f = require("fs");

const sortNumbers = (a, b) => {
  return parseInt(a) - parseInt(b);
};

// 1. read data to lines
let lines = [];

const data = f.readFileSync("01-data.txt", "utf-8");
data.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

// 2. read eachs elfs calories to separate array
let elfCalories = [];

lines.reduce((newArr, line) => {
  if (line !== "") newArr.push(line);
  else {
    elfCalories.push(newArr);
    newArr = [];
  }
  return newArr;
}, []);

// 3. count sums of elfs' calories

const caloriesSums = elfCalories.map((calories) =>
  calories.reduce((acc, val) => {
    return parseInt(acc) + parseInt(val);
  }, 0)
);

// 4. print max and sum of max three

console.log(Math.max(...caloriesSums));

console.log(
  caloriesSums.sort(sortNumbers).pop() +
    caloriesSums.sort(sortNumbers).pop() +
    caloriesSums.sort(sortNumbers).pop()
);
