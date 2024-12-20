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

const distTo = Array.from({ length: rows }, () =>
  new Array(cols).fill(Number.MAX_SAFE_INTEGER)
);
const distFrom = Array.from({ length: rows }, () =>
  new Array(cols).fill(Number.MAX_SAFE_INTEGER)
);

function minPathFromTo(
  grid: Array<Array<string>>,
  sr: number,
  sc: number,
  set: any[][]
) {
  const queue: Array<[number, number, number]> = [[sr, sc, 0]];

  const visited = new Set<string>();
  visited.add([sr, sc].toString());
  set[sr][sc] = 0;

  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  while (queue.length) {
    const [cr, cc, length] = queue.pop()!;

    for (const [dr, dc] of directions) {
      const [nr, nc] = [cr + dr, cc + dc];

      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (grid[nr][nc] == "#") continue;
      const key = [nr, nc].toString();
      if (visited.has(key)) continue;
      visited.add(key);
      set[nr][nc] = Math.min(set[nr][nc], length + 1);

      queue.unshift([nr, nc, length + 1]);
    }
  }
}

minPathFromTo(grid, sr, sc, distTo);
minPathFromTo(grid, er, ec, distFrom);

const baseline = distTo[er][ec];

function cheatEnds(grid: string[][], skips: number, sr: number, sc: number) {
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const cheatEnds = new Map<string, number>();

  const queue = [[sr, sc, 0]];
  const visited = new Set<string>();
  visited.add([sr, sc].toString());

  while (queue.length) {
    const [cr, cc, currSkip] = queue.pop()!;
    if (currSkip >= skips) continue;
    for (const [dr, dc] of directions) {
      const [nr, nc] = [cr + dr, cc + dc];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;

      const key = [nr, nc].toString();
      if (visited.has(key)) continue;
      visited.add(key);
      if (grid[nr][nc] != "#") {
        cheatEnds.set(
          JSON.stringify([nr, nc]),
          Math.min(
            currSkip + 1,
            cheatEnds.get(JSON.stringify([nr, nc])) ?? Number.MAX_SAFE_INTEGER
          )
        );
      }
      queue.unshift([nr, nc, currSkip + 1]);
    }
  }
  return cheatEnds;
}

const lowerThan = baseline - 100;
let res = 0;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] == "#") continue;
    const startScore = distTo[r][c];
    if (startScore > lowerThan) continue;

    const cheats = cheatEnds(grid, 20, r, c);
    cheats.forEach((dist, key) => {
      const [er, ec] = JSON.parse(key);
      // console.log(startScore, dist, distFrom[er][ec], lowerThan);
      if (startScore + dist + distFrom[er][ec] <= lowerThan) {
        res++;
      }
    });
  }
}
console.log(res);
