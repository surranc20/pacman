import { Texture } from "pixi.js";
import Animatable from "../abstract/animatable";

export default class Pacman extends Animatable {
  constructor(textures: Texture[], x: number, y: number) {
    super(textures, x, y);
    this.fps = 10;
  }

  update(elapsedTime: number) {
    super.update(elapsedTime);
    this.x += 1;
  }
}
