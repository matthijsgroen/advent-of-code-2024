import { readFileSync } from "bun:fs";

const reports = readFileSync("./data.txt", "utf8")
  .trim()
  .split("\n")
  .map((x) => x.split(" ").map((y) => parseInt(y, 10)));

const isSafe = (report: number[]): boolean => {
  let increase: boolean | null = null;
  for (let i = 1; i < report.length; i++) {
    const difference = report[i] - report[i - 1];

    if (difference < 0) {
      if (increase) {
        return false;
      }
      increase = false;
    }
    if (difference === 0) {
      return false;
    }
    if (difference > 0) {
      if (increase === false) {
        return false;
      }
      increase = true;
    }
    if (Math.abs(difference) > 3) {
      return false;
    }
  }
  return true;
};

const safeReports = reports.filter(isSafe);
console.log(safeReports.length);
