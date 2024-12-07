import { readFileSync } from "bun:fs";

const data: string[] = readFileSync("./data.txt", "utf8").split("\n");

type Formula = {
  answer: number;
  elements: number[];
};

const parsedData: Formula[] = data.map((line) => {
  const [answer, elements] = line.split(": ");
  return {
    answer: Number(answer),
    elements: elements.split(" ").map(Number),
  };
});

const canBeSolved = (formula: Formula): boolean => {
  const operatorsNeeded = formula.elements.length - 1;
  const possibleSolutions = Math.pow(2, operatorsNeeded);

  for (let i = 0; i < possibleSolutions; i++) {
    const binary = i.toString(2).padStart(operatorsNeeded, "0").split("");

    const calculatedAnswer = formula.elements.reduce((acc, element, index) => {
      const operator = binary.shift();
      if (operator === "0") {
        return acc + element;
      } else {
        return acc * element;
      }
    });
    if (calculatedAnswer === formula.answer) {
      return true;
    }
  }

  return false;
};

const result = parsedData.filter(canBeSolved).reduce((acc, formula) => {
  return acc + formula.answer;
}, 0);

console.log(result);
