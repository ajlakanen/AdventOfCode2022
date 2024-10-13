const { newWorryLevel } = require("./11-2.js");

// Test newWorryLevel function
console.log(newWorryLevel(79, 19, "*") === BigInt(1501));
console.log(newWorryLevel(98, 19, "*") === BigInt(1862));
console.log(newWorryLevel(54, 6, "+") === BigInt(60));
console.log(newWorryLevel(79, "old", "*") === BigInt(6241));
console.log(newWorryLevel(60, "old", "*") === BigInt(3600));
console.log(newWorryLevel(74, 3, "+") === BigInt(77));
