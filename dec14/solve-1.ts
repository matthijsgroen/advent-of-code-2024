import { readFileSync } from "bun:fs";

const rawData = readFileSync("./data.txt", "utf-8");

type Robot = {
  position: { x: number; y: number };
  motionVector: { x: number; y: number };
};

const lineRegex = /^p=(-?\d+),(-?\d+)\s+v=(-?\d+),(-?\d+)$/;
const parseData = (data: string): Robot[] =>
  data.split("\n").map<Robot>((line) => {
    const match = line.match(lineRegex);
    if (!match) {
      throw new Error(`Invalid line: ${line}`);
    }
    return {
      position: { x: Number(match[1]), y: Number(match[2]) },
      motionVector: { x: Number(match[3]), y: Number(match[4]) },
    };
  });

const robots: Robot[] = parseData(rawData);
const roomBoundaries = { width: 101, height: 103 };

const moveRobot = (robot: Robot, seconds = 1): Robot => ({
  position: {
    x:
      (roomBoundaries.width * seconds +
        robot.position.x +
        robot.motionVector.x * seconds) %
      roomBoundaries.width,
    y:
      (roomBoundaries.height * seconds +
        robot.position.y +
        robot.motionVector.y * seconds) %
      roomBoundaries.height,
  },
  motionVector: robot.motionVector,
});

const movedRobots = robots.map((robot) => moveRobot(robot, 100));

const center = {
  x: roomBoundaries.width / 2,
  y: roomBoundaries.height / 2,
};

const q1Bots = movedRobots.reduce(
  (acc, bot) =>
    bot.position.x < Math.floor(center.x) &&
    bot.position.y < Math.floor(center.y)
      ? acc + 1
      : acc,
  0
);

const q2Bots = movedRobots.reduce(
  (acc, bot) =>
    bot.position.x > center.x && bot.position.y < Math.floor(center.y)
      ? acc + 1
      : acc,
  0
);

const q3Bots = movedRobots.reduce(
  (acc, bot) =>
    bot.position.x < Math.floor(center.x) && bot.position.y > center.y
      ? acc + 1
      : acc,
  0
);

const q4Bots = movedRobots.reduce(
  (acc, bot) =>
    bot.position.x > center.x && bot.position.y > center.y ? acc + 1 : acc,
  0
);

console.log(q1Bots, q2Bots, q3Bots, q4Bots);
console.log(q1Bots * q2Bots * q3Bots * q4Bots);
