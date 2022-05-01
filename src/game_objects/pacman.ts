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
  }

  inputMove(maze: MazeModel) {
    this.queuedMove = this.agent.getMove(maze, this.facing);
  }

  update(elapsedTime: number) {
    if (this.moveFrameDelay) {
      this.moveFrameDelay -= 1;
      return;
    }
    super.update(elapsedTime);

    if (this.mazeNode.pellet) {
      this.mazeNode.pellet.visible = false;
      this.mazeNode.pellet = null;
      this.moveFrameDelay += 1;
      this.addPointsCallback(10);
    }
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
          this.y -= Math.abs(this.x - this.mazeNode.center[0]);
          this.x = this.mazeNode.center[0];
          break;
        case Cardinal.SOUTH:
          if (this.facing === Cardinal.NORTH) break;
          this.y += Math.abs(this.x - this.mazeNode.center[0]);
          this.x = this.mazeNode.center[0];
          break;
        case Cardinal.EAST:
          if (this.facing === Cardinal.WEST) break;
          this.x += Math.abs(this.y - this.mazeNode.center[1]);
          this.y = this.mazeNode.center[1];
          break;
        case Cardinal.WEST:
          if (this.facing === Cardinal.EAST) break;
          this.x -= Math.abs(this.y - this.mazeNode.center[1]);
          this.y = this.mazeNode.center[1];
          break;
      }
      this.facing = this.queuedMove;
      this._getUpdatedMazeNode();
      return true;
    }
    return false;
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

    const old_node = this.mazeNode;
    this._getUpdatedMazeNode();
    this._handleWarpScenario(old_node);
  }

  _getUpdatedMazeNode() {
    const newNode = !this.mazeNode.centerInNode(this.x, this.y);
    if (newNode) this.mazeNode = this.mazeNode[this.facing];
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

  _handleWarpScenario(old_node: MazeNode) {
    if (old_node.warp && this.mazeNode.warp && old_node !== this.mazeNode) {
      switch (this.facing) {
        case Cardinal.WEST:
          this.x = 224;
          break;
        default:
          this.x = 0;
          break;
      }
    }
  }
}
