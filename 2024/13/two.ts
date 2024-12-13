import * as fs from "fs/promises";

const file = await fs.readFile("./2024/13/input.txt", { encoding: "utf-8" });

const machines = file.split("\r\n\r\n");

const buttonCosts = [3, 1];
let tokens = 0;

for (const machine of machines) {
  const lines = machine.split("\r\n").map((line, index: number) => {
    const [_, xy] = line.split(": ");
    return xy
      .split(", ")
      .map(
        (el: string) =>
          (index == 2 ? 10000000000000 : 0) +
          Number(index == 2 ? el.substring(2) : el.substring(1))
      );
  });

  const [tx, ty] = lines[2];

  const moves = lines.slice(0, 2);
  // [x1 x2] [a] = [tx]
  // [y1 y2] [b] = [ty]

  // [a] =     1     [y2 -x2] [tx]
  // [b] = x1y2-x2y1 [-y1 x1] [ty]

  const [x1, y1] = moves[0];
  const [x2, y2] = moves[1];

  // console.log(moves, [tx, ty]);

  const det = x1 * y2 - y1 * x2;

  if (det == 0) continue;

  const a = Math.round((1 / det) * (y2 * tx - x2 * ty) * 100) / 100;
  const b = Math.round((1 / det) * (x1 * ty - y1 * tx) * 100) / 100;

  if (a % 1 != 0 || b % 1 != 0) continue;

  tokens += a * 3 + b;
}
console.log(tokens);
