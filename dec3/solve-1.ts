import { readFileSync } from "bun:fs";

const multiplications = readFileSync("./data.txt", "utf8");

const mulStatements = multiplications.split("mul");

const validMultiplications = mulStatements.reduce((acc: number, x: string) => {
  const match = x.match(/^\((\d+),(\d+)\)/);
  return acc + (match ? parseInt(match[1], 10) * parseInt(match[2], 10) : 0);
}, 0);
console.log(validMultiplications);
