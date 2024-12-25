import * as fs from "fs/promises";

const file = await fs.readFile("./2024/24/input.txt", { encoding: "utf-8" });

const [startString, gateString] = file.split("\r\n\r\n");

const nodeMap = new Map<string, number>();

startString.split("\r\n").forEach((start) => {
  const [node, value] = start.split(": ");
  nodeMap.set(node, Number(value));
});

const gates = gateString.split("\r\n").map((row) => row.split(" ")) as Array<
  [string, "AND" | "XOR" | "OR", string, string, string]
>;

const gateOperations = {
  AND: (val1: number, val2: number) => {
    return val1 && val2;
  },
  OR: (val1: number, val2: number) => {
    return val1 || val2;
  },
  XOR: (val1: number, val2: number) => {
    return val1 ^ val2;
  },
};

while (gates.length) {
  const [input1, operation, input2, _, result] = gates.pop()!;
  if (!nodeMap.has(input1) || !nodeMap.has(input2)) {
    gates.unshift([input1, operation, input2, _, result]);
    continue;
  }

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

console.log(parseInt(out, 2));
