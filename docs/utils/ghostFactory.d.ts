import Ghost from "../game_objects/ghost";
import { Color } from "../enums/color";
import MazeModel from "../models/mazeModel";
export default class GhostFactory {
    createGhostFromColor(color: Color, maze: MazeModel): Ghost;
    _getStartingPos(color: Color): number[];
    _setGhostAgent(color: Color, ghost: Ghost): void;
}
