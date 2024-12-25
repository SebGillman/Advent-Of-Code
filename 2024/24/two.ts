import { copyFileSync } from "fs";
import * as fs from "fs/promises";

const file = await fs.readFile("./2024/24/input.txt", { encoding: "utf-8" });

const [startString, gateString] = file.split("\r\n\r\n");

const nodeMapMaster = new Map<string, number>();

startString.split("\r\n").forEach((start) => {
  const [node, value] = start.split(": ");
  nodeMapMaster.set(node, Number(value));
});

const gates = gateString.split("\r\n").map((row) => row.split(" ")) as Array<
  [string, "AND" | "XOR" | "OR", string, string, string]
>;

const inputs: Array<[number, number]> = [
  [43, 4],
  [60, 15],
  // [1, 3],
  [500, 1656],
  // [1111111, 1933395],
  [23347222, 34267497],
  [1, 111111111111],
];

const outputs = [];

const limit = 2 ** 45 - 1;

if (inputs.some(([x, y]) => x > limit || y > limit))
  throw new Error("AAAAAAAAAH");

const gateOperations = {
  AND: (val1: number, val2: number) => {
    return val1 & val2;
  },
  OR: (val1: number, val2: number) => {
    return val1 | val2;
  },
  XOR: (val1: number, val2: number) => {
    return val1 ^ val2;
  },
};

const visitedCombos = new Set<string>();
const res = getSwap(inputs, 0, [], 0); //.filter((item) => item.length > 0);
console.log(res, res.flat().sort().join(","));

function swap(p1: number, p2: number) {
  const temp = gates[p2][4];
  gates[p2][4] = gates[p1][4];
  gates[p1][4] = temp;
}

function getSwap(
  inputs: [number, number][],
  pairs: number,
  seen: string[][],
  startIndex: number
): string[][] {
  // console.log(pairs, seen, ...seen);

  if (pairs == 4) {
    return check(inputs, gates) ? seen : [];
  }

  // key represents current swaps
  const key = seen
    .sort()
    .map((el) => "[" + el.toString() + "]")
    .toString();
  if (visitedCombos.has(key)) return [];
  visitedCombos.add(key);

  const swappedWires = new Set(seen.flat());

  const resArr: string[][][] = [];

  for (let p1 = startIndex; p1 < gates.length - 1; p1++) {
    for (let p2 = p1 + 1; p2 < gates.length; p2++) {
      if (swappedWires.has(gates[p1][4]) || swappedWires.has(gates[p2][4]))
        continue;
      const res = [...seen, [gates[p1][4], gates[p2][4]].sort()];
      const nextKey = res
        .sort()
        .map((el) => "[" + el.toString() + "]")
        .toString();
      // if this next swap has been inspected skip
      if (visitedCombos.has(nextKey)) {
        continue;
      }
      swap(p1, p2);
      // visitedCombos.add(nextKey);
      const gateList = getSwap(inputs, pairs + 1, res, p2 + 1);
      if (gateList.length > 0) return gateList;
      swap(p1, p2);
    }
  }

  return [];
}

function check(
  inputs: [number, number][],
  gatesMaster: Array<[string, "AND" | "XOR" | "OR", string, string, string]>
) {
  for (const [x, y] of inputs) {
    const gates = JSON.parse(JSON.stringify(gatesMaster)) as Array<
      [string, "AND" | "XOR" | "OR", string, string, string]
    >;
    const nodeMap = new Map<string, number>();

    const xBin = x.toString(2).padStart(46, "0");
    const yBin = y.toString(2).padStart(46, "0");

    const expectedAns = x + y;

    for (let i = 0; i < 46; i++) {
      const indexStr = `${i}`.padStart(2, "0");

      nodeMap.set(`x${indexStr}`, Number(xBin[xBin.length - 1 - i]));
      nodeMap.set(`y${indexStr}`, Number(yBin[yBin.length - 1 - i]));
    }

    const seenSinceRemoval = new Set<string>();

    while (gates.length) {
      const [input1, operation, input2, _, result] = gates.pop()!;
      if (!nodeMap.has(input1) || !nodeMap.has(input2)) {
        gates.unshift([input1, operation, input2, _, result]);
        if (seenSinceRemoval.has(result)) break;
        seenSinceRemoval.add(result);
        continue;
      }

      seenSinceRemoval.clear();

      const inputVal1 = nodeMap.get(input1)!;
      const inputVal2 = nodeMap.get(input2)!;

      const out = gateOperations[operation](inputVal1, inputVal2);
      nodeMap.set(result, out);
    }

    const zKeys = [...nodeMap.keys()]
      .filter((key) => key.startsWith("z"))
      .sort()
      .reverse();

    const out = zKeys.map((key) => nodeMap.get(key)).join("");
    if (parseInt(out, 2) != expectedAns) return false;
  }
  return true;
  // console.log(x, y, expectedAns, out, parseInt(out, 2));
}
