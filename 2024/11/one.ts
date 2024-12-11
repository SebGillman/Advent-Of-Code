import * as fs from "fs/promises";

const file = await fs.readFile("./2024/11/input.txt", { encoding: "utf-8" });

const stonesArr: number[] = file.split(" ").map((num) => Number(num));

const memo = new Map<string, number>();

function processStone(stone: number) {
  const stoneString = `${stone}`;
  const stoneLength = stoneString.length;

  if (stone == 0) {
    return [1];
  } else if (stoneLength % 2 == 0) {
    const newStone1 = Number(stoneString.substring(0, stoneLength / 2));
    const newStone2 = Number(stoneString.substring(stoneLength / 2));

    return [newStone1, newStone2];
  } else {
    return [stone * 2024];
  }
}

function afterNBlinks(stone: number, n: number): number {
  if (n == 0) return 1;
  const key = `${stone}:${n}`;
  if (memo.has(key)) return memo.get(key)!;
  const newStones = [...processStone(stone)];

  let res = 0;

  for (const currStone of newStones) {
    res += afterNBlinks(currStone, n - 1);
  }
  memo.set(key, res);
  return res;
}

let res = 0;
stonesArr.forEach((stone) => (res += afterNBlinks(stone, 25)));
console.log(res);
