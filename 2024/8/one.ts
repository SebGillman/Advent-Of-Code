import * as fs from "fs/promises";

const file = await fs.readFile("./2024/8/input.txt", { encoding: "utf-8" });

const grid = file.split("\r\n").map((row) => row.split(""));

const freqMap = new Map<string, Array<[number, number]>>();

const rows = grid.length;
const cols = grid[0].length;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const element = grid[r][c];

    if (element == ".") continue;
    if (!freqMap.has(element)) freqMap.set(element, []);
    freqMap.get(element)!.push([r, c]);
  }
}

const freqs = [...freqMap.keys()];

const antinodeSet = new Set<string>();

for (const freq of freqs) {
  const positions = freqMap.get(freq)!;
  if (positions.length < 2) continue;

  for (let p1 = 0; p1 < positions.length - 1; p1++) {
    for (let p2 = p1 + 1; p2 < positions.length; p2++) {
      const [r1, c1] = positions[p1];
      const [r2, c2] = positions[p2];

      const dr = r2 - r1;
      const dc = c2 - c1;

      const [n1r, n1c] = [r1 - dr, c1 - dc];
      const [n2r, n2c] = [r2 + dr, c2 + dc];

      if (n1r >= 0 && n1r < rows && n1c >= 0 && n1c < cols)
        antinodeSet.add([n1r, n1c].toString());
      if (n2r >= 0 && n2r < rows && n2c >= 0 && n2c < cols)
        antinodeSet.add([n2r, n2c].toString());
    }
  }
}

console.log(antinodeSet);
console.log([...antinodeSet].length);
