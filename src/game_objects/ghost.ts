import { Loader } from "pixi.js";
import Animatable from "../abstract/animatable";

export default class Ghost extends Animatable {
  constructor(x: number, y: number) {
    const sheet = Loader.shared.resources.spritesheet.spritesheet;
    super(sheet!.animations["Ghosts/red_ghost_side/red_ghost_side"], x, y);
    this.fps = 10;
    this.anchor.set(0.5);
  }
}
