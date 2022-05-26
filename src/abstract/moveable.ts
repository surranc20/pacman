import { Cardinal } from "../enums/cardinal";
import iAgent from "../interfaces/iAgent";
import IMoveable from "../interfaces/iMoveable";
import MazeModel from "../models/mazeModel";
import MazeNode from "../models/mazeNode";
import Animatable from "./animatable";

export default abstract class Moveable extends Animatable implements IMoveable {
  abstract agent: iAgent;
  abstract facing: Cardinal;
  abstract queuedMove: Cardinal;
  abstract mazeNode: MazeNode;
  abstract previousMazeNode: MazeNode;

  speedBoostWhenTurning = false;

  defaultSpeedModifier = 1;
  speedModifier = this.defaultSpeedModifier;
  frightSpeed = 0.5;

  abstract _hitWall(): boolean;

  update(elapsedTime: number) {
    this.previousMazeNode = this.mazeNode;
    super.update(elapsedTime);
    if (this._corneringCase()) return;
    if (this._hitWall()) return;
    this._continueInCurrentDir();
  }

  inputMove(maze: MazeModel): void {
    this.queuedMove = this.agent.getMove(maze, this);
  }

  _continueInCurrentDir() {
    switch (this.facing) {
      case Cardinal.EAST:
        this.x += 1 * this.speedModifier;
        this.angle = 0;
        break;
      case Cardinal.WEST:
        this.x -= 1 * this.speedModifier;
        this.angle = 180;
        break;
      case Cardinal.NORTH:
        this.y -= 1 * this.speedModifier;
        this.angle = 270;
        break;
      default:
        this.y += 1 * this.speedModifier;
        this.angle = 90;
        break;
    }

    const old_node = this.mazeNode;
    this._getUpdatedMazeNode();
    this._handleWarpScenario(old_node);
  }

  _corneringCase() {
    if (
      this.queuedMove !== this.facing &&
      this.mazeNode[this.queuedMove]?.validPath
    ) {
      if (this.speedBoostWhenTurning) {
        this._applyBoost();
      }
      this._centerAfterTurning();
      this.facing = this.queuedMove;
      this._getUpdatedMazeNode();
      return true;
    }
    return false;
  }

  _applyBoost() {
    switch (this.queuedMove) {
      case Cardinal.NORTH:
        this.y -= Math.abs(Math.floor(this.x) - this.mazeNode.center[0]);
        break;
      case Cardinal.SOUTH:
        this.y += Math.abs(Math.floor(this.x) - this.mazeNode.center[0]);
        break;
      case Cardinal.EAST:
        this.x += Math.abs(Math.floor(this.y) - this.mazeNode.center[1]);
        break;
      case Cardinal.WEST:
        this.x -= Math.abs(Math.floor(this.y) - this.mazeNode.center[1]);
        break;
    }
  }

  _centerAfterTurning() {
    switch (this.queuedMove) {
      case Cardinal.NORTH:
        if (this.facing === Cardinal.SOUTH) break;
        this.x = this.mazeNode.center[0];
        break;
      case Cardinal.SOUTH:
        if (this.facing === Cardinal.NORTH) break;
        this.x = this.mazeNode.center[0];
        break;
      case Cardinal.EAST:
        if (this.facing === Cardinal.WEST) break;
        this.y = this.mazeNode.center[1];
        break;
      case Cardinal.WEST:
        if (this.facing === Cardinal.EAST) break;
        this.y = this.mazeNode.center[1];
        break;
    }
  }

  _getUpdatedMazeNode() {
    const newNode = !this.mazeNode.centerInNode(
      Math.floor(this.x),
      Math.floor(this.y)
    );
    if (newNode) {
      this.mazeNode = this.mazeNode[this.facing];
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
