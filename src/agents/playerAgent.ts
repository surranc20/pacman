import { Cardinal } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import Keyboard from "pixi.js-keyboard";
import MazeModel from "../models/mazeModel";

export default class PlayerAgent implements IAgent {
  keyboard = Keyboard;
  queuedMove = Cardinal.WEST;

  getMove(_maze: MazeModel, previousDir: Cardinal) {
    let move = previousDir;

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

/*
Option 1: Use Maze Model
  1.) Store pacman and ghosts in the maze model
  2.) Use the center of objects for tracking purposes
  3.) Calculate pacmans x position as 8 * tile pos + an offset of up to 8
  4.) Pacman may corner three pixels early
    4.a) Snap pacman to the center track of the next tile
    4.a) Orientate pacman in the right direction
  5.) Update pacman and ghosts drawables with their new pos
*/
