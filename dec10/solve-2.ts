import { readFileSync } from "bun:fs";

const map: string[][] = readFileSync("./data.txt", "utf8")
  .split("\n")
  .map((l) => l.split(""));

type Position = { x: number; y: number; height: number };

const trailHeads = map.reduce<Position[]>(
  (r, l, y) =>
    l.reduce(
      (ri, c, x) => (c === "0" ? ri.concat({ x, y, height: 0 }) : ri),
      r
    ),
  []
);

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const getTrails = (position: Position, positions: Position[]): Position[][] => {
  if (positions.length === 10) {
    return [positions];
  }
  let fullTrails: Position[][] = [];
  for (const d of directions) {
    const newPos: Position = {
      x: position.x + d[0],
      y: position.y + d[1],
      height: -1,
    };
    const char = map[newPos.y]?.[newPos.x];

    if (char !== undefined && Number(char) === positions.length) {
      newPos.height = Number(char);
      fullTrails.push(...getTrails(newPos, positions.concat(newPos)));
    }
  }
  return fullTrails;
};

const trails = trailHeads.map(
  (trailHead) => getTrails(trailHead, [trailHead]).length
);

console.log(trailHeads.length);
// console.log(trails);
const totalScore = trails.reduce((acc, trails) => acc + trails, 0);
console.log(totalScore);
