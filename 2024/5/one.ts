import { promises as fs } from "fs";

const file = await fs.readFile("./2024/5/input.txt", { encoding: "utf-8" });

const rows: Array<string> = file.split("\r\n");

const splitIndex = rows.indexOf("");

const rules = rows.slice(0, splitIndex);
const changes = rows.slice(splitIndex + 1).map((row) => row.split(","));

// handle rules

const ruleMap = new Map<string, Array<string>>();

for (const rule of rules) {
  const [a, b] = rule.split("|");
  if (!ruleMap.has(b)) {
    ruleMap.set(b, []);
  }
  ruleMap.get(b)?.push(a);
}

// handle updates

let score = 0;

function checkUpdate(pages: Array<string>): number {
  const illegalPages = new Set<string>();
  for (const page of pages) {
    if (illegalPages.has(page)) {
      return 0;
    }
    ruleMap.get(page)?.forEach((el) => illegalPages.add(el));
  }
  const mid = pages[Math.round(pages.length / 2) - 1];
  return parseInt(mid);
}

for (const pages of changes) {
  score += checkUpdate(pages);
}
console.log(score);
