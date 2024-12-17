import * as fs from "fs/promises";

const file = await fs.readFile("./2024/17/input.txt", { encoding: "utf-8" });

const [registerString, instructionString] = file.split("\r\n\r\n");

const registers = registerString
  .split("\r\n")
  .map((el) => Number(el.slice(12)));
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

let currIndex = 0;
const outputBuffer: number[] = [];

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
    const res = operand1 ^ operand2;
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
    const res = operand1 ^ operand2;
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

while (currIndex < instructions.length - 1) {
  operatorMap[instructions[currIndex]](currIndex + 1);
}

console.log(outputBuffer.join(","));
