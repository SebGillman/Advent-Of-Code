import * as fs from "fs/promises";

const file = await fs.readFile("./2024/24/input.txt", { encoding: "utf-8" });

const [startString, gateString] = file.split("\r\n\r\n");

const nodeMap = new Map<string, string>();

startString.split("\r\n").forEach((start) => {
  const [node, value] = start.split(": ");
  nodeMap.set(node, node);
});

const gates = gateString.split("\r\n").map((row) => row.split(" ")) as Array<
  [string, "AND" | "XOR" | "OR", string, string, string]
>;

const gateOperations = {
  AND: (x: string, y: string) => {
    if (x > y) [x, y] = [y, x];
    return `(${x})&(${y})`;
  },
  OR: (x: string, y: string) => {
    if (x > y) [x, y] = [y, x];
    return `(${x})|(${y})`;
  },
  XOR: (x: string, y: string) => {
    if (x > y) [x, y] = [y, x];
    return `(${x})^(${y})`;
  },
};

const opMemo = new Map<string, string>();

function check(
  gatesMaster: Array<[string, "AND" | "XOR" | "OR", string, string, string]>
) {
  const wireComboMap = new Map<string, string>();

  const gates = JSON.parse(JSON.stringify(gatesMaster)) as Array<
    [string, "AND" | "XOR" | "OR", string, string, string]
  >;

  const seenSinceRemoval = new Set<string>();

  while (gates.length) {
    const [input1, operation, input2, _, result] = gates.pop()!;
    if (!nodeMap.has(input1) || !nodeMap.has(input2)) {
      if (seenSinceRemoval.has(result)) break;
      seenSinceRemoval.add(result);
      gates.unshift([input1, operation, input2, _, result]);
      continue;
    }

    seenSinceRemoval.clear();

    const inputVal1 = nodeMap.get(input1)!;
    const inputVal2 = nodeMap.get(input2)!;
    const opMemoKey = [inputVal1, inputVal2, operation].toString();
    let out: string;
    if (opMemo.has(opMemoKey)) {
      out = opMemo.get(opMemoKey)!;
    } else {
      out = gateOperations[operation](inputVal1, inputVal2);
      opMemo.set(opMemoKey, out);
    }
    wireComboMap.set(out, result);
    nodeMap.set(result, out);
  }
  return [...actualMap.keys()].every(
    (key) => actualMap.get(key) == nodeMap.get(key)
  );
}
// const zKeys = [...nodeMap.keys()].filter((key) => key.startsWith("z")).sort();

const actualMap = getActualZ();

const badWires = new Set<string>();
const visitedCombos = new Set<string>();

const res = getSwap(0, [], 0);
console.log(res);

// for (const key of zKeys) {
//   console.log(key, badWires);
//   const actual = actualMap.get(key)!;
//   const found = nodeMap.get(key)!;
//   console.log(actual, found, actual == found);

//   for (let i = 0; i < actual?.length; i++) {
//     // console.log(i);
//     if (i >= found.length) break;
//     if (actual[i] == found[i]) continue;

//     let [l, r] = [i, i];
//     let [lWeight, rWeight] = [0, 0];
//     while (l >= 0 && !["|", "&", "^"].includes(found[l])) {
//       if (found[l] != "(") lWeight++;
//       if (found[l] != ")") lWeight--;
//       l--;
//     }
//     while (r <= found.length && !["|", "&", "^"].includes(found[r])) {
//       if (found[r] != "(") rWeight--;
//       if (found[r] != ")") rWeight++;
//       r++;
//     }

//     let p: number = -1;
//     if (["|", "&", "^"].includes(found[l])) p = l;
//     if (["|", "&", "^"].includes(found[r])) {
//       if (p == -1 || lWeight > rWeight) p = r;
//     }

//     // console.log(p);
//     [l, r] = [p - 1, p + 1];
//     let braacketCount = 0;
//     do {
//       if (found[l] != "(") braacketCount++;
//       if (found[l] != ")") braacketCount--;
//       l--;
//     } while (braacketCount != 0);
//     braacketCount = 0;
//     do {
//       if (found[r] != "(") braacketCount++;
//       if (found[r] != ")") braacketCount--;
//       r++;
//     } while (braacketCount != 0);

//     console.log(l, r, found.slice(l + 1, r));

//     badWires.add(wireComboMap.get(found.slice(l + 1, r))!);
//     i = r - 1;
//   }
// }
// const badWireList = Array.from(badWires);
// console.log([...badWires].sort().join(","));

// swap four pairs
function getSwap(
  pairs: number,
  seen: string[][],
  startIndex: number
): string[][] {
  // console.log(pairs, seen, ...seen);

  if (pairs == 4) {
    return check(gates) ? seen : [];
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
      const gateList = getSwap(pairs + 1, res, p2 + 1);
      if (gateList.length > 0) return gateList;
      swap(p1, p2);
    }
  }

  return [];
}
function swap(p1: number, p2: number) {
  const temp = gates[p2][4];
  gates[p2][4] = gates[p1][4];
  gates[p1][4] = temp;
}

function nextBit(
  x: string,
  y: string,
  carryin: string | null
): [string, string] {
  let sum = `(${x})^(${y})`;
  if (carryin != null) {
    sum = `(${carryin})^(${sum})`;
  }
  let carryout = `(${x})&(${y})`;
  if (carryin != null) {
    carryout = `((${carryin})&((${x})^(${y})))|(${carryout})`;
  }
  return [sum, carryout];
}

function getActualZ() {
  let carry: string = "";
  let res: string = "";

  const map = new Map<string, string>();

  for (let i = 0; i < 45; i++) {
    const x = "x" + `${i}`.padStart(2, "0");
    const y = "y" + `${i}`.padStart(2, "0");
    const z = "z" + `${i}`.padStart(2, "0");
    [res, carry] = nextBit(x, y, i != 0 ? carry : null);
    map.set(z, res);
  }
  const z = "z45";
  map.set(z, carry);
  return map;
}
