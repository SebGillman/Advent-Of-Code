import * as fs from "fs/promises";

const file: string = await fs.readFile("./2023/1/input.txt", {
  encoding: "utf-8",
});

const lines = file.split("\r\n");

let res = 0;

const wordToNum: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

for (const line of lines) {
  const regex = /one|two|three|four|five|six|seven|eight|nine|\d/g;
  const matches = [];
  let match;
  while ((match = regex.exec(line)) !== null) {
    matches.push(match[0]);
    // Move the regex back to allow overlapping matches
    regex.lastIndex -= match[0].length - 1;
  }

  console.log(line, matches);
  const numbers = matches?.map((num) => {
    if (Object.keys(wordToNum).includes(num)) return wordToNum[num];
    return num;
  });

  if (!numbers) throw new Error("No numbers");
  res += parseInt(numbers[0] + numbers[numbers.length - 1]);
}

console.log(res);
