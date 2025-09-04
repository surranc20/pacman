import { Cardinal } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import Keyboard from "pixi.js-keyboard";
import MazeModel from "../models/mazeModel";
import Moveable from "../abstract/moveable";
import { Constants } from "../enums/constants";

export default class PlayerAgent implements IAgent {
  keyboard = Keyboard;
  queuedSwipeMove?: Cardinal;
  touchStartCoords?: [number, number]

  constructor() {
    this._setupTouchListeners()
  }

  getMove(_maze: MazeModel, gameObj: Moveable) {
    let move = gameObj.facing;

    if (this.queuedSwipeMove) {
      move = this.queuedSwipeMove
      return move
    }

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

  _setupTouchListeners() {
    document.addEventListener("touchstart", (event: TouchEvent) => {
      event.preventDefault()
      this.queuedSwipeMove = undefined
      if (!event.touches.length) return;
      if (this.touchStartCoords) return;

      this.touchStartCoords = [event.touches[0].clientX, event.touches[0].clientY]
    });

    document.addEventListener("touchend", (event: TouchEvent) => {  
      event.preventDefault()
      if (!this.touchStartCoords) return;
      if (!event.changedTouches.length) return;

      const deltaX = event.changedTouches[0].clientX - this.touchStartCoords[0]
      const deltaY = event.changedTouches[0].clientY - this.touchStartCoords[1]

      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      if (distance < Constants.MINIMUM_SWIPE_DISTANCE) return; 

      this.touchStartCoords = undefined;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.queuedSwipeMove = Cardinal.EAST
        } else {
          this.queuedSwipeMove = Cardinal.WEST
        }
      } else {
        if (deltaY > 0) {
          this.queuedSwipeMove = Cardinal.SOUTH
        } else {
          this.queuedSwipeMove = Cardinal.NORTH
        }
      }
    })
  }
}
