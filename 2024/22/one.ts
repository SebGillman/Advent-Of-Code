import * as fs from "fs/promises";

const file = await fs.readFile("./2024/22/input.txt", { encoding: "utf-8" });
const starts = file.split("\r\n").map(Number);

let res = 0;
let resArr = [];

//
for (let secret of starts) {
  const mix = (number: number) => (secret = secret ^ number);
  const prune = (number: number) =>
    (secret = ((number % 16777216) + 16777216) % 16777216);

  //
  function generateNext() {
    prune(mix(secret * 64));
    prune(mix(Math.floor(secret / 32)));
    prune(mix(secret * 2048));
  }

  for (let i = 0; i < 2000; i++) {
    generateNext();
  }
  res += secret;
  resArr.push(secret);
}

console.log(res, resArr);
