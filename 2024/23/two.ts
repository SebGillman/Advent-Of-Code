import * as fs from "fs/promises";

const file = await fs.readFile("./2024/23/input.txt", { encoding: "utf-8" });
const connections = file.split("\r\n").map((row) => row.split("-"));

const connectionMap = new Map<string, Set<string>>();
const starts = new Set<string>();

// greedy bfs with adding

for (const [a, b] of connections) {
  if (!connectionMap.has(a)) connectionMap.set(a, new Set<string>());
  if (!connectionMap.has(b)) connectionMap.set(b, new Set<string>());

  connectionMap.get(a)?.add(b);
  connectionMap.get(b)?.add(a);

  starts.add(a);
  starts.add(b);
}

let maxSize = 0;
let maxSizePool: string[] = [];

const visited = new Set<string>();

for (const start of starts) {
  const queue: Array<[string, Set<string>]> = [
    [start, new Set<string>([start])],
  ];

  while (queue.length) {
    const [curr, currNodes] = queue.pop()!;
    if (currNodes.size > maxSize) {
      maxSize = currNodes.size;
      maxSizePool = [...currNodes];
    }

    const neighbours = connectionMap.get(curr)!;
    for (const neighbour of neighbours) {
      const neigboursNeighbours = connectionMap.get(neighbour)!;
      if (Array.from(currNodes).some((el) => !neigboursNeighbours.has(el)))
        continue;
      const key = [curr, [...currNodes].sort().toString()].toString();
      if (visited.has(key)) continue;
      visited.add(key);
      queue.unshift([neighbour, new Set<string>([...currNodes, neighbour])]);
    }
  }
}

console.log(maxSize);
console.log(maxSizePool.sort().join(","));
