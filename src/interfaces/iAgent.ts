import { Cardinal } from "../enums/cardinal";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";

export default interface IAgent {
  getMove: (
    maze: MazeModel,
    previousDir: Cardinal,
    mazeNode: MazeNode
  ) => Cardinal;
}
