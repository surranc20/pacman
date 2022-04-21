import { Loader } from "pixi.js";
import Animatable from "../abstract/animatable";
import PlayerAgent from "../agents/playerAgent";
import { Cardinal } from "../enums/cardinal";
import MazeNode from "../models/mazeNode";
import MazeModel from "../models/mazeModel";

export default class Pacman extends Animatable {
  agent: PlayerAgent;
  facing: Cardinal;
  mazeNode!: MazeNode;
  queuedMove: Cardinal;
  moveFrameDelay: number;

  constructor(x: number, y: number) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    super(sheet!.animations["pacman_eat/pacman_eat"], x, y);
    this.fps = 10;
    this.anchor.set(0.5);

    this.agent = new PlayerAgent();
    this.facing = Cardinal.EAST;
    this.queuedMove = Cardinal.EAST;
    this.moveFrameDelay = 0;
  }

  get centerX() {
    return this.x + 7;
  }

  get centerY() {
    return this.y + 7;
  }

  inputMove(maze: MazeModel) {
    this.queuedMove = this.agent.getMove(maze, this.facing);
  }

  update(elapsedTime: number) {
    //console.log(this.x, this.y);
    if (this.moveFrameDelay) {
      this.moveFrameDelay -= 1;
      return;
    }
    super.update(elapsedTime);

    if (this._corneringCase()) return;
    if (this._hitWall()) return;
    this._continueInCurrentDir();
  }

  _corneringCase() {
    if (
      this.queuedMove !== this.facing &&
      this.mazeNode[this.queuedMove]?.validPath
    ) {
      switch (this.queuedMove) {
        case Cardinal.NORTH:
          if (this.facing === Cardinal.SOUTH) break;
          this.y -= Math.abs(this.centerX - this.mazeNode.center[0]);
        case Cardinal.SOUTH:
          if (this.facing === Cardinal.NORTH) break;
          this.y += Math.abs(this.centerX - this.mazeNode.center[0]);
          this.x = this._getPosFromCenter()[0];
          break;
        case Cardinal.EAST:
          if (this.facing === Cardinal.WEST) break;
          this.x += Math.abs(this.centerY - this.mazeNode.center[1]);
        case Cardinal.WEST:
          if (this.facing === Cardinal.EAST) break;
          this.x -= Math.abs(this.centerY - this.mazeNode.center[1]);
          this.y = this._getPosFromCenter()[1];
          break;
      }
      // posibly update mazeTile
      this.facing = this.queuedMove;
      return true;
    }

    return false;
  }

  _hitWall() {
    let hitWall = false;

    switch (this.facing) {
      case Cardinal.EAST:
        if (
          !this.mazeNode.east?.validPath &&
          this.centerX > this.mazeNode.center[0]
        ) {
          hitWall = true;
        }
        break;
      case Cardinal.WEST:
        if (
          !this.mazeNode.west?.validPath &&
          this.centerX < this.mazeNode.center[0]
        ) {
          hitWall = true;
        }
        break;
      case Cardinal.NORTH:
        if (
          !this.mazeNode.north?.validPath &&
          this.centerY < this.mazeNode.center[1] - 2
        ) {
          hitWall = true;
        }
        break;
      case Cardinal.SOUTH:
        if (
          !this.mazeNode.south?.validPath &&
          this.centerY > this.mazeNode.center[1]
        ) {
          hitWall = true;
        }
        break;
    }
    if (hitWall) {
      this.endAnimation();
      this.currentFrame = 0;
      this.getTexture();
    }
    return hitWall;
  }

  _continueInCurrentDir() {
    this.startAnimation();
    switch (this.facing) {
      case Cardinal.EAST:
        this.x += 1;
        this.angle = 0;
        break;
      case Cardinal.WEST:
        this.x -= 1;
        this.angle = 180;
        break;
      case Cardinal.NORTH:
        this.y -= 1;
        this.angle = 270;
        break;
      default:
        this.y += 1;
        this.angle = 90;
        break;
    }
    const newNode = !this.mazeNode.centerInNode(this.centerX, this.centerY);
    if (newNode) this.mazeNode = this.mazeNode[this.facing];
  }

  _getPosFromCenter() {
    let [x, y] = this.mazeNode.center;
    return [x - Math.ceil(this.width / 2), y - Math.ceil(this.height / 2) - 1];
  }
}
