import * as fs from "fs";

const file = fs.createReadStream("./1/input.txt");

const arr1: number[] = [];
const arr2: number[] = [];

let finalLine = "";

file.on("data", (chunk) => {
  const lines: string[] = (finalLine + chunk).split("\r\n");
  lines.slice(0, -1).forEach((line: string) => {
    const split: string[] = line.split(" ");
    arr1.push(parseInt(split[0]));
    arr2.push(parseInt(split[split.length - 1]));
  });
  finalLine = lines[lines.length - 1];
});

file.on("end", () => {
  const split: string[] = finalLine.split(" ");
  arr1.push(parseInt(split[0]));
  arr2.push(parseInt(split[split.length - 1]));

  let score = 0;

  const counter = new Map<number, number>();
  for (let i = 0; i < arr2.length; i++) {
    const currNum = arr2[i];
    counter.set(currNum, (counter.get(currNum) ?? 0) + 1);
  }
  for (let i = 0; i < arr2.length; i++) {
    const currNum = arr1[i];
    score += currNum * (counter.get(currNum) ?? 0);
  }
  console.log(score);
});
