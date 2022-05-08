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

export default class GhostFactory {
  createGhostFromColor(color: Color, maze: MazeModel) {
    const [XTilePos, YTilePos] = this._getStartingPos(color);
    const ghost = new Ghost(
      XTilePos * 8 + 4,
      YTilePos * 8 + 24 + 4,
      maze,
      color
    );

    ghost.mazeNode = maze.nodes.get([XTilePos, YTilePos].toString())!;
    this._setGhostAgent(color, ghost);
    return ghost;
  }

  _getStartingPos(color: Color) {
    switch (color) {
      case Color.RED:
        return [13, 11];
      case Color.BLUE:
        return [1, 1];
      case Color.PINK:
        return [11, 1];
      default:
        return [18, 1];
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
