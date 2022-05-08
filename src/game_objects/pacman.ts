import { Loader } from "pixi.js";
import PlayerAgent from "../agents/playerAgent";
import { Cardinal } from "../enums/cardinal";
import MazeNode from "../models/mazeNode";
import Moveable from "../abstract/moveable";

export default class Pacman extends Moveable {
  agent: PlayerAgent;
  facing: Cardinal;
  mazeNode!: MazeNode;
  queuedMove: Cardinal;
  moveFrameDelay: number;
  addPointsCallback!: (points: number) => void;

  constructor(x: number, y: number) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    super(sheet!.animations["pacman_eat/pacman_eat"], x, y);
    this.fps = 15;
    this.anchor.set(0.5);

    this.agent = new PlayerAgent();
    this.facing = Cardinal.EAST;
    this.queuedMove = Cardinal.EAST;
    this.moveFrameDelay = 0;
    this.speedBoostWhenTurning = true;
  }

  update(elapsedTime: number) {
    if (this.moveFrameDelay) {
      this.moveFrameDelay -= 1;
      return;
    }

    if (this.mazeNode.pellet) {
      this.mazeNode.pellet.visible = false;
      this.mazeNode.pellet = null;
      this.moveFrameDelay += 1;
      this.addPointsCallback(10);
    }
    super.update(elapsedTime);
  }

  _hitWall() {
    if (
      !this.mazeNode[this.facing]?.validPath &&
      this._pacmanPastNodeCenter()
    ) {
      this.endAnimation();
      this.currentFrame = 0;
      this.getTexture();
      return true;
    }
    return false;
  }

  _continueInCurrentDir() {
    this.startAnimation();
    super._continueInCurrentDir();
  }
  _pacmanPastNodeCenter() {
    switch (this.facing) {
      case Cardinal.EAST:
        return this.x > this.mazeNode.center[0];
      case Cardinal.WEST:
        return this.x < this.mazeNode.center[0];
      case Cardinal.NORTH:
        return this.y < this.mazeNode.center[1] - 2;
      default:
        return this.y > this.mazeNode.center[1];
    }
  }
}
