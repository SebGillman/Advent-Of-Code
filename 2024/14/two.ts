import * as fs from "fs/promises";

const file = await fs.readFile("./2024/14/input.txt", { encoding: "utf-8" });

const lines = file.split("\r\n");

function processLine(line: string) {
  const [pos, vel] = line.split(" ").map((el) => el.substring(2));
  return [pos.split(",").map(Number), vel.split(",").map(Number)];
}

const cols = 101;
const rows = 103;

let maxIslandSize = 0;
let maxGrid = "";
let maxIter = 0;

for (let iter = 0; iter < 100000; iter++) {
  const grid = Array.from({ length: rows }, () => new Array(cols).fill("."));
  for (let i = 0; i < lines.length; i++) {
    const [[posx, posy], [velx, vely]] = processLine(lines[i]);
    let [nx, ny] = [(posx + iter * velx) % cols, (posy + iter * vely) % rows];

    if (nx < 0) nx += cols;
    if (ny < 0) ny += rows;

    grid[ny][nx] = "X";
  }

  const islands = countIslands(grid);
  if (islands > maxIslandSize) {
    maxIslandSize = islands;
    maxGrid = grid.map((row) => row.join("")).join("\n");
    maxIter = iter;
  }
}

function countIslands(grid: Array<Array<string>>) {
  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  let maxIslandSize = 0;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] == ".") continue;
      if (visited[y][x] == 1) continue;
      visited[y][x] = 1;
      const queue = [[x, y]];
      let currIslandSize = 0;

      while (queue.length) {
        const [cx, cy] = queue.pop()!;
        currIslandSize++;

        for (const [dx, dy] of directions) {
          const [nx, ny] = [cx + dx, cy + dy];

          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          if (grid[ny][nx] == ".") continue;
          if (visited[ny][nx] == 1) continue;
          visited[ny][nx] = 1;

          queue.push([nx, ny]);
        }
      }
      maxIslandSize = Math.max(maxIslandSize, currIslandSize);
    }
  }
  return maxIslandSize;
}

console.log(maxGrid);
console.log(maxIslandSize);
console.log(maxIter);
