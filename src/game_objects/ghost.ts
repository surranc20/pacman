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
  upTexture: any;
  downTexture: any;
  sideTexture: any;

  constructor(x: number, y: number, mazeModel: MazeModel) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    super(sheet!.animations["Ghosts/red_ghost_side/red_ghost_side"], x, y);
    this.fps = 10;
    this.anchor.set(0.5);
    this.facing = Cardinal.EAST;
    this.queuedMove = this.facing;
    this.agent = new GhostAgent();
    this.mazeModel = mazeModel;
    this.upTexture =
      sheet!.animations["Ghosts/red_ghost_north/red_ghost_north"];
    this.downTexture =
      sheet!.animations["Ghosts/red_ghost_south/red_ghost_south"];
    this.sideTexture =
      sheet!.animations["Ghosts/red_ghost_side/red_ghost_side"];
  }

  update(elapsedTime: number) {
    const initialNode = this.mazeNode;
    super.update(elapsedTime);

    if (initialNode !== this.mazeNode) {
      this.inputMove(this.mazeModel);
    }
  }

  _continueInCurrentDir() {
    this.scale.x = 1;
    switch (this.facing) {
      case Cardinal.EAST:
        this.x += 1;
        this.frames = this.sideTexture;
        this.angle = 0;
        break;
      case Cardinal.WEST:
        this.x -= 1;
        this.frames = this.sideTexture;
        this.scale.x = -1;
        break;
      case Cardinal.NORTH:
        this.y -= 1;
        this.angle = 0;
        this.frames = this.upTexture;
        break;
      default:
        this.y += 1;
        this.angle = 0;
        this.frames = this.downTexture;
        break;
    }

    const old_node = this.mazeNode;
    this._getUpdatedMazeNode();
    this._handleWarpScenario(old_node);
  }

  _hitWall(): boolean {
    return false;
  }
}
