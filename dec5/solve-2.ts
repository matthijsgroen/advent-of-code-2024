import { readFileSync } from "bun:fs";

const lines: string[] = readFileSync("./data.txt", "utf8").split("\n");

const pageRulesText: string[] = [];
const updatesText: string[] = [];

let isUpdates = false;
for (const line of lines) {
  if (line === "") {
    isUpdates = true;
  } else {
    if (isUpdates) {
      updatesText.push(line);
    } else {
      pageRulesText.push(line);
    }
  }
}

const pageRules = pageRulesText.map((line) =>
  line.split("|").map((cell) => parseInt(cell, 10))
);

const updates = updatesText.map((line) =>
  line.split(",").map((cell) => parseInt(cell, 10))
);

const followsRules = (index: number, list: number[]) =>
  pageRules.every((rule) => {
    if (!rule.includes(list[index])) {
      return true; // rule is not applicable
    }
    const before = list.indexOf(rule[0]);
    const after = list.indexOf(rule[1]);
    if (before === -1 || after === -1) {
      return true; // rule is not applicable
    }
    return before < after;
  });

const isUpdateCorrect = (update: number[]) =>
  update.every((_page, index, list) => followsRules(index, list));

const negate =
  (fn: Function) =>
  (...args: any[]) =>
    !fn(...args);

const fixUpdate = (update: number[]) =>
  pageRules.reduce((acc, rule) => {
    const before = acc.indexOf(rule[0]);
    const after = acc.indexOf(rule[1]);
    if (before === -1 || after === -1) {
      return acc; // rule is not applicable
    }
    if (before < after) return acc;
    const changed = [...acc];
    changed[before] = rule[1];
    changed[after] = rule[0];

    return changed;
  }, update);

const fixRecursive = (update: number[]) => {
  let fixed = fixUpdate(update);
  while (!isUpdateCorrect(fixed)) {
    fixed = fixUpdate(fixed);
  }
  return fixed;
};

const inCorrectUpdates = updates.filter(negate(isUpdateCorrect));
const fixedUpdates = inCorrectUpdates.map(fixRecursive);

const middleNumbers = fixedUpdates.map(
  (update) => update[Math.floor(update.length / 2)]
);
const sum = middleNumbers.reduce((acc, val) => acc + val, 0);
console.log(sum);
