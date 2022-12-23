const f = require("fs");

let lines = [];

// read the data
const dataRaw = f.readFileSync("11-data-mini.txt", "utf-8");
dataRaw.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

const sortDec = (a, b) => {
  return b - a;
};

const MONKEY_LINES = 7;

const newWorryLevel = (x, y, op) => {
  if (y === "old") {
    //console.log("before old assignment", y, x);
    y = x;
    //console.log("old assignment done", y, x);
  }

  if (op === "*") {
    //console.log(x, "*", y, BigInt(x) * BigInt(y));
    return BigInt(x) * BigInt(y);
  }
  if (op === "+") {
    //console.log(x, "+", y, BigInt(x) + BigInt(y));
    return BigInt(x) + BigInt(y);
  }
};

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

const round = (monkeys, divide = true) => {
  let newMonkeys = [...monkeys];
  //console.log("newMonkeys", newMonkeys);
  for (let i = 0; i < monkeys.length; i++) {
    let monkey = newMonkeys[i];
    //console.log(monkey.items);
    // console.log("monkey ", i);
    const { itemsAndOwners, inspections } = turn(monkey, divide);
    monkey.items = [];
    //monkey = { ...monkey, items: [] };
    itemsAndOwners.forEach(({ worryLevel, newOwner }) => {
      newMonkeys[newOwner].items.push(worryLevel);
    });
    monkey.inspections += inspections;
    //newMonkeys.push(monkey);
    //console.log(
    //  `monkey ${i} made ${inspections} inspections, now has `,
    //  monkey.inspections
    //);
  }
  return newMonkeys;
};

const turn = (monkey, divide = true) => {
  let itemsAndOwners = [];
  let inspections = 0;
  for (const item in monkey.items) {
    inspections++;
    //console.log(monkey.throwTo);
    const { worryLevel, newOwner } = handleItem(
      monkey.items[item],
      monkey.operation,
      monkey.test,
      monkey.throwTo,
      divide
    );
    itemsAndOwners.push({ worryLevel, newOwner });
  }
  return { itemsAndOwners: itemsAndOwners, inspections: inspections };
};

const handleItem = (item, operation, test, throwTo, divide = true) => {
  const worryLevel = newWorryLevel(item, operation.operand, operation.operator);
  //console.log(worryLevel);
  //const newLevel = divide
  //  ? BigInt(Math.floor(worryLevel / 3n))
  //  : BigInt(worryLevel); // % test;
  console.log(
    "BigInt(worryLevel)",
    BigInt(worryLevel),
    "BigInt(test)",
    BigInt(test),
    "BigInt(worryLevel) % BigInt(test)",
    BigInt(worryLevel) % BigInt(test)
  );
  const newOwner =
    BigInt(worryLevel) % BigInt(test) === 0 ? throwTo[0] : throwTo[1];
  return { worryLevel: worryLevel, newOwner: newOwner };
};

const monkeyStartsAt = Array.from(
  { length: lines.length / MONKEY_LINES + 1 },
  (_, i) => i * MONKEY_LINES
);

let monkeys = monkeyStartsAt.map((l) => parseMonkey(lines.slice(l, l + 6)));

for (let i = 0; i < 1; i++) round(monkeys, true);

//console.log(
//  "? ",
//  monkeys
//    .map((m) => m.inspections)
//    .sort(sortDec)
//    .slice(0, 2)
//    .reduce((acc, curr) => acc * curr, 1)
//);

monkeys = monkeyStartsAt.map((l) => parseMonkey(lines.slice(l, l + 6)));
console.log(monkeys.length);

for (let i = 0; i < 1; i++) {
  monkeys = round(monkeys, false);

  //console.log(
  //  i,
  //  monkeys.map((m) => m.inspections),
  //  monkeys.map((m) => m.items.length),
  //  monkeys.reduce((acc, curr) => acc + curr.inspections, 0)
  //);
}

console.log(
  "inspections",
  monkeys.map((m) => m.inspections)
); //.sort(sortDec));

//console.log(monkeys);

console.log(
  monkeys
    .map((m) => m.inspections)
    //.sort(sortDec)
    .slice(0, 2)
    .reduce((acc, curr) => acc * curr, 1)
);
