const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("data/11-data-mini.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

const sortDec = (a, b) => {
  return b - a;
};

const MONKEY_LINES = 7;

const parseMonkey = (lines) => {
  const items = lines[1]
    .split(":")[1]
    .split(",")
    .map((item) => BigInt(parseInt(item)));
  let [operator, operand] = lines[2].split(" ").slice(-2);
  operand = isNaN(operand) ? "old" : BigInt(parseInt(operand));

  const test = BigInt(parseInt(lines[3].split(" ").slice(-1)));
  const throwTo = [parseInt(lines[4].slice(-1)), parseInt(lines[5].slice(-1))];
  return {
    items: items,
    operation: { operator: operator, operand: operand },
    test: test,
    throwTo: throwTo,
    inspections: 0,
  };
};

const monkeyStartsAt = Array.from(
  { length: lines.length / MONKEY_LINES + 1 },
  (_, i) => i * MONKEY_LINES
);

const round = (monkeys, divide = true) => {
  let newMonkeys = [...monkeys];
  for (let i = 0; i < monkeys.length; i++) {
    let monkey = newMonkeys[i];
    const { itemsAndOwners, inspections } = turn(monkey, divide);
    monkey.items = [];
    itemsAndOwners.forEach(({ worryLevel, newOwner }) => {
      newMonkeys[newOwner].items.push(worryLevel);
    });
    monkey.inspections += inspections;
  }
  return newMonkeys;
};

const round2 = (monkeys, divide = true) => {
  for (let i = 0; i < monkeys.length; i++) {
    let monkey = monkeys[i];
    const { worryLevelsAndOwners, howManyInspections } = turn(monkey, divide);
    monkey.items = [];
    worryLevelsAndOwners.forEach(({ newWorryLevel, newOwner }) => {
      monkeys[newOwner].items.push(newWorryLevel);
    });
    monkey.inspections += howManyInspections;
  }
};

const turn = (monkey, divide = true) => {
  let worryLevelsAndOwners = [];
  let howManyInspections = 0;
  for (const item of monkey.items) {
    howManyInspections++;
    const { newWorryLevel, newOwner } = handleItem(
      item,
      monkey.operation,
      monkey.test,
      monkey.throwTo,
      divide
    );

    worryLevelsAndOwners.push({ newWorryLevel, newOwner });
  }
  return { worryLevelsAndOwners, howManyInspections };
};

// let cachedModulos = ;

// make cachedModulos empty 2d object
let cachedModulos = {};

const handleItem = (item, operation, test, throwTo, divide = true) => {
  const worryLevel = calculateNewWorryLevel(
    item,
    operation.operand,
    operation.operator
  );
  const newWorryLevel = divide ? worryLevel / 3n : worryLevel; // % test;

  const moduloResult = newWorryLevel % test === 0n;
  const throwToIndex = moduloResult ? 0 : 1;
  const newOwner = throwTo[throwToIndex];
  if (moduloResult) {
    const chopped = test * test; // TODO: This is wrong.
    return { newWorryLevel: chopped, newOwner };
  } else return { newWorryLevel, newOwner };
};

const calculateNewWorryLevel = (x, y, op) => {
  if (y === "old") {
    y = x;
  }

  if (op === "*") {
    return BigInt(x) * BigInt(y);
  }
  if (op === "+") {
    return BigInt(x) + BigInt(y);
  }
};

let monkeys = monkeyStartsAt.map((l) => parseMonkey(lines.slice(l, l + 6)));

for (let i = 0; i < 20; i++) {
  round2(monkeys, true);
  console.log("After round ", i + 1);
  monkeys.map((m, i) => console.log("Monkey " + i + ":" + m.items));
}

console.log(
  "inspections",
  monkeys.map((m) => m.inspections)
);

console.log(
  monkeys
    .map((m) => m.inspections)
    .sort(sortDec)
    .slice(0, 2)
    .reduce((acc, curr) => acc * curr, 1)
);

monkeys = monkeyStartsAt.map((l) => parseMonkey(lines.slice(l, l + 6)));

const ROUNDS = 1000;

for (let i = 0; i < ROUNDS; i++) {
  let s = "Round " + i + " execution";
  //console.time(s);
  round2(monkeys, false);
  //console.timeEnd(s);
}

console.log("After round ", ROUNDS);
monkeys.map((m, i) =>
  console.log("Monkey " + i + " inspected " + m.inspections + " items")
);

module.exports = { calculateNewWorryLevel };
