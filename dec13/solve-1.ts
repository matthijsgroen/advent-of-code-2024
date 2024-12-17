import { readFileSync } from "bun:fs";

const rawData = readFileSync("./data.txt", "utf-8");

type MachineButton = {
  x: number;
  y: number;
};

type Coordinate = {
  x: number;
  y: number;
};

type Machine = {
  buttonA: MachineButton;
  buttonB: MachineButton;

  prizeLocation: Coordinate;
};

const buttonMatch = /^Button \w: X\+(\d+), Y\+(\d+)$/;
const prizeMatch = /^Prize: X=(\d+), Y=(\d+)$/;

function parseData(data: string): Machine[] {
  const lines = data.split("\n");
  const machines: Machine[] = [];

  for (let i = 0; i < lines.length; i += 4) {
    const buttonA = lines[i].match(buttonMatch);
    const buttonB = lines[i + 1].match(buttonMatch);
    const prize = lines[i + 2].match(prizeMatch);

    if (!buttonA || !buttonB || !prize) {
      throw new Error("Invalid data");
    }

    machines.push({
      buttonA: { x: Number(buttonA[1]), y: Number(buttonA[2]) },
      buttonB: { x: Number(buttonB[1]), y: Number(buttonB[2]) },
      prizeLocation: { x: Number(prize[1]), y: Number(prize[2]) },
    });
  }

  return machines;
}

const getPotentialSteps = (
  distance: number,
  buttonA: number,
  buttonB: number
): [a: number, b: number][] => {
  const results: [a: number, b: number][] = [];
  for (let i = 0; i < 100; i++) {
    const a = i;
    const b = Math.floor((distance - a * buttonA) / buttonB);
    if (
      a * buttonA + b * buttonB === distance &&
      a <= 100 &&
      b <= 100 &&
      a >= 0 &&
      b >= 0
    ) {
      results.push([a, b]);
    }
  }
  return results;
};

const getPrize = (machine: Machine): [boolean, number] => {
  const potentialStepsX = getPotentialSteps(
    machine.prizeLocation.x,
    machine.buttonA.x,
    machine.buttonB.x
  );
  const potentialStepsY = getPotentialSteps(
    machine.prizeLocation.y,
    machine.buttonA.y,
    machine.buttonB.y
  );

  const possibleSolutions = potentialStepsX.filter(([aX, bX]) =>
    potentialStepsY.some(([aY, bY]) => aX === aY && bX === bY)
  );
  if (possibleSolutions.length === 0) {
    return [false, 0];
  }

  const tokens = possibleSolutions
    .map(([a, b]) => a * 3 + b)
    .sort((a, b) => b - a);
  return [true, tokens[0]];
};

const machines: Machine[] = parseData(rawData);

let prizes = 0;
let totalCoinsSpent = 0;

for (const machine of machines) {
  const [gotPrize, coinsSpent] = getPrize(machine);
  if (gotPrize) {
    prizes++;
  }
  totalCoinsSpent += coinsSpent;
}

console.log("Prizes won:", prizes, "Total coins spent:", totalCoinsSpent);
