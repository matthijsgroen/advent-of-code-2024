import { readFileSync } from "bun:fs";

const data: string[] = readFileSync("./data.txt", "utf8").split("\n");

type FrequencyNodes = Record<string, { x: number; y: number }[]>;

type Node = {
  x: number;
  y: number;
  frequency: string;
};
type NodePair = {
  a: Node;
  b: Node;
};

const bounds = { x: data[0].length, y: data.length };

const parseData = (data: string[]): FrequencyNodes => {
  const nodes: FrequencyNodes = {};
  data.forEach((line, y) => {
    line.split("").forEach((char, x) => {
      if (char !== ".") {
        nodes[char] = (nodes[char] || []).concat({ x, y });
      }
    });
  });
  return nodes;
};

const nodes = parseData(data);

const makePairs = (nodes: FrequencyNodes): NodePair[] => {
  const pairs: NodePair[] = [];
  Object.keys(nodes).forEach((key) => {
    const node = nodes[key];
    for (let i = 0; i < node.length; i++) {
      for (let j = i + 1; j < node.length; j++) {
        pairs.push({
          a: { ...node[i], frequency: key },
          b: { ...node[j], frequency: key },
        });
      }
    }
  });
  return pairs;
};

const pairs = makePairs(nodes);

const inBounds = ({ x, y }: Node) =>
  x >= 0 && x < bounds.x && y >= 0 && y < bounds.y;

const determineAntiNodes = (pairs: NodePair[]): Node[] => {
  const result: Node[] = [];
  pairs.forEach(({ a, b }) => {
    result.push(a, b);
    const adx = a.x - b.x;
    const ady = a.y - b.y;

    for (let i = 1; i < 1000; i++) {
      const antiNode: Node = {
        x: a.x + adx * i,
        y: a.y + ady * i,
        frequency: a.frequency,
      };
      if (inBounds(antiNode)) {
        result.push(antiNode);
      }
    }
    for (let i = 1; i < 1000; i++) {
      const antiNode: Node = {
        x: a.x - adx * i,
        y: a.y - ady * i,
        frequency: a.frequency,
      };
      if (inBounds(antiNode)) {
        result.push(antiNode);
      }
    }
  });
  return result;
};

const antiNodes = determineAntiNodes(pairs);

const isUnique = (node: Node, index: number, array: Node[]) =>
  array.findIndex((x) => x.x === node.x && x.y === node.y) === index;
const nodesInBounds = antiNodes.filter(inBounds).filter(isUnique);

console.log(nodesInBounds.length);
