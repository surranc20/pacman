export enum Cardinal {
  NORTH = "north",
  SOUTH = "south",
  EAST = "east",
  WEST = "west",
}

export const CardinalOpposites = new Map([
  [Cardinal.NORTH, Cardinal.SOUTH],
  [Cardinal.SOUTH, Cardinal.NORTH],
  [Cardinal.WEST, Cardinal.EAST],
  [Cardinal.EAST, Cardinal.WEST],
]);
