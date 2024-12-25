import * as fs from "fs/promises";

const file = await fs.readFile("./2024/24/input.txt", { encoding: "utf-8" });

const [startString, gateString] = file.split("\r\n\r\n");

const nodeMap = new Map<string, string>();

startString.split("\r\n").forEach((start) => {
  const [node, value] = start.split(": ");
  nodeMap.set(node, node);
});

let gates = gateString.split("\r\n").map((row) => row.split(" ")) as Array<
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

const wireComboMap = new Map<string, string>();

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

let out = "";
out += "graph {\n";
for (const key of nodeMap.keys())
  out +=
    "\t" +
    key +
    `[color=${
      key.startsWith("x")
        ? "red"
        : key.startsWith("y")
        ? "blue"
        : key.startsWith("z")
        ? "green"
        : "yellow"
    }]` +
    ";\n";

gates = gateString.split("\r\n").map((row) => row.split(" ")) as Array<
  [string, "AND" | "XOR" | "OR", string, string, string]
>;

for (const [input1, operation, input2, _, result] of gates) {
  out +=
    "\t" +
    `${input1} -- ${result}` +
    `[color=${
      operation == "AND"
        ? "red"
        : operation == "OR"
        ? "blue"
        : operation == "XOR"
        ? "green"
        : "yellow"
    }]` +
    ";\n";
  out +=
    "\t" +
    `${input2} -- ${result}` +
    `[color=${
      operation == "AND"
        ? "red"
        : operation == "OR"
        ? "blue"
        : operation == "XOR"
        ? "green"
        : "yellow"
    }]` +
    ";\n";
}
out += "}";

await fs.writeFile("./2024/24/graphviz.dot", out);

const res = ["z16", "hmk", "z20", "fhp", "rvf", "tpc", "z33", "fcd"];
res.sort();
console.log(res.join(","));
