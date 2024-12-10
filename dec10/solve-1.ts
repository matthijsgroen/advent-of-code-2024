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

const getTrailHeadScore = (trails: Position[][]): number => {
  const set = new Set();
  for (const t of trails) {
    set.add(`${t[t.length - 1].x}-${t[t.length - 1].y}`);
  }
  return set.size;
};

const trails = trailHeads.map((trailHead) =>
  getTrailHeadScore(getTrails(trailHead, [trailHead]))
);

console.log(trailHeads.length);
const totalScore = trails.reduce((acc, trails) => acc + trails, 0);
console.log(totalScore);
