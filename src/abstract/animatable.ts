import { Texture } from "pixi.js";
import IAnimatable from "../interfaces/iAnimatable";
import Drawable from "./drawable";
import { Constants } from "../enums/constants";

export default abstract class Animatable
  extends Drawable
  implements IAnimatable
{
  frames: Texture[];
  currentFrame = 0;
  _animationTimer = 0;
  _ticksPerFrame: number;
  animating = true;
  fps;

  constructor(textures: Texture[], x: number, y: number, fps = 30) {
    super(x, y, textures[0]);
    this.frames = textures;
    this.fps = fps;
    this._ticksPerFrame = Constants.MILLISECS_IN_A_SEC / this.fps;
  }

  startAnimation() {
    this.animating = true;
  }
  endAnimation() {
    this.animating = false;
  }
  update(elapsedTime: number) {
    if (!this.animating) return;

    this._animationTimer += elapsedTime;
    while (this._animationTimer > this._ticksPerFrame) {
      this.currentFrame += 1;
      this.currentFrame %= this.frames.length;

      this._animationTimer -= this._ticksPerFrame;
      this.getTexture();
    }
  }
  getTexture() {
    this.texture = this.frames[this.currentFrame];
  }
}
