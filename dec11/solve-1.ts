// const exampleStoneStr = "125 17";
const stonesStr = "814 1183689 0 1 766231 4091 93836 46";

const blink = (stones: number[]): number[] => {
  const result: number[] = [];

  for (let i = 0; i < stones.length; i++) {
    const stone = stones[i];
    if (stone === 0) {
      result.push(1);
      continue;
    }
    const stoneStr = `${stone}`;
    if (stoneStr.length % 2 === 0) {
      const stone1 = Number(stoneStr.slice(0, stoneStr.length / 2));
      const stone2 = Number(stoneStr.slice(stoneStr.length / 2));
      result.push(stone1, stone2);
    } else {
      result.push(stone * 2024);
    }
  }

  return result;
};

let stones = stonesStr.split(" ").map(Number);

for (let i = 0; i < 25; i++) {
  stones = blink(stones);
}
console.log(stones.length);
