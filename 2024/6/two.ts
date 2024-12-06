import { promises as fs } from "fs";

const file = await fs.readFile("./2024/6/input.txt", { encoding: "utf-8" });

const grid: Array<Array<string>> = file.split("\n").map((row) => row.split(""));

const visualisePlacements = [...grid.map((row) => [...row])];

// get direction and start position
const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

let direction: number;
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

if (position.x === undefined || position.y === undefined) throw new Error();
if (direction! === undefined) throw new Error();

const rows = grid.length;
const cols = grid[0].length;

let score = 1;
grid[position.y][position.x] = "X";

// Setup map to track turning points and the required direction to turn there

const obstructionSet = new Set();

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
      if (potentialLoop(direction, position.x, position.y)) {
        visualisePlacements[ny][nx] = "O";
        obstructionSet.add([nx, ny].toString());
      }
      grid[ny][nx] = "X";
      score++;
    }
    position.x = nx;
    position.y = ny;
  }
}

console.log(visualisePlacements.map((row) => row.join("")).join("\n"));
console.log(obstructionSet);
console.log([...obstructionSet].length);
console.log(score);

// keep track of coords of prev turn points, using map of direction
// at each step

function potentialLoop(direction: number, x: number, y: number) {
  let nextDirection = direction;
  let currX = x;
  let currY = y;

  const placedY = y + directions[direction][0];
  const placedX = x + directions[direction][1];

  const set = new Set<string>();

  while (true) {
    const [dy, dx] = directions[nextDirection];

    const nx = currX + dx;
    const ny = currY + dy;

    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
      return 0;
    }

    if (grid[ny][nx] == "#" || (ny == placedY && nx == placedX)) {
      if (set.has([currX, currY, nextDirection].toString())) return 1;
      set.add([currX, currY, nextDirection].toString());
      nextDirection = (nextDirection + 1) % 4;
      continue;
    }
    currX = nx;
    currY = ny;
  }
}
