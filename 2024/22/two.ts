import * as fs from "fs/promises";

const file = await fs.readFile("./2024/22/input.txt", { encoding: "utf-8" });
const starts = file.split("\r\n").map(Number);

const prices: number[][] = [];

//
for (let secret of starts) {
  const getPrice = (number: number) => {
    const numString = `${number}`;
    const finalChar = numString[numString.length - 1];
    return Number(finalChar);
  };
  const priceArr = [getPrice(secret)];

  const mix = (number: number) =>
    (secret = Number(BigInt(secret) ^ BigInt(number)));
  const prune = (number: number) =>
    (secret = ((number % 16777216) + 16777216) % 16777216);

  //
  function generateNext() {
    prune(mix(secret * 64));
    prune(mix(Math.floor(secret / 32)));
    prune(mix(secret * 2048));
  }

  for (let i = 0; i < 2000; i++) {
    generateNext();
    priceArr.push(getPrice(secret));
  }
  prices.push(priceArr);
}

const deltas: number[][] = [];

for (const priceArr of prices) {
  const currDelta = [];
  for (let i = 1; i < priceArr.length; i++) {
    currDelta.push(priceArr[i] - priceArr[i - 1]);
  }
  deltas.push(currDelta);
}

const memo = new Map<string, number>();
for (let index = 0; index < prices.length; index++) {
  const delta = deltas[index];
  const priceList = prices[index];
  for (let p = 0; p < delta.length - 3; p++) {
    const key = `${index},${delta[p]},${delta[p + 1]},${delta[p + 2]},${
      delta[p + 3]
    }`;
    if (memo.has(key)) continue;
    memo.set(key, priceList[p + 4]);
  }
}

console.log("memo made");

let max = Number.MIN_SAFE_INTEGER;

for (let i = -9; i < 10; i++) {
  for (let j = -9; j < 10; j++) {
    for (let k = -9; k < 10; k++) {
      for (let l = -9; l < 10; l++) {
        const totalDiff = i + j + k + l;
        if (totalDiff > 9 || totalDiff < -9) continue;

        let currBananas = 0;
        for (let index = 0; index < prices.length; index++) {
          const key = `${index},${i},${j},${k},${l}`;
          currBananas += memo.get(key) ?? 0;
        }
        max = Math.max(max, currBananas);
      }
    }
  }
}
console.log(max);
