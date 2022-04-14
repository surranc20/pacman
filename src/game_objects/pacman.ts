import { Loader } from "pixi.js";
import Animatable from "../abstract/animatable";
import PlayerAgent from "../agents/playerAgent";
import IMoveable from "../interfaces/iMoveable";
import GameState from "../models/gameState";
import { Cardinal } from "../enums/cardinal";

export default class Pacman extends Animatable implements IMoveable {
  agent: PlayerAgent;
  facing: Cardinal;
  constructor(x: number, y: number) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    super(sheet!.animations["pacman_eat/pacman_eat"], x, y);
    this.fps = 10;
    this.agent = new PlayerAgent();
    this.facing = Cardinal.EAST;
    this.anchor.set(0.5);
  }

  update(elapsedTime: number) {
    super.update(elapsedTime);

    switch (this.facing) {
      case Cardinal.EAST:
        this.x += 1.33;
        this.angle = 0;
        break;
      case Cardinal.WEST:
        this.x -= 1.33;
        this.angle = 180;
        break;
      case Cardinal.NORTH:
        this.y -= 1.33;
        this.angle = 270;
        break;
      default:
        this.y += 1.33;
        this.angle = 90;
        break;
    }
  }

  inputMove(state: GameState) {
    this.facing = this.agent.getMove(state, this.facing);
  }
}
