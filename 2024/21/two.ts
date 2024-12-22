import * as fs from "fs/promises";

let keypadFile = await fs.readFile("./2024/21/keypad.txt", {
  encoding: "utf-8",
});

keypadFile = keypadFile.replaceAll(/[|+-\s]/gm, "");
const keypadList = keypadFile.split("");

const keypad = [
  keypadList.slice(0, 3),
  keypadList.slice(3, 6),
  keypadList.slice(6, 9),
  ["", ...keypadList.slice(9)],
];

let dirKeypadFile = await fs.readFile("./2024/21/directional_keypad.txt", {
  encoding: "utf-8",
});

dirKeypadFile = dirKeypadFile.replaceAll(/[|+-\s]/gm, "");
const dirKeypadList = dirKeypadFile.split("");

const dirKeypad = [["", ...dirKeypadList.slice(0, 2)], dirKeypadList.slice(2)];

const keypadMap = new Map<string, Map<string, string[]>>();

for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 3; c++) {
    findShortestPaths(r, c, keypad, keypadMap);
  }
}

const dirKeypadMap = new Map<string, Map<string, string[]>>();

for (let r = 0; r < 2; r++) {
  for (let c = 0; c < 3; c++) {
    findShortestPaths(r, c, dirKeypad, dirKeypadMap);
  }
}

const passcodeFile = await fs.readFile("./2024/21/input.txt", {
  encoding: "utf-8",
});
const passcodes = passcodeFile.split("\r\n");
console.log(passcodes);
console.log(keypadMap);

const resArr: number[] = [];
let res = 0;
const hash = new Map<string, number>();
const robots = 26;

for (let passcode of passcodes) {
  const num = Number(passcode.match(/[0-9]+/)![0]);
  let i = 0;
  passcode = passcode;
  const curr = dp(robots, passcode);
  resArr.push(curr);
  res += curr * num;
}

console.log(res, resArr);

function dp(level: number, code: string): number {
  if (level == 0) return code.length;
  code = "A" + code;
  const map = level === robots ? keypadMap : dirKeypadMap;

  let res = 0;

  for (let i = 0; i < code.length - 1; i++) {
    const a = code[i];
    const b = code[i + 1];
    const key = `${a},${b},${level}`;
    if (hash.has(key)) {
      res += hash.get(key) ?? 0;
      continue;
    }
    const options = map.get(a)?.get(b);
    const dpResults =
      options?.map((option: string) => dp(level - 1, option + "A")) ?? [];
    const dpRes = Math.min(...dpResults);

    res += dpRes;
    hash.set(key, dpRes);
  }
  return res;
}

function findShortestPaths(
  startr: number,
  startc: number,
  keypad: string[][],
  map: Map<string, Map<string, string[]>>
) {
  const queue: Array<[number, number, string]> = [[startr, startc, ""]];
  const visited = new Set<string>();
  visited.add(keypad[startr][startc]);

  const directions: Array<[number, number, string]> = [
    [1, 0, "v"],
    [0, 1, ">"],
    [-1, 0, "^"],
    [0, -1, "<"],
  ];

  const rows = keypad.length;
  const cols = keypad[0].length;

  if (!map.has(keypad[startr][startc])) {
    map.set(keypad[startr][startc], new Map<string, string[]>());
    map.get(keypad[startr][startc])?.set(keypad[startr][startc], [""]);
  }
  while (queue.length) {
    const [cr, cc, moves] = queue.pop()!;
    if (keypad[cr][cc] == "") continue;

    for (const [dr, dc, symbol] of directions) {
      const [nr, nc] = [cr + dr, cc + dc];
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (!map.get(keypad[startr][startc])?.has(keypad[nr][nc]))
        map.get(keypad[startr][startc])?.set(keypad[nr][nc], []);
      if (
        visited.has(keypad[nr][nc]) &&
        map.get(keypad[startr][startc])?.get(keypad[nr][nc])?.length &&
        map.get(keypad[startr][startc])!.get(keypad[nr][nc])![0].length <=
          moves.length
      )
        continue;
      visited.add(keypad[nr][nc]);
      (map.get(keypad[startr][startc])?.get(keypad[nr][nc]) as string[])?.push(
        moves + symbol
      );
      queue.unshift([nr, nc, moves + symbol]);
    }
  }
}
