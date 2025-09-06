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
  const scale = calculateScale()
  document.getElementById("main-body")!.style.transform = `scale(${scale})`;
}

export function calculateScale(): number {
  const buffer = 10;
  let scale = Math.min(
    Math.floor((window.innerWidth - buffer) / Constants.RESOLUTION_X),
    Math.floor((window.innerHeight - buffer) / Constants.RESOLUTION_Y)
  );
  return scale;
}