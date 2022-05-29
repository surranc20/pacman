import Ghost from "../game_objects/ghost";
import { Color } from "../enums/color";
import MazeModel from "../models/mazeModel";
import {
  getTargetBlinky,
  getTargetClyde,
  getTargetInky,
  getTargetPinky,
} from "./ghostTargetingAlgorithms";
import GhostAgent from "../agents/ghostAgent";
import { GhostStartingPos } from "../enums/ghostStartingPos";
import { Constants } from "../enums/constants";

export default class GhostFactory {
  createGhostFromColor(color: Color, maze: MazeModel) {
    const [XTilePos, YTilePos] = this._getStartingPos(color);
    const x = XTilePos * Constants.TILE_SIZE + Constants.MAZE_OBJ_OFFSET;
    const y =
      YTilePos * Constants.TILE_SIZE +
      Constants.TILE_SIZE * Constants.BLANK_Y_TILES +
      Constants.MAZE_OBJ_OFFSET;

    const ghost = new Ghost(x, y, maze, color);
    const mazeNode = maze.getNode(XTilePos, YTilePos);
    ghost.mazeNode = mazeNode;
    ghost.previousMazeNode = mazeNode;

    this._setGhostAgent(color, ghost);
    return ghost;
  }

  _getStartingPos(color: Color) {
    let x;
    let y;
    switch (color) {
      case Color.RED:
        x = GhostStartingPos.BLINKY_X;
        y = GhostStartingPos.BLINKY_Y;
        return [x, y];
      case Color.BLUE:
        x = GhostStartingPos.INKY_X;
        y = GhostStartingPos.INKY_Y;
        return [x, y];
      case Color.PINK:
        x = GhostStartingPos.PINKY_X;
        y = GhostStartingPos.PINKY_Y;
        return [x, y];
      default:
        x = GhostStartingPos.CLYDE_X;
        y = GhostStartingPos.CLYDE_Y;
        return [x, y];
    }
  }

  _setGhostAgent(color: Color, ghost: Ghost) {
    let targetAI = null;
    switch (color) {
      case Color.RED:
        targetAI = getTargetBlinky;
        break;
      case Color.BLUE:
        targetAI = getTargetInky;
        break;
      case Color.PINK:
        targetAI = getTargetPinky;
        break;
      default:
        targetAI = getTargetClyde;
        break;
    }
    ghost.agent = new GhostAgent(targetAI);
  }
}
