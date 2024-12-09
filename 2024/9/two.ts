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

let r = parsedData.length - 1;

while (0 < r) {
  const right = parsedData[r];
  if (right == ".") {
    r--;
    continue;
  }

  // get size of r block
  let p = r;
  let rsize = 0;
  while (p >= 0 && parsedData[p] == parsedData[r]) {
    rsize++;
    p--;
  }

  let l = 0;
  while (l < r) {
    const left = parsedData[l];
    if (left != ".") {
      l++;
      continue;
    }

    if (l == r) break;

    // get size of r block
    let q = l;
    let lsize = 0;
    while (q < r && parsedData[q] == ".") {
      lsize++;
      q++;
    }

    if (lsize >= rsize) {
      parsedData.splice(l, rsize, ...parsedData.slice(r - rsize + 1, r + 1));
      parsedData.splice(r - rsize + 1, rsize, ...new Array(rsize).fill("."));
      break;
    }
    l++;
  }
  r -= rsize;
}

let checkSum = 0;

for (let i = 0; i < parsedData.length; i++) {
  if (parsedData[i] == ".") continue;
  const el = parsedData[i];
  checkSum += el * i;
}

console.log(checkSum);
