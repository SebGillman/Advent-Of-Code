import * as fs from "fs/promises";

const file = await fs.readFile("./2024/25/input.txt", { encoding: "utf-8" });

const entities = file.split("\r\n\r\n");

const keys = [];
const locks = [];

for (const entity of entities) {
  const entityGrid = entity.split("\r\n").map((row) => row.split(""));
  if (entity.startsWith("#")) {
    const heights = lockEntityToHeights(entityGrid);
    locks.push(heights);
  } else {
    const heights = keyEntityToHeights(entityGrid);
    keys.push(heights);
  }
}

let res = 0;

for (const lock of locks) {
  for (const key of keys) {
    res += key.some((val, i) => lock[i] + val > 5) ? 0 : 1;
  }
}

console.log(res);

function keyEntityToHeights(grid: string[][]) {
  console.log(grid);
  const [rows, cols] = [grid.length, grid[0].length];

  const heights = [];

  for (let c = 0; c < cols; c++) {
    let height = 0;
    for (let r = rows - 2; r >= 0; r--) {
      if (grid[r][c] != "#") break;
      height++;
    }
    heights.push(height);
  }
  return heights;
}
function lockEntityToHeights(grid: string[][]) {
  const [rows, cols] = [grid.length, grid[0].length];

  const heights = [];

  for (let c = 0; c < cols; c++) {
    let height = 0;
    for (let r = 1; r < rows; r++) {
      if (grid[r][c] != "#") break;
      height++;
    }
    heights.push(height);
  }
  return heights;
}
