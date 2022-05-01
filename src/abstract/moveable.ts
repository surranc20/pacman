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

  abstract inputMove(maze: MazeModel): void;
  abstract _hitWall(): boolean;

  update(elapsedTime: number) {
    super.update(elapsedTime);
    if (this._corneringCase()) return;
    if (this._hitWall()) return;
    this._continueInCurrentDir();
  }

  _continueInCurrentDir() {
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

  _getUpdatedMazeNode() {
    const newNode = !this.mazeNode.centerInNode(this.x, this.y);
    if (newNode) this.mazeNode = this.mazeNode[this.facing];
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
