import { readFileSync } from "bun:fs";

const map = readFileSync("./example-data.txt", "utf-8")
  .split("\n")
  .map((line) => line.split(""));

type Coordinate = {
  x: number;
  y: number;
};

type Region = {
  coordinates: Coordinate[];
  type: string;
};

const isAdjacent =
  (coordA: Coordinate) =>
  (coordB: Coordinate): boolean =>
    Math.abs(coordA.x - coordB.x) + Math.abs(coordA.y - coordB.y) === 1;

const isCoordinateAdjacentToRegionOfType =
  (coord: Coordinate, type: string) =>
  (region: Region): boolean => {
    if (region.type !== type) {
      return false;
    }
    const { coordinates } = region;
    return coordinates.some(isAdjacent(coord));
  };

const isRegionAdjacentToRegionOfType =
  (regionA: Region) =>
  (regionB: Region): boolean => {
    if (regionA.type !== regionB.type) {
      return false;
    }
    return regionA.coordinates.some((coord) =>
      regionB.coordinates.some(isAdjacent(coord))
    );
  };

const scanRegions = (
  map: string[][],
  typeFilter?: (type: string) => boolean
): Region[] => {
  const regions: Region[] = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const type = map[y][x];
      if (typeFilter !== undefined && !typeFilter(type)) {
        continue;
      }
      const coord: Coordinate = { x, y };

      const region = regions.find(
        isCoordinateAdjacentToRegionOfType(coord, type)
      );
      if (region) {
        region.coordinates.push(coord);
      } else {
        regions.push({ type, coordinates: [coord] });
      }
    }
  }
  return regions;
};

const mergeRegions = (regions: Region[]): Region[] => {
  const mergedRegions: Region[] = [];

  for (const region of regions) {
    const mergedRegion = mergedRegions.find(
      isRegionAdjacentToRegionOfType(region)
    );
    if (mergedRegion) {
      mergedRegion.coordinates.push(...region.coordinates);
    } else {
      mergedRegions.push(region);
    }
  }
  return mergedRegions;
};

const getArea = (region: Region): number => region.coordinates.length;

const getPerimeterLength = (region: Region): number =>
  region.coordinates.reduce((acc, coord) => {
    const addedPerimeter =
      4 - region.coordinates.filter(isAdjacent(coord)).length;
    return acc + addedPerimeter;
  }, 0);

let startRegions = scanRegions(map);
let mergedRegions = mergeRegions(startRegions);
while (mergedRegions.length < startRegions.length) {
  startRegions = mergedRegions;
  mergedRegions = mergeRegions(startRegions);
}

const totalPrice = mergedRegions.reduce((acc, region) => {
  const area = getArea(region);
  const perimeterLength = getPerimeterLength(region);
  return acc + area * perimeterLength;
}, 0);

console.log(totalPrice);
