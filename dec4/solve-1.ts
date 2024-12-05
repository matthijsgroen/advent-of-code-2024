import { readFileSync } from "bun:fs";

const lines = readFileSync("./data.txt", "utf8").split("\n");

const word = "XMAS";
const wordReverse = word.split("").reverse().join("");

const count = (lines: string[]): number => {
  const regex = new RegExp(`(${word})`, "g");
  const regexBackward = new RegExp(`(${wordReverse})`, "g");

  return lines.reduce((acc, line) => {
    const matches = line.match(regex);
    const matchesBackward = line.match(regexBackward);

    return (
      acc +
      (matches ? matches.length : 0) +
      (matchesBackward ? matchesBackward.length : 0)
    );
  }, 0);
};

const horizontalLines = (lines: string[]): string[] => lines;

const verticalLines = (lines: string[]): string[] => {
  const columns = lines[0].length;
  return Array.from({ length: columns }, (_, i) =>
    lines.map((line) => line[i]).join("")
  );
};

const diagonalLines = (lines: string[]): string[] => {
  const rows = lines.length;
  const columns = lines[0].length;
  return Array.from({ length: rows + columns - 1 }, (_, i) =>
    Array.from(
      { length: Math.min(i + 1, rows, columns) },
      (_, j) => lines[j][i - j]
    ).join("")
  );
};

const diagonalReverseLines = (lines: string[]): string[] => {
  const rows = lines.length;
  const columns = lines[0].length;
  return Array.from({ length: rows + columns - 1 }, (_, i) =>
    Array.from(
      { length: Math.min(i + 1, rows, columns) },
      (_, j) => lines[j][columns - 1 - i + j]
    ).join("")
  );
};

const result =
  count(horizontalLines(lines)) +
  count(verticalLines(lines)) +
  count(diagonalLines(lines)) +
  count(diagonalReverseLines(lines));

console.log(result);
