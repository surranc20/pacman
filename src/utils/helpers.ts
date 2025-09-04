import { Constants } from "../enums/constants";

export function convertPosToScaledPos(x: number, y: number, scale: number) {
  return [x * scale, y * scale];
}

export function getGhostStartingPosFromTiles(xTile: number, yTile: number) {
  const x = xTile * Constants.TILE_SIZE + Constants.MAZE_OBJ_OFFSET;
  const y =
    yTile * Constants.TILE_SIZE +
    Constants.TILE_SIZE * Constants.BLANK_Y_TILES +
    Constants.MAZE_OBJ_OFFSET;

  return [x, y];
}


export function debouncedResize() {
  let scale = Math.min(
    Math.floor(window.innerWidth / Constants.RESOLUTION_X),
    Math.floor(window.innerHeight / Constants.RESOLUTION_Y)
  );

  scale = Math.max(scale - 1, 0.5);
  document.getElementById("main-body")!.style.transform = `scale(${scale})`;
}