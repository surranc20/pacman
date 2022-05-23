import { Sprite, Texture } from "pixi.js";
import IDrawable from "../interfaces/iDrawable";
export default abstract class Drawable extends Sprite implements IDrawable {
    constructor(x: number, y: number, texture: Texture);
    update(_elapsedTime: number): void;
}
