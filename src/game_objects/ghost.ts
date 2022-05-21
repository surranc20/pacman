import { Loader } from "pixi.js";
import { sound } from "@pixi/sound";
import Moveable from "../abstract/moveable";
import { Cardinal, CardinalOpposites } from "../enums/cardinal";
import { Color } from "../enums/color";
import { GoingToJailState } from "../enums/goingToJail";
import { ReleasingFromJailState } from "../enums/releasingFromJail";
import IGhostAgent from "../interfaces/iGhostAgent";
import MazeModel from "../models/mazeModel";
import mazeNode from "../models/mazeNode";
import {
  getTargetFreightened,
  getTargetGoToJail,
} from "../utils/ghostTargetingAlgorithms";

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
  eyessideTexture: any;
  eyesupTexture: any;
  eyesdownTexture: any;
  goingToJailState: GoingToJailState;
  moveFrameDelay: number;

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
    this.moveFrameDelay = 0;
    this.anchor.set(0.5);
    this.facing = Cardinal.EAST;
    this.queuedMove = this.facing;
    this.mazeModel = mazeModel;
    this.color = color;

    this.setDefaultTexture();

    // Weird caps format to help dynamically create texture name in
    // setCorrectSpriteSheet method
    this.eyessideTexture = [sheet!.textures["Ghosts/eyes_east.png"]];
    this.eyesupTexture = [sheet!.textures["Ghosts/eyes_north.png"]];
    this.eyesdownTexture = [sheet!.textures["Ghosts/eyes_south.png"]];

    this.jailed = false;
    this.releasingFromJailState = ReleasingFromJailState.NOT_ACTIVE;
    this.goingToJailState = GoingToJailState.NOT_ACTIVE;

    sound.add("eat_ghost", "/assets/sounds/eat_ghost.mp3");
  }

  update(elapsedTime: number) {
    // Check to see if the ghost collide with pacman
    if (this.mazeModel.pacman.mazeNode === this.mazeNode) {
      if (this.agent.targetAI === getTargetFreightened) {
        sound.play("eat_ghost");
        this.mazeModel.ghostJail.sendToJail(this);
        this.mazeModel.pacman.moveFrameDelay += 30;

        for (const ghost of this.mazeModel.getGhosts()) {
          if (ghost !== this) {
            ghost.moveFrameDelay += 30;
          }
        }
      } else if (this.agent.targetAI !== getTargetGoToJail) {
        this.mazeModel.pacman.die();
      }
    }
    if (this.moveFrameDelay) {
      this.moveFrameDelay -= 1;
      return;
    }

    const initialNode = this.mazeNode;

    // Ghosts behave differently when exiting jail
    if (this.releasingFromJailState !== ReleasingFromJailState.NOT_ACTIVE) {
      super.update(elapsedTime);
      this._releasingFromJailUpdate();
      return;
    }

    // Ghosts behave differently when entering jail
    if (
      ![
        GoingToJailState.NOT_ACTIVE,
        GoingToJailState.TRAVELING_TO_JAIL,
      ].includes(this.goingToJailState)
    ) {
      super.update(elapsedTime);
      this._goingToJailUpdate();
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
    const eyesPrefix =
      this.goingToJailState !== GoingToJailState.NOT_ACTIVE ? "eyes" : "";
    switch (this.facing) {
      case Cardinal.EAST:
        this.frames = this[(eyesPrefix + "sideTexture") as keyof Ghost];
        this.angle = 0;
        break;
      case Cardinal.WEST:
        this.frames = this[(eyesPrefix + "sideTexture") as keyof Ghost];
        this.scale.x = -1;
        break;
      case Cardinal.NORTH:
        this.angle = 0;
        this.frames = this[(eyesPrefix + "upTexture") as keyof Ghost];
        break;
      default:
        this.angle = 0;
        this.frames = this[(eyesPrefix + "downTexture") as keyof Ghost];
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

  _goingToJailUpdate() {
    switch (this.goingToJailState) {
      case GoingToJailState.X_CENTERING:
        const targetX = 14 * 8;
        if (this.x < targetX - 1) {
          this.queuedMove = Cardinal.EAST;
        } else if (this.x > targetX + 1) {
          this.queuedMove = Cardinal.WEST;
        } else {
          this.x = targetX;
          this.goingToJailState = GoingToJailState.Y_CETERING;
          this.facing = Cardinal.SOUTH;
          this.queuedMove = Cardinal.SOUTH;
        }
        break;

      case GoingToJailState.Y_CETERING:
        const targetY = 14 * 8 + 8 * 3 - 2;
        if (this.y < targetY) {
          this.queuedMove = Cardinal.SOUTH;
        } else {
          this.y = targetY;
          this.goingToJailState = GoingToJailState.NOT_ACTIVE;
          this.agent.targetAI = this.agent.defaultTargetAI;
          this.mazeModel.ghostJail.addGhost(this);
        }
      default:
        break;
    }
  }

  // x == center - 1 center center + 1

  _getUpdatedMazeNode() {
    // Need this so ghost can faze through jail door when leaving jail
    if (
      this.releasingFromJailState === ReleasingFromJailState.LEAVING ||
      this.goingToJailState === GoingToJailState.Y_CETERING
    ) {
      const newNode = !this.mazeNode.centerInNode(
        Math.floor(this.x),
        Math.floor(this.y)
      );
      if (newNode) {
        const delta =
          this.releasingFromJailState === ReleasingFromJailState.LEAVING
            ? -1
            : 1;
        this.mazeNode = this.mazeModel.getNode(14, this.mazeNode.y + delta);
      }
      return;
    }
    super._getUpdatedMazeNode();
  }

  setDefaultTexture() {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    this.upTexture =
      sheet!.animations[
        `Ghosts/${this.color}_ghost_north/${this.color}_ghost_north`
      ];
    this.downTexture =
      sheet!.animations[
        `Ghosts/${this.color}_ghost_south/${this.color}_ghost_south`
      ];
    this.sideTexture =
      sheet!.animations[
        `Ghosts/${this.color}_ghost_east/${this.color}_ghost_east`
      ];
  }

  setFreightendTexture() {
    const animations =
      Loader.shared.resources.spritesheet.spritesheet!.animations;
    this.upTexture = animations[`Ghosts/Ghost Freight/ghost_freight_blue`];
    this.downTexture = animations[`Ghosts/Ghost Freight/ghost_freight_blue`];
    this.sideTexture = animations[`Ghosts/Ghost Freight/ghost_freight_blue`];
  }

  setBlinkFreightendTexture() {
    const animations =
      Loader.shared.resources.spritesheet.spritesheet!.animations;

    this.upTexture = this.upTexture.concat(
      animations[`Ghosts/Ghost Freight/ghost_freight_white`]
    );
    this.downTexture = this.downTexture.concat(
      animations[`Ghosts/Ghost Freight/ghost_freight_white`]
    );
    this.sideTexture = this.sideTexture.concat(
      animations[`Ghosts/Ghost Freight/ghost_freight_white`]
    );
  }
}
