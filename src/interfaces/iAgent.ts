import Moveable from "../abstract/moveable";
import { Cardinal } from "../enums/cardinal";
import MazeModel from "../models/mazeModel";

export default interface IAgent {
  getMove: (maze: MazeModel, gameObj: Moveable) => Cardinal;
}
