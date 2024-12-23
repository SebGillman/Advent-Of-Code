import * as fs from "fs/promises";

const file = await fs.readFile("./2024/23/input.txt", { encoding: "utf-8" });
const connections = file.split("\r\n").map((row) => row.split("-"));

const connectionMap = new Map<string, Set<string>>();
const startsWithT = new Set<string>();

for (const [a, b] of connections) {
  if (!connectionMap.has(a)) connectionMap.set(a, new Set<string>());
  if (!connectionMap.has(b)) connectionMap.set(b, new Set<string>());

  connectionMap.get(a)?.add(b);
  connectionMap.get(b)?.add(a);

  if (a.startsWith("t")) startsWithT.add(a);
  if (b.startsWith("t")) startsWithT.add(b);
}

const seenTriplets = new Set<string>();
for (const start of startsWithT) {
  const neighbours = connectionMap.get(start)!;
  const seenNeighbours = new Set<string>();

  for (const neighbour of neighbours) {
    const neigboursNeighbours = connectionMap.get(neighbour)!;
    for (const neighbourNeighbour of neigboursNeighbours) {
      if (!seenNeighbours.has(neighbourNeighbour)) continue;
      const key = [start, neighbour, neighbourNeighbour].sort().toString();
      if (seenNeighbours.has(key)) continue;
      seenTriplets.add(key);
    }
    seenNeighbours.add(neighbour);
  }
}
console.log(connectionMap);
console.log(seenTriplets);
