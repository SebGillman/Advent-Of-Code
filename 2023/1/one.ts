import * as fs from "fs/promises";

const file: string = await fs.readFile("./2023/1/input.txt", {
  encoding: "utf-8",
});

const lines = file.split("\r\n");

let res = 0;

for (const line of lines) {
  const numbers = line.match(/\d/g);
  if (!numbers) throw new Error("No numbers");
  res += parseInt(numbers[0] + numbers[numbers.length - 1]);
}

console.log(res);
