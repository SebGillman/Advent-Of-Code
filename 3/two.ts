import { promises as fs } from "fs";

const file = await fs.readFile("./3/input.txt", { encoding: "utf-8" });

const pattern = /mul\(([1-9][0-9]*),([1-9][0-9]*)\)|do\(\)|don't\(\)/g;

const matches = file.match(pattern);

if (!matches) throw new Error("No matches");

let score = 0;
let conditional = true;

for (const match of matches) {
  if (match == "do()") {
    conditional = true;
  } else if (match == "don't()") {
    conditional = false;
  } else if (conditional == true) {
    const res = match.match(/mul\(([1-9][0-9]*),([1-9][0-9]*)\)/);
    if (!res) throw new Error("Bad match");

    score += parseInt(res[1]) * parseInt(res[2]);
  }
}

console.log(score);
