import { Texture } from "pixi.js";
import IAnimatable from "../interfaces/iAnimatable";
import Drawable from "./drawable";

export default abstract class Animatable
  extends Drawable
  implements IAnimatable
{
  frames: Texture[];
  currentFrame = 0;
  _animationTimer = 0;
  animating = true;
  fps;

  constructor(textures: Texture[], x: number, y: number, fps = 30) {
    super(x, y, textures[0]);
    this.frames = textures;
    this.fps = fps;
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
    if (this._animationTimer > 1 / this.fps) {
      this.currentFrame += 1;
      this.currentFrame %= this.frames.length;

      this._animationTimer -= 1 / this.fps;
      this.getTexture();
    }
  }
  getTexture() {
    this.texture = this.frames[this.currentFrame];
  }
}
