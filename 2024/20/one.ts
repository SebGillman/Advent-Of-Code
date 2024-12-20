import * as fs from "fs/promises";

const file = await fs.readFile("./2024/20/input.txt", { encoding: "utf-8" });

const grid = file.split("\r\n").map((row) => row.split(""));

const [rows, cols] = [grid.length, grid[0].length];

let [sr, sc] = [0, 0];
let [er, ec] = [0, 0];

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] == "S") [sr, sc] = [r, c];
    if (grid[r][c] == "E") [er, ec] = [r, c];
  }
}

function minPath(
  gridMaster: Array<Array<string>>,
  skipr?: number,
  skipc?: number
) {
  const grid = Array.from({ length: rows }, (_, i) => [...gridMaster[i]]);
  if (skipr && skipc) grid[skipr][skipc] = ".";
  const queue: Array<[number, number, number]> = [[sr, sc, 0]];

  const visited = new Set<string>();
  visited.add([sr, sc, 0].toString());

  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  let minPath = Number.MAX_VALUE;
  let minPathCount = 0;

  while (queue.length) {
    const [cr, cc, length] = queue.pop()!;

    if (cr == er && cc == ec) {
      if (length < minPath) {
        minPath = length;
        minPathCount = 1;
      } else if (length == minPath) {
        minPathCount++;
      }
    }

    for (const [dr, dc] of directions) {
      const [nr, nc] = [cr + dr, cc + dc];

      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] == "#") continue;
      const key = [nr, nc].toString();
      if (visited.has(key)) continue;
      visited.add(key);

      queue.unshift([nr, nc, length + 1]);
    }
  }
  return [minPath, minPathCount];
}

const [baseline, baselineCount] = minPath(grid);
let res = 0;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] != "#") continue;

    const [shortPath, shortPathCount] = minPath(grid, r, c);
    if (baseline - shortPath >= 100) res += shortPathCount;
  }
}

console.log(res);
