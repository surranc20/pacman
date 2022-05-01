import { Loader } from "pixi.js";
import Moveable from "../abstract/moveable";
import { Cardinal } from "../enums/cardinal";
import iAgent from "../interfaces/iAgent";
import mazeModel from "../models/mazeModel";
import mazeNode from "../models/mazeNode";

export default class Ghost extends Moveable {
  agent!: iAgent;
  facing: Cardinal;
  queuedMove: Cardinal;
  mazeNode!: mazeNode;
  inputMove(_maze: mazeModel): void {
    this.queuedMove = Cardinal.EAST;
  }
  _hitWall(): boolean {
    return false;
  }
  constructor(x: number, y: number) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    super(sheet!.animations["Ghosts/red_ghost_side/red_ghost_side"], x, y);
    this.fps = 10;
    this.anchor.set(0.5);
    this.facing = Cardinal.EAST;
    this.queuedMove = this.facing;
  }
}
