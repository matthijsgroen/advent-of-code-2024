import { readFileSync } from "bun:fs"; // weirdly this import fixes const issues in this file

// const stonesStr = "125 17";
const stonesStr = "814 1183689 0 1 766231 4091 93836 46";

const blink = (stone: number): number[] => {
  if (stone === 0) {
    return [1];
  }
  const stoneStr = `${stone}`;
  if (stoneStr.length % 2 === 0) {
    const stone1 = Number(stoneStr.slice(0, stoneStr.length / 2));
    const stone2 = Number(stoneStr.slice(stoneStr.length / 2));
    return [stone1, stone2];
  }
  return [stone * 2024];
};

const ITERATIONS = 75;

let stones = stonesStr.split(" ").map(Number);

const cache: Record<number, Record<number, number>> = {};

const solveStone = (stone: number, iterationsLeft: number): number => {
  if (iterationsLeft === 0) {
    return 1;
  }
  const sizeCache = cache[stone]?.[iterationsLeft];
  if (sizeCache !== undefined) {
    return sizeCache;
  }
  cache[stone] = cache[stone] || {};

  let size = 0;
  const result = blink(stone);
  for (const stone of result) {
    size += solveStone(stone, iterationsLeft - 1);
  }
  cache[stone][iterationsLeft] = size;

  return size;
};

let stoneCount = 0;

for (const stone of stones) {
  stoneCount += solveStone(stone, ITERATIONS);
}

console.log(stoneCount);
