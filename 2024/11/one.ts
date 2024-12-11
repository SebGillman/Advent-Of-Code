import * as fs from "fs/promises";

const file = await fs.readFile("./2024/11/input.txt", { encoding: "utf-8" });

const stones: number[] = file.split(" ").map((num) => Number(num));

function afterNBlinks(stones: number[], n: number) {
  for (let i = 0; i < n; i++) {
    let p = 0;

    while (p < stones.length) {
      //   console.log(p, stones);
      const currStone = stones[p];
      const currStoneString = `${currStone}`;
      const currStoneLength = currStoneString.length;

      if (currStone == 0) {
        stones[p] = 1;
        p++;
      } else if (currStoneLength % 2 == 0) {
        const newStone1 = Number(
          currStoneString.substring(0, currStoneLength / 2)
        );
        const newStone2 = Number(
          currStoneString.substring(currStoneLength / 2)
        );

        stones.splice(p, 1, newStone1, newStone2);
        p += 2;
      } else {
        stones[p] = currStone * 2024;
        p++;
      }
    }
    // console.log(stones);
  }
  return stones.length;
}

console.log(afterNBlinks(stones, 25));

// If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
// If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
//      The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
// If none of the other rules apply, the stone is replaced by a new stone;
//      the old stone's number multiplied by 2024 is engraved on the new stone.
