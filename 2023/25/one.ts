import * as fs from "fs/promises";

async function day1() {
  const file = await fs.readFile("./2023/25/input.txt", { encoding: "utf-8" });

  const lines = file.split("\r\n");

  const connectionMap: Record<string, string[]> = {};

  const nodes = new Set<string>();
  const edges: Array<string> = [];

  lines.forEach((line) => {
    const [startNode, connectionString] = line.split(": ");
    const endNodes = connectionString.split(" ");

    nodes.add(startNode);
    connectionMap[startNode] ??= [];

    for (const endNode of endNodes) {
      connectionMap[endNode] ??= [];

      connectionMap[startNode].push(endNode);
      connectionMap[endNode].push(startNode);

      nodes.add(endNode);

      edges.push([startNode, endNode].sort().toString());
    }
  });

  const memo = new Map<string, number | null>();

  function dp(nodes: string[]): number | null {
    nodes.sort();
    const stringNodes = nodes.toString();
    if (memo.has(stringNodes)) return memo.get(stringNodes) || null;

    const edges: string[] = [];
    for (const node of nodes) {
      const temp = connectionMap[node];

      edges.push(...temp.filter((el) => !nodes.includes(el)));
    }
    if (edges.length <= 3) return nodes.length;
    const edgeList = [...new Set(edges)].sort(
      (a, b) =>
        edges.reduce((curr, next) => curr + (next == b ? 1 : 0), 1) -
        edges.reduce((curr, next) => curr + (next == a ? 1 : 0), 1)
    );

    for (const edge of edgeList) {
      const res = dp([...nodes, edge]);
      if (res) {
        memo.set(stringNodes, res);
        return res;
      }
    }
    memo.set(stringNodes, null);
    return null;
  }

  console.log("Start");

  const nodeArr = [...nodes];
  nodeArr.sort((a, b) => connectionMap[a].length - connectionMap[b].length);

  for (const start of nodeArr) {
    console.log("start node", start);
    const res = dp([start]);
    if (res) return res * (nodeArr.length - res);
  }
  return null;
}

const one = await day1();
console.log(one);
