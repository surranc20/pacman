import { Loader } from "pixi.js";
import Moveable from "../abstract/moveable";
import { Cardinal, CardinalOpposites } from "../enums/cardinal";
import { Color } from "../enums/color";
import { ReleasingFromJailState } from "../enums/releasingFromJail";
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
  color: Color;
  jailed: boolean;
  releasingFromJailState: ReleasingFromJailState;

  constructor(x: number, y: number, mazeModel: MazeModel, color: Color) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    super(
      sheet!.animations[`Ghosts/${color}_ghost_east/${color}_ghost_east`],
      x,
      y
    );
    this.fps = 10;
    this.defaultSpeedModifier = 0.8;
    this.speedModifier = 0.8;
    this.anchor.set(0.5);
    this.facing = Cardinal.EAST;
    this.queuedMove = this.facing;
    this.mazeModel = mazeModel;
    this.color = color;
    this.upTexture =
      sheet!.animations[`Ghosts/${color}_ghost_north/${color}_ghost_north`];
    this.downTexture =
      sheet!.animations[`Ghosts/${color}_ghost_south/${color}_ghost_south`];
    this.sideTexture =
      sheet!.animations[`Ghosts/${color}_ghost_east/${color}_ghost_east`];

    this.jailed = false;
    this.releasingFromJailState = ReleasingFromJailState.NOT_ACTIVE;
  }

  update(elapsedTime: number) {
    const initialNode = this.mazeNode;

    // Ghosts behave differently when exiting jail
    if (this.releasingFromJailState !== ReleasingFromJailState.NOT_ACTIVE) {
      super.update(elapsedTime);
      this._releasingFromJailUpdate();
      return;
    }

    super.update(elapsedTime);
    if (initialNode !== this.mazeNode) {
      if (this.jailed) {
        this._jailedInputMove();
      } else {
        this.inputMove(this.mazeModel);
      }
    }
  }

  _continueInCurrentDir() {
    this.scale.x = 1; // Used for flipping side textures
    switch (this.facing) {
      case Cardinal.EAST:
        this.x += this.speedModifier;
        break;
      case Cardinal.WEST:
        this.x -= this.speedModifier;
        break;
      case Cardinal.NORTH:
        this.y -= this.speedModifier;
        break;
      default:
        this.y += this.speedModifier;
        break;
    }

    this.setCorrectSpriteSheet();
    const old_node = this.mazeNode;
    this._getUpdatedMazeNode();
    this._handleWarpScenario(old_node);
  }

  setCorrectSpriteSheet() {
    switch (this.facing) {
      case Cardinal.EAST:
        this.frames = this.sideTexture;
        this.angle = 0;
        break;
      case Cardinal.WEST:
        this.frames = this.sideTexture;
        this.scale.x = -1;
        break;
      case Cardinal.NORTH:
        this.angle = 0;
        this.frames = this.upTexture;
        break;
      default:
        this.angle = 0;
        this.frames = this.downTexture;
        break;
    }
  }

  _hitWall(): boolean {
    return false;
  }

  _jailedInputMove() {
    if ([13, 15].includes(this.mazeNode.y)) {
      this.queuedMove = CardinalOpposites.get(this.facing)!;
    }
  }
  _releasingFromJailUpdate() {
    switch (this.releasingFromJailState) {
      case ReleasingFromJailState.Y_LEVELING:
        this._releasingFromJailUpdateYLeveling();
        break;

      case ReleasingFromJailState.X_LEVELING:
        this._releasingFromJailUpdateXLeveling();
        break;

      case ReleasingFromJailState.LEAVING:
        this._releasingFromJailUpdateLeaving();
        break;
    }
  }

  _releasingFromJailUpdateYLeveling() {
    const targetY = 14 * 8 + 8 * 3 + 4;
    if (this.y < targetY) {
      this.queuedMove = Cardinal.SOUTH;
    } else if (this.y > targetY) {
      this.queuedMove = Cardinal.NORTH;
    } else {
      this.releasingFromJailState = ReleasingFromJailState.X_LEVELING;
    }
  }

  _releasingFromJailUpdateXLeveling() {
    const targetX = 14 * 8;
    if (this.x < targetX) {
      this.queuedMove = Cardinal.EAST;
    } else if (this.x > targetX) {
      this.queuedMove = Cardinal.WEST;
    } else {
      this.releasingFromJailState = ReleasingFromJailState.LEAVING;
      this.facing = Cardinal.NORTH;
      this.queuedMove = Cardinal.NORTH;
    }
  }

  _releasingFromJailUpdateLeaving() {
    if (this.y === 11 * 8 + 24 + 4) {
      this.releasingFromJailState = ReleasingFromJailState.NOT_ACTIVE;
      this.inputMove(this.mazeModel);
      this.speedModifier = this.defaultSpeedModifier;
    }
  }

  _getUpdatedMazeNode() {
    // Need this so ghost can faze through jail door when leaving jail
    if (this.releasingFromJailState === ReleasingFromJailState.LEAVING) {
      const newNode = !this.mazeNode.centerInNode(
        Math.floor(this.x),
        Math.floor(this.y)
      );
      if (newNode) {
        this.mazeNode = this.mazeModel.getNode(14, this.mazeNode.y - 1);
      }
      return;
    }
    super._getUpdatedMazeNode();
  }
}
