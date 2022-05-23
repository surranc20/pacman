import { Texture } from "pixi.js";
import IAnimatable from "../interfaces/iAnimatable";
import Drawable from "./drawable";
export default abstract class Animatable extends Drawable implements IAnimatable {
    frames: Texture[];
    currentFrame: number;
    _animationTimer: number;
    animating: boolean;
    fps: number;
    constructor(textures: Texture[], x: number, y: number, fps?: number);
    startAnimation(): void;
    endAnimation(): void;
    update(elapsedTime: number): void;
    getTexture(): void;
}
