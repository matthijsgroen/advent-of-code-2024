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

let similarity = 0;

for (const item of list1) {
  const amount = list2.filter((x) => x === item).length;
  similarity += amount * item;
}
console.log(similarity);
