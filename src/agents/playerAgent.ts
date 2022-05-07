import { Cardinal } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import Keyboard from "pixi.js-keyboard";
import MazeModel from "../models/mazeModel";
import Moveable from "../abstract/moveable";

export default class PlayerAgent implements IAgent {
  keyboard = Keyboard;
  queuedMove = Cardinal.WEST;

  getMove(_maze: MazeModel, gameObj: Moveable) {
    let move = gameObj.facing;

    if (this.keyboard.isKeyDown("KeyW", "ArrowUp")) move = Cardinal.NORTH;
    if (this.keyboard.isKeyDown("KeyS", "ArrowDown")) move = Cardinal.SOUTH;
    if (this.keyboard.isKeyDown("KeyA", "ArrowLeft")) move = Cardinal.WEST;
    if (this.keyboard.isKeyDown("KeyD", "ArrowRight")) move = Cardinal.EAST;

    return move;
  }

  getValidMoves() {
    const validMoves = [
      Cardinal.NORTH,
      Cardinal.SOUTH,
      Cardinal.WEST,
      Cardinal.EAST,
    ];
    return validMoves;
  }
}
