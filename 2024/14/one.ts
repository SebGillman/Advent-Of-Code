import * as fs from "fs/promises";

const file = await fs.readFile("./2024/14/input.txt", { encoding: "utf-8" });

const lines = file.split("\r\n");

function processLine(line: string) {
  const [pos, vel] = line.split(" ").map((el) => el.substring(2));
  return [pos.split(",").map(Number), vel.split(",").map(Number)];
}

const cols = 101;
const rows = 103;

const midx = (cols - 1) / 2;
const midy = (rows - 1) / 2;

const quads = new Array(4).fill(0);

for (let i = 0; i < lines.length; i++) {
  const [[posx, posy], [velx, vely]] = processLine(lines[i]);
  let [nx, ny] = [(posx + 100 * velx) % cols, (posy + 100 * vely) % rows];

  if (nx < 0) nx += cols;
  if (ny < 0) ny += rows;

  if (ny < midy) {
    if (nx < midx) {
      quads[0]++;
    } else if (nx > midx) {
      quads[1]++;
    }
  } else if (ny > midy) {
    if (nx < midx) {
      quads[2]++;
    } else if (nx > midx) {
      quads[3]++;
    }
  }
}

console.log(quads);

console.log(quads.reduce((curr, next) => curr * next, 1));
