import { readFileSync } from "bun:fs";

const multiplications = readFileSync("./data.txt", "utf8");

const enabledSections = multiplications.split("do()").map((x) => {
  const disable = x.indexOf("don't()");
  return disable === -1 ? x : x.slice(0, disable);
});

const mulStatements = enabledSections.flatMap((enabled) =>
  enabled.split("mul")
);
const validMultiplications = mulStatements.reduce((acc: number, x: string) => {
  const match = x.match(/^\((\d+),(\d+)\)/);
  return acc + (match ? parseInt(match[1], 10) * parseInt(match[2], 10) : 0);
}, 0);
console.log(validMultiplications);
