import { Cardinal } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import GameState from "../models/gameState";
import Keyboard from "pixi.js-keyboard";

export default class PlayerAgent implements IAgent {
  keyboard = Keyboard;
  getMove(_state: GameState, previousDir: Cardinal) {
    if (this.keyboard.isKeyDown("KeyW", "ArrowUp")) return Cardinal.NORTH;
    if (this.keyboard.isKeyDown("KeyS", "ArrowDown")) return Cardinal.SOUTH;
    if (this.keyboard.isKeyDown("KeyA", "ArrowLeft")) return Cardinal.WEST;
    if (this.keyboard.isKeyDown("KeyD", "ArrowRight")) return Cardinal.EAST;
    return previousDir;
  }
}
