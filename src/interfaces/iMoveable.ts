import GameState from "../models/gameState";
import IAgent from "./iAgent";
import IDrawable from "./iDrawable";

export default interface IMoveable extends IDrawable {
  agent: IAgent;
  inputMove: (state: GameState) => void;
}
