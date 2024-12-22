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

const input =
  "<v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A";
const coords = [
  [3, 2],
  [0, 2],
  [0, 2],
];

let res = "";

const action: Record<string, (el: number) => void> = {
  "<": (level: number) => {
    level != 0
      ? (coords[level - 1][1] -= 1)
      : (res += keypad[coords[0][0]][coords[0][1]]);
  },
  "^": (level: number) => {
    level != 0
      ? (coords[level - 1][0] -= 1)
      : (res += keypad[coords[0][0]][coords[0][1]]);
  },
  v: (level: number) => {
    level != 0
      ? (coords[level - 1][0] += 1)
      : (res += keypad[coords[0][0]][coords[0][1]]);
  },
  ">": (level: number) => {
    level != 0
      ? (coords[level - 1][1] += 1)
      : (res += keypad[coords[0][0]][coords[0][1]]);
  },
  A: (level: number) => {
    if (level > 1)
      action[dirKeypad[coords[level - 1][0]][coords[level - 1][1]]](level - 1);
    if (level == 1) res += keypad[coords[0][0]][coords[0][1]];
  },
};

for (const char of input) {
  action[char](3);
}

console.log(res);
