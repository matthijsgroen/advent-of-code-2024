import { readFileSync } from "bun:fs";

const map: string[] = readFileSync("./data.txt", "utf8").split("\n");

type Position = { x: number; y: number };
type Bounds = { width: number; height: number };

type PosString = `${number},${number}`;
const positionsCovered = new Set<PosString>();

type Guard = Position & { direction: "up" | "down" | "left" | "right" };

const getStartPosition = (): Guard => {
  const y = map.findIndex((line) => line.includes("^"));
  const x = map[y].indexOf("^");
  return { x, y, direction: "up" };
};

const takeStep = (position: Guard): Guard => {
  if (position.direction === "up") {
    if (map[position.y - 1]?.[position.x] === "#") {
      return { ...position, direction: "right" };
    }
    return { ...position, y: position.y - 1 };
  }
  if (position.direction === "right") {
    if (map[position.y][position.x + 1] === "#") {
      return { ...position, direction: "down" };
    }
    return { ...position, x: position.x + 1 };
  }
  if (position.direction === "down") {
    if (map[position.y + 1]?.[position.x] === "#") {
      return { ...position, direction: "left" };
    }
    return { ...position, y: position.y + 1 };
  }
  // left
  if (map[position.y][position.x - 1] === "#") {
    return { ...position, direction: "up" };
  }
  return { ...position, x: position.x - 1 };
};

const inBounds = ({ x, y }: Position, { width, height }: Bounds) =>
  x >= 0 && x < width && y >= 0 && y < height;

const bounds: Bounds = { height: map.length, width: map[0].length };

let now = getStartPosition();

while (inBounds(now, bounds)) {
  positionsCovered.add(`${now.x},${now.y}`);
  now = takeStep(now);
}

console.log(positionsCovered.size);
