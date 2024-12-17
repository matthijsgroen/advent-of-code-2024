import { readFileSync } from "bun:fs";

const rawData = readFileSync("./data.txt", "utf-8");

type MachineButton = {
  x: bigint;
  y: bigint;
};

type Coordinate = {
  x: bigint;
  y: bigint;
};

type Machine = {
  buttonA: MachineButton;
  buttonB: MachineButton;

  prizeLocation: Coordinate;
};

const buttonMatch = /^Button \w: X\+(\d+), Y\+(\d+)$/;
const prizeMatch = /^Prize: X=(\d+), Y=(\d+)$/;

const offset = BigInt("10000000000000");

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
      buttonA: {
        x: BigInt(buttonA[1]),
        y: BigInt(buttonA[2]),
      },
      buttonB: {
        x: BigInt(buttonB[1]),
        y: BigInt(buttonB[2]),
      },
      prizeLocation: {
        x: offset + BigInt(prize[1]),
        y: offset + BigInt(prize[2]),
      },
    });
  }

  return machines;
}

const getPrize = (machine: Machine): [boolean, bigint] => {
  // Constants
  const A = [
    [machine.buttonA.x, machine.buttonB.x],
    [machine.buttonA.y, machine.buttonB.y],
  ];
  const B = [machine.prizeLocation.x, machine.prizeLocation.y];

  // Calculate the determinant of A
  const detA = A[0][0] * A[1][1] - A[0][1] * A[1][0];

  // Ensure the determinant is non-zero
  if (detA === BigInt(0)) {
    return [false, BigInt(0)];
  }

  // Calculate the components of A^-1 (scaled by determinant)
  const invA = [
    [A[1][1], -A[0][1]],
    [-A[1][0], A[0][0]],
  ];

  // Perform matrix multiplication: x = A^-1 * B
  const a = (invA[0][0] * B[0] + invA[0][1] * B[1]) / detA;
  const b = (invA[1][0] * B[0] + invA[1][1] * B[1]) / detA;

  if (
    a * machine.buttonA.x + b * machine.buttonB.x === machine.prizeLocation.x &&
    a * machine.buttonA.y + b * machine.buttonB.y === machine.prizeLocation.y
  ) {
    return [true, a * BigInt(3) + b];
  }
  return [false, BigInt(0)];
};

const machines: Machine[] = parseData(rawData);

let prizes = 0;
let totalCoinsSpent = BigInt(0);

for (const machine of machines) {
  const [gotPrize, coinsSpent] = getPrize(machine);
  if (gotPrize) {
    prizes++;
  }
  totalCoinsSpent += coinsSpent;
}

console.log("Prizes won:", prizes, "Total coins spent:", totalCoinsSpent);
