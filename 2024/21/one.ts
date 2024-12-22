import * as fs from "fs/promises";
import { TextEncoder } from "util";

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

const resArr: string[] = [];
let res = 0;

for (let passcode of passcodes) {
  const num = Number(passcode.match(/[0-9]+/)![0]);
  let i = 0;
  passcode = passcode;
  const curr = dp(2, passcode);
  resArr.push(curr);
  res += curr.length * num;
  console.log(passcode, curr, curr?.length);
}

console.log(res, resArr);

function dp(level: number, code: string): string {
  if (level < 0) return code;
  code = "A" + code;
  const map = level == 2 ? keypadMap : dirKeypadMap;

  let res = "";
  let i = 0;
  while (i < code.length - 1) {
    const option = map.get(code[i])!.get(code[i + 1])![0];
    res += option + "A";
    i++;
  }
  return dp(level - 1, res);
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
      map
        .get(keypad[startr][startc])
        ?.get(keypad[nr][nc])
        ?.push(moves + symbol);
      queue.unshift([nr, nc, moves + symbol]);
    }
  }

  const symbolWeight: Record<string, number> = {
    "<": 3,
    ">": 1,
    "^": 1,
    v: 2,
  };

  [...map.keys()].forEach((key) => {
    const innerMap = map.get(key)!;
    [...innerMap.keys()].forEach((key) => {
      innerMap.get(key)?.sort((a, b) => {
        let aCrossings = 0;
        let bCrossings = 0;

        let delta = null;

        let [currA, currB] = [a[0], b[0]];
        for (let i = 0; i < a.length; i++) {
          if (a[i] != b[i] && delta == null) {
            delta = 0 - symbolWeight[a[i]] + symbolWeight[b[i]];
          }
          if (a[i] != currA) {
            currA = a[i];
            aCrossings++;
          }
          if (b[i] != currB) {
            currB = b[i];
            bCrossings++;
          }
        }
        if (aCrossings != bCrossings) return aCrossings - bCrossings;
        return delta ?? 0;
      });
    });
  });
}

// <vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^
// v<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>Av<A<A>>^
