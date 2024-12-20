import { readFileSync } from "bun:fs";

const rawData = readFileSync("./data.txt", "utf-8");

type Robot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const lineRegex = /^p=(-?\d+),(-?\d+)\s+v=(-?\d+),(-?\d+)$/;
const parseData = (data: string): Robot[] =>
  data.split("\n").map<Robot>((line) => {
    const match = line.match(lineRegex);
    if (!match) {
      throw new Error(`Invalid line: ${line}`);
    }
    return {
      x: Number(match[1]),
      y: Number(match[2]),
      vx: Number(match[3]),
      vy: Number(match[4]),
    };
  });

const robots: Robot[] = parseData(rawData);
const roomBoundaries = { width: 101, height: 103 };

const moveRobot = (robot: Robot): void => {
  robot.x = (roomBoundaries.width + robot.x + robot.vx) % roomBoundaries.width;
  robot.y =
    (roomBoundaries.height + robot.y + robot.vy) % roomBoundaries.height;
};

const left = Math.floor(roomBoundaries.height / 2);
const right = roomBoundaries.height / 2;

console.log(`Start, left: ${left}, right: ${right}`);

let movedRobots = robots;
let seconds = 0;
while (seconds < 6516) {
  seconds++;
  let botsLeft = 0;
  let botsRight = 0;

  for (let bId = 0; bId < movedRobots.length; bId++) {
    const bot = movedRobots[bId];
    moveRobot(bot);
  }

  let maxOnRow = 0;
  for (let y = 0; y < roomBoundaries.height; y++) {
    const countPerRow = movedRobots.reduce(
      (acc, bot) => (bot.y === y ? acc + 1 : acc),
      0
    );
    if (countPerRow > maxOnRow) {
      maxOnRow = countPerRow;
    }
  }
  if (maxOnRow < 30) {
    continue;
  }

  console.log(`T = ${seconds} seconds, left: ${botsLeft}, right: ${botsRight}`);
  for (let y = 0; y < roomBoundaries.height; y++) {
    let line = "";
    for (let x = 0; x < roomBoundaries.width; x++) {
      const robot = movedRobots.find((robot) => robot.x === x && robot.y === y);
      line += robot ? "#" : " ";
    }
    console.log(line);
  }
  console.log("\n\n");
}
