import * as fs from "fs/promises";

const file = await fs.readFile("./2024/17/input.txt", { encoding: "utf-8" });

const [registerString, instructionString] = file.split("\r\n\r\n");

let registers = registerString.split("\r\n").map((el) => Number(el.slice(12)));
const instructions = instructionString.slice(9).split(",").map(Number);

const comboMap: Record<number, () => number> = {
  0: () => 0,
  1: () => 1,
  2: () => 2,
  3: () => 3,
  4: () => registers[0],
  5: () => registers[1],
  6: () => registers[2],
};

let outputBuffer: number[] = [];
let currIndex = 0;

const operatorMap: Record<number, (i: number) => void> = {
  0: (i: number) => {
    // adv
    const numberator = registers[0];
    const denominator = 2 ** comboMap[instructions[i]]();
    const res = Math.floor(numberator / denominator);
    registers[0] = res;
    currIndex += 2;
  },
  1: (i: number) => {
    // bxl
    const operand1 = registers[1];
    const operand2 = instructions[i];
    const res = Number(BigInt(operand1) ^ BigInt(operand2));
    registers[1] = res;
    currIndex += 2;
  },
  2: (i: number) => {
    // bst
    const res = comboMap[instructions[i]]() % 8;
    registers[1] = res;
    currIndex += 2;
  },
  3: (i: number) => {
    // jnz
    const registerA = registers[0];
    if (registerA == 0) {
      currIndex += 2;
      return;
    }
    currIndex = instructions[i];
  },
  4: (i: number) => {
    // bxc
    const operand1 = registers[1];
    const operand2 = registers[2];
    const res = Number(BigInt(operand1) ^ BigInt(operand2));
    registers[1] = res;
    currIndex += 2;
  },
  5: (i: number) => {
    // out
    const res = comboMap[instructions[i]]() % 8;
    outputBuffer.push(res);
    currIndex += 2;
  },
  6: (i: number) => {
    // bdv
    const numberator = registers[0];
    const denominator = 2 ** comboMap[instructions[i]]();
    const res = Math.floor(numberator / denominator);
    registers[1] = res;
    currIndex += 2;
  },
  7: (i: number) => {
    // cdv
    const numberator = registers[0];
    const denominator = 2 ** comboMap[instructions[i]]();
    const res = Math.floor(numberator / denominator);
    registers[2] = res;
    currIndex += 2;
  },
};

let registerA = 0;
const registerCopy = [...registers];
// while (true) {

function pass(A: number, nLast: number) {
  outputBuffer = [];
  currIndex = 0;
  registers = registerCopy;
  registers[0] = A;

  while (currIndex < instructions.length - 1) {
    operatorMap[instructions[currIndex]](currIndex + 1);
  }
  return outputBuffer.toString() == instructions.slice(-1 - nLast).toString();
}

function dp(decimal: string, index: number): number {
  if (index == instructions.length) {
    return parseInt(decimal, 2);
  }

  let minNum = Number.MAX_SAFE_INTEGER;
  let successFound = false;

  for (let i = 0; i < 8; i++) {
    // bxc => b= b^(a/2**b)
    // 6,
    // 1, bxl => b = b^100
    const a = parseInt(decimal + i.toString(2).padStart(3, "0"), 2);
    if (!pass(a, index)) continue;
    const currNum = dp(decimal + i.toString(2).padStart(3, "0"), index + 1);
    successFound = true;
    minNum = Math.min(minNum, currNum);
  }

  return minNum;
}

console.log(dp("", 0));

// 2, bst => b = a % 8   3 LSB
// 4,
// 1, adv => a = a/2**c (ratio between a and ratio between last a and last 3LSB)
// 6,
// 7, cdv => c = a/2**b (ratio between 345th LSB and 012 LSB) (ratio between a and 3LSB)
// 5,
// 4, bxc => b= b^(a/2**b)
// 6,
// 1, bxl => b = b^100  4
// 4,
// 5, out => b%8
// 5,
// 0, adv => a = a/8
// 3,
// 3, jmp => 0
// 0;
