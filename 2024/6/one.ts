import { promises as fs } from "fs";

const file = await fs.readFile("./2024/6/input.txt", { encoding: "utf-8" });

const grid: Array<Array<string>> = file.split("\n").map((row) => row.split(""));

// get direction and start position
const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

let direction;
const position: { [key: string]: number } = {};

function findGuard(symbol: string, row: Array<string>) {
  position.y = rowIndex;
  position.x = row.indexOf(symbol);
}

let rowIndex = 0;
for (const row of grid) {
  if (row.includes("^")) {
    direction = 0;
    findGuard("^", row);
    break;
  } else if (row.includes(">")) {
    direction = 1;
    findGuard(">", row);
    break;
  } else if (row.includes("v")) {
    direction = 2;
    findGuard("v", row);
    break;
  } else if (row.includes("<")) {
    direction = 3;
    findGuard("<", row);
    break;
  } else {
    rowIndex++;
  }
}
console.log(position, direction);

if (position.x === undefined || position.y === undefined) throw new Error();
if (direction === undefined) throw new Error();

const rows = grid.length;
const cols = grid[0].length;

let score = 1;
grid[position.y][position.x] = "X";

while (true) {
  const [dy, dx] = directions[direction];
  const nx: number = position.x + dx;
  const ny: number = position.y + dy;

  if (0 > nx || nx >= cols || 0 > ny || ny >= rows) {
    break;
  }

  const nextTile = grid[ny][nx];
  if (nextTile == "#") {
    direction = (direction + 1) % 4;
  } else {
    if (nextTile == ".") {
      score++;
      grid[ny][nx] = "X";
    }
    position.x = nx;
    position.y = ny;
  }
}

console.log(grid.map((row) => row.join("")).join("\n"));
console.log(score);
