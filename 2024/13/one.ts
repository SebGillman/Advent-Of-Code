import * as fs from "fs/promises";

const file = await fs.readFile("./2024/13/input.txt", { encoding: "utf-8" });

const machines = file.split("\r\n\r\n");

const buttonCosts = [3, 1];
let tokens = 0;

function dp(
  moves: Array<[number, number, number]>,
  rem: [number, number]
): null | number {
  let cost: number | null = null;

  const [tx, ty] = rem;
  if (tx == 0 && ty == 0) return 0;
  if (!moves.length) return Number.MAX_VALUE;
  if (moves.length == 1) {
    const [btnCost, dx, dy] = moves[0];
    return tx % dx == 0 && ty % dy == 0 && tx / dx == ty / dy
      ? (btnCost * ty) / dy
      : Number.MAX_VALUE;
  }

  for (let i = 0; i < moves.length; i++) {
    const [btnCost, dx, dy] = moves[i];

    const otherMoves = [...moves.slice(0, i), ...moves.slice(i + 1)];

    let [cx, cy] = [0, 0];
    let currCost = 0;
    for (let j = 0; j < 100; j++) {
      cx += dx;
      cy += dy;
      currCost += btnCost;

      const restCost = dp(otherMoves, [tx - cx, ty - cy]);

      if (!cost) {
        cost = (restCost ?? Number.MAX_VALUE) + currCost;
      } else {
        cost = Math.min(cost, (restCost ?? Number.MAX_VALUE) + currCost);
      }
    }
  }

  return cost;
}

for (const machine of machines) {
  const lines = machine.split("\r\n").map((line, index: number) => {
    const [_, xy] = line.split(": ");
    return xy
      .split(", ")
      .map((el: string) =>
        Number(index == 2 ? el.substring(2) : el.substring(1))
      );
  });
  const target = lines[2] as [number, number];

  const moves = lines
    .slice(0, 2)
    .map((el, index) => [buttonCosts[index], ...el]) as Array<
    [number, number, number]
  >;

  const res = dp(moves, target);
  if (res != Number.MAX_VALUE && res) tokens += res;
}
console.log(tokens);
