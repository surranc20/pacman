import { Loader } from "pixi.js";
import Moveable from "../abstract/moveable";
import { Cardinal } from "../enums/cardinal";
import { Color } from "../enums/color";
import IGhostAgent from "../interfaces/iGhostAgent";
import MazeModel from "../models/mazeModel";
import mazeNode from "../models/mazeNode";

export default class Ghost extends Moveable {
  agent!: IGhostAgent;
  facing: Cardinal;
  queuedMove: Cardinal;
  mazeNode!: mazeNode;
  mazeModel: MazeModel;
  upTexture: any;
  downTexture: any;
  sideTexture: any;

  constructor(x: number, y: number, mazeModel: MazeModel, color: Color) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    console.log(`Ghosts/${color}_ghost_east/${color}_ghost_east`);
    super(
      sheet!.animations[`Ghosts/${color}_ghost_east/${color}_ghost_east`],
      x,
      y
    );
    this.fps = 10;
    this.speedModifier = 0.8;
    this.anchor.set(0.5);
    this.facing = Cardinal.EAST;
    this.queuedMove = this.facing;
    this.mazeModel = mazeModel;
    this.upTexture =
      sheet!.animations[`Ghosts/${color}_ghost_north/${color}_ghost_north`];
    this.downTexture =
      sheet!.animations[`Ghosts/${color}_ghost_south/${color}_ghost_south`];
    this.sideTexture =
      sheet!.animations[`Ghosts/${color}_ghost_east/${color}_ghost_east`];
  }

  update(elapsedTime: number) {
    const initialNode = this.mazeNode;
    super.update(elapsedTime);

    if (initialNode !== this.mazeNode) {
      this.inputMove(this.mazeModel);
    }
  }

  _continueInCurrentDir() {
    this.scale.x = 1; // Used for flipping side textures
    console.log();
    console.log(this.x, this.y);
    switch (this.facing) {
      case Cardinal.EAST:
        this.x += this.speedModifier;
        this.frames = this.sideTexture;
        this.angle = 0;
        break;
      case Cardinal.WEST:
        this.x -= this.speedModifier;
        this.frames = this.sideTexture;
        this.scale.x = -1;
        break;
      case Cardinal.NORTH:
        this.y -= this.speedModifier;
        this.angle = 0;
        this.frames = this.upTexture;
        break;
      default:
        this.y += this.speedModifier;
        this.angle = 0;
        this.frames = this.downTexture;
        break;
    }
    console.log(this.x, this.y);

    const old_node = this.mazeNode;
    this._getUpdatedMazeNode();
    this._handleWarpScenario(old_node);
  }

  _hitWall(): boolean {
    return false;
  }
}
