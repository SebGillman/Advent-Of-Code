import * as fs from "fs/promises";

const file = await fs.readFile("./2024/10/input.txt", { encoding: "utf-8" });

const grid = file
  .split("\r\n")
  .map((row) => row.split("").map((el) => Number(el)));

const rows = grid.length;
const cols = grid[0].length;

const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const memo = new Map<string, number>();
let res = 0;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] != 0) continue;

    let currPeaks = 0;

    const memoKey = [r, c].toString();
    if (memo.has(memoKey)) continue;

    const queue: Array<[number, number]> = [[r, c]];

    const visited = new Set<string>();

    while (queue.length) {
      const [cr, cc] = queue.pop()!;

      if (grid[cr][cc] == 9) currPeaks++;

      for (const [dr, dc] of directions) {
        const [nr, nc] = [cr + dr, cc + dc];

        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] != 1 + grid[cr][cc]) continue;
        const thisKey = [nr, nc].toString();
        if (visited.has(thisKey)) continue;
        visited.add(thisKey);

        if (memo.has(thisKey)) currPeaks += memo.get(thisKey)!;
        else {
          queue.push([nr, nc]);
        }
      }
    }
    memo.set(memoKey, currPeaks);

    if (grid[r][c] == 0) res += currPeaks;
  }
}
console.log(memo);
console.log(res);
