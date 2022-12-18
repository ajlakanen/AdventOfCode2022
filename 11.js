const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("11-data-mini.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

const sortDec = (a, b) => {
  return parseInt(b) - parseInt(a);
};

const MONKEY_LINES = 7;

const newWorryLevel = (x, y, op) => {
  if (y === "old") y = x;
  if (op === "*") return x * y;
  if (op === "+") return x + y;
};

const parseMonkey = (lines) => {
  const items = lines[1]
    .split(":")[1]
    .split(",")
    .map((item) => parseInt(item));
  let [operator, operand] = lines[2].split(" ").slice(-2);
  operand = isNaN(operand) ? "old" : parseInt(operand);

  const test = parseInt(lines[3].split(" ").slice(-1));
  const throwTo = [parseInt(lines[4].slice(-1)), parseInt(lines[5].slice(-1))];
  return {
    items: items,
    operation: { operator: operator, operand: operand },
    test: test,
    throwTo: throwTo,
    inspections: 0,
  };
};

const round = (monkeys, divide = true) => {
  for (let i = 0; i < monkeys.length; i++) {
    const monkey = monkeys[i];
    //console.log(monkey.items);
    //console.log(monkey.inspections);
    const itemsAndOwners = turn(monkey, divide);
    monkey.items = [];
    itemsAndOwners.forEach(({ worryLevel, newOwner }) => {
      monkeys[newOwner].items.push(worryLevel);
    });
  }
};

const turn = (monkey, divide = true) => {
  let itemsAndOwners = [];
  for (const item in monkey.items) {
    monkey.inspections++;
    const { worryLevel, newOwner } = handleItem(
      monkey.items[item],
      monkey.operation,
      monkey.test,
      monkey.throwTo,
      divide
    );
    itemsAndOwners.push({ worryLevel, newOwner });
  }
  return itemsAndOwners;
};

const handleItem = (item, operation, test, throwTo, divide = true) => {
  const worryLevel = newWorryLevel(item, operation.operand, operation.operator);
  const newLevel = divide ? Math.floor(worryLevel / 3) : worryLevel; // % test;
  const newOwner = newLevel % test === 0 ? throwTo[0] : throwTo[1];
  return { worryLevel: newLevel, newOwner: newOwner };
};

const monkeyStartsAt = Array.from(
  { length: lines.length / MONKEY_LINES + 1 },
  (_, i) => i * MONKEY_LINES
);

let monkeys = monkeyStartsAt.map((l) => parseMonkey(lines.slice(l, l + 6)));

for (let i = 0; i < 20; i++) round(monkeys, true);

console.log(
  monkeys
    .map((m) => m.inspections)
    .sort(sortDec)
    .slice(0, 2)
    .reduce((acc, curr) => acc * curr, 1)
);

monkeys = monkeyStartsAt.map((l) => parseMonkey(lines.slice(l, l + 6)));

for (let i = 0; i < 1000; i++) round(monkeys, false);

console.log(monkeys.map((m) => m.inspections).sort(sortDec));

//console.log(monkeys);

console.log(
  monkeys
    .map((m) => m.inspections)
    .sort(sortDec)
    .slice(0, 2)
    .reduce((acc, curr) => acc * curr, 1)
);
