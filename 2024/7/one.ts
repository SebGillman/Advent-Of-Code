import * as fs from "fs/promises";
import test from "node:test";

const file = await fs.readFile("./2024/7/input.txt", { encoding: "utf-8" });

const lines = file.split("\r\n");

let res = 0;

let numbers: Array<number> = [];
let testVal: number;

function possibleOperators(curr: number, index: number): boolean {
  if (curr > testVal) return false;
  if (index == numbers.length) return curr == testVal;

  return (
    possibleOperators(curr + numbers[index], index + 1) ||
    possibleOperators(curr * numbers[index], index + 1)
  );
}

for (const line of lines) {
  const [testValString, numString] = line.split(": ");
  testVal = parseInt(testValString);
  numbers = numString.split(" ").map((num) => parseInt(num));

  //   console.log(testVal, numbers);
  if (possibleOperators(0, 0)) res += testVal;
}

console.log(res);
