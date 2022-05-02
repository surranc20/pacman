import { Loader } from "pixi.js";
import Moveable from "../abstract/moveable";
import GhostAgent from "../agents/ghostAgent";
import { Cardinal } from "../enums/cardinal";
import IAgent from "../interfaces/iAgent";
import MazeModel from "../models/mazeModel";
import mazeNode from "../models/mazeNode";

export default class Ghost extends Moveable {
  agent: IAgent;
  facing: Cardinal;
  queuedMove: Cardinal;
  mazeNode!: mazeNode;
  mazeModel: MazeModel;

  update(elapsedTime: number) {
    const initialNode = this.mazeNode;
    super.update(elapsedTime);

    if (initialNode !== this.mazeNode) {
      this.inputMove(this.mazeModel);
    }
  }

  _hitWall(): boolean {
    return false;
  }
  constructor(x: number, y: number, mazeModel: MazeModel) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    super(sheet!.animations["Ghosts/red_ghost_side/red_ghost_side"], x, y);
    this.fps = 10;
    this.anchor.set(0.5);
    this.facing = Cardinal.EAST;
    this.queuedMove = this.facing;
    this.agent = new GhostAgent();
    this.mazeModel = mazeModel;
  }
}
