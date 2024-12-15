import * as fs from "fs/promises";

const file = await fs.readFile("./2024/15/input.txt", { encoding: "utf-8" });

const [gridString, movesString] = file.split("\r\n\r\n");

const grid = gridString.split("\r\n").map((row) => row.split(""));
const moves = movesString.split("\r\n").join("");

const dirMap: Record<string, [number, number]> = {
  "<": [0, -1],
  ">": [0, 1],
  v: [1, 0],
  "^": [-1, 0],
};

const rows = grid.length;
const cols = grid[0].length;

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
  while (grid[nr][nc] == "O") {
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
}

let score = 0;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    if (grid[r][c] == "O") score += r * 100 + c;
  }
}

console.log(score);
