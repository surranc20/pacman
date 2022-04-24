import { Loader } from "pixi.js";
import Drawable from "../abstract/drawable";
import IPellet from "../interfaces/iPellet";

export default class Pellet extends Drawable implements IPellet {
  constructor(x: number, y: number) {
    const pelletTexture =
      Loader.shared.resources.spritesheet.spritesheet?.textures[
        "pellets/pellet.png"
      ]!;
    super(x, y, pelletTexture);
  }
}
