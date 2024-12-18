import * as fs from "fs/promises";

const file = await fs.readFile("./2024/18/input.txt", { encoding: "utf-8" });

const coords = file.split("\r\n").map((row) => row.split(",").map(Number));

const [rows, cols] = [71, 71];

function findBlockingByte() {
  const grid: string[][] = Array.from({ length: rows }, () =>
    new Array(cols).fill(".")
  );

  let res = 0;
  for (const [x, y] of coords) {
    grid[y][x] = "#";
    const pathLength = shortestPath(grid);
    if (pathLength == -1) return coords[res];
    res++;
  }
  return coords[res];
}

function shortestPath(grid: string[][]): number {
  let res = Number.MAX_SAFE_INTEGER;

  const [sx, sy] = [0, 0];
  const [ex, ey] = [cols - 1, rows - 1];

  const queue = [[sx, sy, 0]];
  const visited = new Set<string>();
  visited.add([sx, sy].toString());

  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  while (queue.length) {
    const [cx, cy, length] = queue.shift()!;

    if (cx == ex && cy == ey) return length;

    for (const [dx, dy] of directions) {
      const [nx, ny] = [cx + dx, cy + dy];
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      if (grid[ny][nx] == "#") continue;
      const key = [nx, ny].toString();
      if (visited.has(key)) continue;
      visited.add(key);

      queue.push([nx, ny, length + 1]);
    }
  }

  return -1;
}

const res = findBlockingByte();

console.log(res.join(","));
