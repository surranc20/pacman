import { Constants } from "../enums/constants";
import GameManager from "./gameManager";

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


export function debouncedResize(gameManager: GameManager) {
  const body = document.getElementById("main-body")!;
  const scale = calculateScale(body);
  gameManager.setScale(scale)
  gameManager.renderer.resize(Constants.RESOLUTION_X * scale, Constants.RESOLUTION_Y * scale);
  
}

export function calculateScale(body: HTMLElement): number {
  const buffer = 10;
  let scale = Math.min(
    Math.floor((body.offsetWidth - buffer) / Constants.RESOLUTION_X),
    Math.floor((body.offsetHeight - buffer) / Constants.RESOLUTION_Y)
  );
  return Math.max(scale, 0.5);
}
