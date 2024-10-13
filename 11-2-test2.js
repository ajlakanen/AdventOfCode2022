const ROUNDS = 10000;

//const bigNumber = BigInt(7).reduce((acc, _) => acc * 10n, 1n);

// create a big number by multiplying 7 by 11 1000 times
let bigNumber = BigInt(7);
for (let i = 0; i < 10000; i++) {
  bigNumber *= 11n;
}

console.log("bigNumber digits", bigNumber.toString().length);
console.time("bigint division");
for (let i = 0; i < ROUNDS; i++) {
  const div = bigNumber / BigInt(21);
}
console.timeEnd("bigint division");

console.time("bigint modulo");
for (let i = 0; i < ROUNDS; i++) {
  const mod = bigNumber % BigInt(21);
}
console.timeEnd("bigint modulo");

// chop numbers for bigNumber so that it has only digits it needs to be able to divide by 21
const choppedNumber = bigNumber.toString().slice(0, 100);
console.log("choppedNumber digits", choppedNumber.length);

console.time("bigint division");
for (let i = 0; i < ROUNDS; i++) {
  const div = BigInt(choppedNumber) / BigInt(21);
}
console.timeEnd("bigint division");

console.time("bigint modulo");
for (let i = 0; i < ROUNDS; i++) {
  const mod = BigInt(choppedNumber) % BigInt(21);
}
console.timeEnd("bigint modulo");
