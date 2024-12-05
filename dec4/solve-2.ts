import { readFileSync } from "bun:fs";

const lines = readFileSync("./data.txt", "utf8").split("\n");

const hasXmas = (lines: string[], row: number, col: number): boolean => {
  const isA = lines[row][col] === "A";
  if (!isA) {
    return false;
  }
  const topLeft =
    (lines[row - 1]?.[col - 1] === "M" && lines[row + 1]?.[col + 1] === "S") ||
    (lines[row - 1]?.[col - 1] === "S" && lines[row + 1]?.[col + 1] === "M");
  if (!topLeft) return false;
  const topRight =
    (lines[row - 1]?.[col + 1] === "M" && lines[row + 1]?.[col - 1] === "S") ||
    (lines[row - 1]?.[col + 1] === "S" && lines[row + 1]?.[col - 1] === "M");

  return topRight;
};

let counter = 0;
for (let row = 0; row < lines.length; row++) {
  for (let col = 0; col < lines[0].length; col++) {
    if (hasXmas(lines, row, col)) {
      counter++;
    }
  }
}

console.log(counter);
