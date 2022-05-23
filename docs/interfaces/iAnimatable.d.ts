import { Texture } from "pixi.js";
import IDrawable from "./iDrawable";
export default interface IAnimatable extends IDrawable {
    frames: Texture[];
    currentFrame: number;
    animating: boolean;
    startAnimation: () => void;
    endAnimation: () => void;
}
