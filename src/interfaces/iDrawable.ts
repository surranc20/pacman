import { Sprite } from "pixi.js";

export default interface IDrawable extends Sprite {
  update: (elapsedTime: number) => void;
}
