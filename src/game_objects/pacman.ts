import { Loader } from "pixi.js";
import { sound } from "@pixi/sound";
import PlayerAgent from "../agents/playerAgent";
import { Cardinal } from "../enums/cardinal";
import MazeNode from "../models/mazeNode";
import Moveable from "../abstract/moveable";
import Animatable from "../abstract/animatable";

export default class Pacman extends Moveable {
  agent: PlayerAgent;
  facing: Cardinal;
  mazeNode!: MazeNode;
  queuedMove: Cardinal;
  moveFrameDelay: number;
  pelletEatenCallback!: () => void;
  munchNumber: number;
  eatFrames: any;
  deathFrames: any;
  dying: boolean;
  startDeathCallback!: () => void;
  endDeathCallback!: () => void;

  constructor(x: number, y: number) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    const eatFrames = sheet!.animations["pacman_eat/pacman_eat"];
    super(eatFrames, x, y);
    this.fps = 15;
    this.anchor.set(0.5);

    this.agent = new PlayerAgent();
    this.facing = Cardinal.EAST;
    this.queuedMove = Cardinal.EAST;
    this.moveFrameDelay = 0;
    this.speedBoostWhenTurning = true;

    this.munchNumber = 0;
    sound.add("munch0", "/assets/sounds/munch_1.mp3");
    sound.add("munch1", "/assets/sounds/munch_2.mp3");
    this.eatFrames = eatFrames;

    this.dying = false;
    this.deathFrames = sheet!.animations["pacman_death/pacman_death"];
  }

  update(elapsedTime: number) {
    if (this.dying) {
      Animatable.prototype.update.call(this, elapsedTime);
      if (this.currentFrame === this.frames.length - 1) {
        this.endDeathCallback();
      }

      return;
    }
    if (this.moveFrameDelay) {
      this.moveFrameDelay -= 1;
      return;
    }

    if (this.mazeNode.pellet) {
      this.mazeNode.pellet.visible = false;
      this.mazeNode.pellet = null;
      this.moveFrameDelay += 1;
      this.pelletEatenCallback();

      this.munchNumber += 1;
      this.munchNumber %= 2;
      sound.play(`munch${this.munchNumber}`);
    }
    super.update(elapsedTime);
  }

  die() {
    this.dying = true;
    this.animating = true;
    this.angle = 0;
    this.fps = 9;
    this.frames = this.deathFrames;
    this.currentFrame = 0;
    this.startDeathCallback();
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
    super._continueInCurrentDir();
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
}
