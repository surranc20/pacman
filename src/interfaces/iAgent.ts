import { Cardinal } from "../enums/cardinal";
import MazeModel from "../models/mazeModel";

export default interface IAgent {
  getMove: (maze: MazeModel, previousDir: Cardinal) => Cardinal;
}
