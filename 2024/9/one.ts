import * as fs from "fs/promises";

const file = await fs.readFile("./2024/9/input.txt", { encoding: "utf-8" });

const data = file.split("").map((el) => parseInt(el));

const parsedData = [];

let dataType = 0;
let id = 0;
for (const block of data) {
  switch (dataType) {
    case 0:
      parsedData.push(...new Array(block).fill(id));
      id++;
      break;
    case 1:
      parsedData.push(...new Array(block).fill("."));
      break;
  }
  dataType = 1 - dataType;
}

let l = 0;
let r = parsedData.length - 1;

while (l < r) {
  const left = parsedData[l];
  if (left != ".") {
    l++;
    continue;
  }
  const right = parsedData[r];
  if (right == ".") {
    r--;
    continue;
  }

  parsedData[l] = parsedData[r];
  parsedData[r] = ".";
}

let checkSum = 0;

for (let i = 0; i < parsedData.length; i++) {
  if (parsedData[i] == ".") break;
  const el = parsedData[i];
  checkSum += el * i;
}

console.log(checkSum);
