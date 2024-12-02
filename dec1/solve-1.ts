import { readFileSync } from "bun:fs";

const entries = readFileSync("./data.txt", "utf8").trim().split("\n");

const list1: number[] = [];
const list2: number[] = [];
for (const entry of entries) {
  const [entry1, entry2] = entry
    .split("   ")
    .map((x: string) => parseInt(x.trim(), 10));
  list1.push(entry1);
  list2.push(entry2);
}

list1.sort((a, b) => a - b);
list2.sort((a, b) => a - b);

let totalDistance = 0;

for (let i = 0; i < list1.length; i++) {
  totalDistance += Math.abs(list1[i] - list2[i]);
}

console.log(totalDistance);
