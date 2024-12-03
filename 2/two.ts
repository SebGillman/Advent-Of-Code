// The levels are either all increasing or all decreasing.
// Any two adjacent levels differ by at least one and at most three.

import { promises as fs } from "fs";

const file = await fs.readFile("./2/input.txt", { encoding: "utf-8" });

const reports = file.split("\r\n");

function isSafe(report: number[]) {
  let increasing;
  let prev;
  for (const level of report) {
    if (prev === undefined) {
      prev = level;
      continue;
    }

    if (level > prev && level <= prev + 3) {
      if (increasing === undefined) increasing = true;
      else if (increasing === false) return false;
    } else if (level < prev && level >= prev - 3) {
      if (increasing === undefined) increasing = false;
      else if (increasing === true) return false;
    } else {
      return false;
    }
    prev = level;
  }
  return true;
}

let score = 0;
for (const report of reports) {
  const levels = report.split(" ").map((level) => parseInt(level));

  if (isSafe(levels)) {
    score += 1;
    continue;
  }

  for (let i = 0; i < levels.length; i++) {
    if (isSafe([...levels.slice(0, i), ...levels.slice(i + 1)])) {
      score += 1;
      break;
    }
  }
}

console.log(score);
