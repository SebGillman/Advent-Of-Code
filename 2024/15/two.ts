import * as fs from "fs/promises";

const file = await fs.readFile("./2024/15/input.txt", { encoding: "utf-8" });

const [gridString, movesString] = file.split("\r\n\r\n");

const grid = gridString.split("\r\n").map((row) => row.split(""));
const moves = movesString.split("\r\n").join("");

const symbolMap: Record<string, [string, string]> = {
  "#": ["#", "#"],
  O: ["[", "]"],
  ".": [".", "."],
  "@": ["@", "."],
};

for (let r = 0; r < grid.length; r++) {
  for (let c = 0; c < grid[0].length; c += 2) {
    const newSymbols = symbolMap[grid[r][c]];
    grid[r].splice(c, 1, ...newSymbols);
  }
}
const rows = grid.length;
const cols = grid[0].length;

const dirMap: Record<string, [number, number]> = {
  "<": [0, -1],
  ">": [0, 1],
  v: [1, 0],
  "^": [-1, 0],
};

let [cr, cc] = [0, 0];

for (let r = 0; r < rows; r++) {
  const row = grid[r];
  if (!row.includes("@")) continue;
  cr = r;
  cc = row.indexOf("@");
}

for (const move of moves) {
  const [dr, dc] = dirMap[move];

  let [nr, nc] = [cr + dr, cc + dc];
  let boxes = 1;
  if (dr == 0) {
    while (grid[nr][nc] == "[" || grid[nr][nc] == "]") {
      [nr, nc] = [nr + dr, nc + dc];
      boxes++;
    }

    if (grid[nr][nc] == "#") continue;

    cr += dr;
    cc += dc;

    for (let i = 0; i < boxes; i++) {
      grid[nr][nc] = grid[nr - dr][nc - dc];
      [nr, nc] = [nr - dr, nc - dc];
    }
    grid[nr][nc] = ".";
  } else {
    const queue: Array<[number, number]> = [[cr, cc]];
    const visited = new Set<string>();
    visited.add([cr, cc].toString());

    const changes: Array<[number, number, string]> = [];
    let wallFound = false;
    while (queue.length) {
      const [cr, cc] = queue.pop()!;

      if (grid[cr][cc] == "[") {
        if (!visited.has([cr, cc + 1].toString())) {
          visited.add([cr, cc + 1].toString());
          queue.push([cr, cc + 1]);
        }
      }

      if (grid[cr][cc] == "]") {
        if (!visited.has([cr, cc - 1].toString())) {
          visited.add([cr, cc - 1].toString());
          queue.push([cr, cc - 1]);
        }
      }
      const nextCell = grid[cr + dr][cc];
      if (nextCell == "#") wallFound = true;
      if (nextCell == "[" || nextCell == "]") {
        if (visited.has([cr + dr, cc].toString())) continue;
        visited.add([cr + dr, cc].toString());
        queue.unshift([cr + dr, cc]);
      }
      changes.unshift([cr, cc, grid[cr][cc]]);
    }
    if (!wallFound) {
      for (const [r, c, element] of changes) {
        grid[r][c] = ".";
        grid[r + dr][c] = element;
      }

      cr += dr;
      cc += dc;
    }
  }
}

let score = 0;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] == "[") score += r * 100 + c;
  }
}

console.log(score);
