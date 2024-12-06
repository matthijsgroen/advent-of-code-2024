import { readFileSync } from "bun:fs";

const startMap: string[] = readFileSync("./data.txt", "utf8").split("\n");

type Position = { x: number; y: number };
type Bounds = { width: number; height: number };
type Direction = "up" | "down" | "left" | "right";

type PosString = `${number},${number}`;
type PosStringDir = `${PosString}-${Direction}`;
type Guard = Position & { direction: Direction };

const getStartPosition = (): Guard => {
  const y = startMap.findIndex((line) => line.includes("^"));
  const x = startMap[y].indexOf("^");
  return { x, y, direction: "up" };
};

const rotations: Direction[] = ["up", "right", "down", "left"];

const nextTurnPosition = (position: Guard): Guard => {
  const nextDirection =
    rotations[(rotations.indexOf(position.direction) + 1) % rotations.length];
  return { ...position, direction: nextDirection };
};

const nextPosition = (position: Guard): Guard => {
  const [dx, dy] = {
    up: [0, -1],
    right: [1, 0],
    down: [0, 1],
    left: [-1, 0],
  }[position.direction];

  return { ...position, x: position.x + dx, y: position.y + dy };
};

const hasObstacle = (position: Guard, map: string[]): boolean =>
  map[position.y]?.[position.x] === "#" ||
  map[position.y]?.[position.x] === "O";

const takeStep = (position: Guard, map: string[]): Guard => {
  const nextPos = nextPosition(position);

  if (hasObstacle(nextPos, map)) {
    return nextTurnPosition(position);
  }

  return nextPos;
};

const inBounds = ({ x, y }: Position, { width, height }: Bounds) =>
  x >= 0 && x < width && y >= 0 && y < height;

const bounds: Bounds = { height: startMap.length, width: startMap[0].length };

const place = (map: string[], position: Position, item: string): string[] => {
  const mapCopy = [...map];
  mapCopy[position.y] =
    mapCopy[position.y].slice(0, position.x) +
    item +
    mapCopy[position.y].slice(position.x + 1);
  return mapCopy;
};

const startPosition = getStartPosition();

const potentialObstaclePositions = new Set<PosString>();

const getsIntoLoop = (position: Guard, map: string[]): boolean => {
  const loopSearch = new Set();
  let pos = position;
  while (inBounds(pos, bounds)) {
    const posStrDir: PosStringDir = `${pos.x},${pos.y}-${pos.direction}`;
    if (loopSearch.has(posStrDir)) {
      return true;
    }
    loopSearch.add(posStrDir);
    pos = takeStep(pos, map);
  }
  return false;
};

let guardNow = startPosition;

while (inBounds(guardNow, bounds)) {
  const potentialObstaclePos = nextPosition(guardNow);
  if (
    inBounds(potentialObstaclePos, bounds) &&
    !hasObstacle(potentialObstaclePos, startMap) &&
    getsIntoLoop(startPosition, place(startMap, potentialObstaclePos, "O"))
  ) {
    if (
      potentialObstaclePos.x !== startPosition.x ||
      potentialObstaclePos.y !== startPosition.y
    ) {
      potentialObstaclePositions.add(
        `${potentialObstaclePos.x},${potentialObstaclePos.y}`
      );
    }
  }

  guardNow = takeStep(guardNow, startMap);
}

console.log("Part 2");
console.log(potentialObstaclePositions.size);
