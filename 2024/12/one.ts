import * as fs from "fs/promises";

const file = await fs.readFile("./2024/12/input.txt", { encoding: "utf-8" });

const grid = file.split("\r\n").map((row) => row.split(""));

const rows = grid.length;
const cols = grid[0].length;

const visited = Array.from({ length: rows }, () => new Array(cols).fill(0));
const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

let score = 0;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (visited[r][c] != 0) continue;

    visited[r][c] = 1;

    const queue: Array<[number, number]> = [[r, c]];
    const currSymbol = grid[r][c];

    let perimeter = 0;
    let area = 0;

    while (queue.length) {
      const [cr, cc] = queue.pop()!;
      area++;

      for (const [dr, dc] of directions) {
        const [nr, nc] = [cr + dr, cc + dc];

        if (
          nr < 0 ||
          nc < 0 ||
          nr >= rows ||
          nc >= cols ||
          grid[nr][nc] != currSymbol
        ) {
          perimeter++;
          continue;
        }
        if (visited[nr][nc] != 0) continue;

        visited[nr][nc] = 1;

        queue.unshift([nr, nc]);
      }
    }
    score += area * perimeter;
  }
}

console.log(score);
