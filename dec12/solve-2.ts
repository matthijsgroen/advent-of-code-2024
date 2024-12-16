import { readFileSync } from "bun:fs";

const map = readFileSync("./data.txt", "utf-8")
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

const inShape = (region: Region, coord: Coordinate): boolean =>
  region.coordinates.some((c) => c.x === coord.x && c.y === coord.y);

type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};
const getBounds = (region: Region): Bounds => {
  return region.coordinates.reduce(
    (acc, coord) => {
      return {
        minX: Math.min(acc.minX, coord.x),
        minY: Math.min(acc.minY, coord.y),
        maxX: Math.max(acc.maxX, coord.x),
        maxY: Math.max(acc.maxY, coord.y),
      };
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );
};

type Side = "top" | "right" | "bottom" | "left";

type CoordMissingSides = {
  coord: Coordinate;
  sides: Side[];
};

const collectMissingSides = (region: Region): CoordMissingSides[] => {
  const missingSides: CoordMissingSides[] = [];

  for (const coord of region.coordinates) {
    const adjacentCoords: Record<Side, Coordinate> = {
      top: { x: coord.x, y: coord.y - 1 },
      right: { x: coord.x + 1, y: coord.y },
      bottom: { x: coord.x, y: coord.y + 1 },
      left: { x: coord.x - 1, y: coord.y },
    };

    const sides = Object.entries(adjacentCoords).reduce<Side[]>(
      (acc, [side, coord]) => {
        if (!inShape(region, coord)) {
          return acc.concat(side as Side);
        }
        return acc;
      },
      []
    );
    if (sides.length > 0) {
      missingSides.push({ coord, sides });
    }
  }
  return missingSides;
};

const scanHorizontal =
  ({ minX, minY, maxX, maxY }: Bounds) =>
  (callback: (x: number, y: number) => void, onLine: VoidFunction) => {
    for (let y = minY; y <= maxY; y++) {
      onLine();
      for (let x = minX; x <= maxX; x++) {
        callback(x, y);
      }
    }
  };

const scanVertical =
  ({ minX, minY, maxX, maxY }: Bounds) =>
  (callback: (x: number, y: number) => void, onColumn: VoidFunction) => {
    for (let x = minX; x <= maxX; x++) {
      onColumn();
      for (let y = minY; y <= maxY; y++) {
        callback(x, y);
      }
    }
  };

const countSides = (
  sides: CoordMissingSides[],
  side: Side,
  scanner: (
    callback: (x: number, y: number) => void,
    onLoop: VoidFunction
  ) => void
): number => {
  let inSide = false;
  let amount = 0;
  const sideList = sides.filter((coord) => coord.sides.includes(side));
  scanner(
    (x, y) => {
      const hasCoord = sideList.some(
        (coord) => coord.coord.x === x && coord.coord.y === y
      );
      if (hasCoord && !inSide) {
        inSide = true;
        amount++;
      }
      if (!hasCoord && inSide) {
        inSide = false;
      }
    },
    () => {
      inSide = false;
    }
  );
  return amount;
};

const getSides = (region: Region): number => {
  // go over each coordinate, check adjacent coordinates
  // if there is a coordinate not in the region, add
  // coordinate to list with missing sides

  const missingSides: CoordMissingSides[] = collectMissingSides(region);
  const bounds = getBounds(region);
  const horizontal = scanHorizontal(bounds);
  const vertical = scanVertical(bounds);

  let side = 0;
  side += countSides(missingSides, "top", horizontal);
  side += countSides(missingSides, "bottom", horizontal);
  side += countSides(missingSides, "left", vertical);
  side += countSides(missingSides, "right", vertical);

  return side;
};

let startRegions = scanRegions(map);
let mergedRegions = mergeRegions(startRegions);
while (mergedRegions.length < startRegions.length) {
  startRegions = mergedRegions;
  mergedRegions = mergeRegions(startRegions);
}

const totalDiscountedPrice = mergedRegions.reduce((acc, region) => {
  const area = getArea(region);

  const sides2 = getSides(region);

  console.log(region.type, area, sides2, area * sides2);

  return acc + area * sides2;
}, 0);

console.log(totalDiscountedPrice);
