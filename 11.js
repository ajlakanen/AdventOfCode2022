const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("data/11-data.txt", "utf-8");
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

const leastCommonMultiple = (numbers) => {
  // convert big ints to numbers
  numbers = numbers.map((n) => parseInt(n));
  let max = Math.max(...numbers);
  let lcm = max;
  while (true) {
    if (numbers.every((n) => lcm % n === 0)) {
      return lcm;
    }
    lcm += max;
  }
};

const monkeyStartsAt = Array.from(
  { length: lines.length / MONKEY_LINES + 1 },
  (_, i) => i * MONKEY_LINES
);

const round = (monkeys, divide = true) => {
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

const handleItem = (item, operation, test, throwTo, divide = true) => {
  const worryLevel = calculateNewWorryLevel(
    item,
    operation.operand,
    operation.operator
  );
  const newWorryLevel = divide ? worryLevel / 3n : worryLevel;

  const moduloResult = newWorryLevel % test === 0n;
  const throwToIndex = moduloResult ? 0 : 1;
  const newOwner = throwTo[throwToIndex];
  if (moduloResult) {
    return { newWorryLevel: newWorryLevel % LCM, newOwner };
  } else return { newWorryLevel, newOwner };
};

const calculateNewWorryLevel = (x, y, op) => {
  if (y === "old") {
    y = x;
  }

  if (op === "*") {
    return x * y;
  }
  if (op === "+") {
    return x + y;
  }
};

// part 1
let monkeys = monkeyStartsAt.map((l) => parseMonkey(lines.slice(l, l + 6)));

const LCM = BigInt(leastCommonMultiple(monkeys.map((m) => m.test)));

for (let i = 0; i < 20; i++) {
  round(monkeys, true);
}

console.log(
  monkeys
    .map((m) => m.inspections)
    .sort(sortDec)
    .slice(0, 2)
    .reduce((acc, curr) => acc * curr, 1)
);

// part 2
monkeys = monkeyStartsAt.map((l) => parseMonkey(lines.slice(l, l + 6)));

const ROUNDS = 10000;
for (let i = 0; i < ROUNDS; i++) {
  round(monkeys, false);
}

console.log(
  monkeys
    .map((m) => m.inspections)
    .sort(sortDec)
    .slice(0, 2)
    .reduce((acc, curr) => acc * curr, 1)
);

module.exports = { calculateNewWorryLevel };
