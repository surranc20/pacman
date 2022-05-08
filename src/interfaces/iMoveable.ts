import MazeModel from "../models/mazeModel";
import IAgent from "./iAgent";
import IDrawable from "./iDrawable";

export default interface IMoveable extends IDrawable {
  agent: IAgent;
  inputMove: (state: MazeModel) => void;
}
