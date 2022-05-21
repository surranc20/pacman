import { Loader } from "pixi.js";
import Drawable from "../abstract/drawable";
import IPellet from "../interfaces/iPellet";

export default class PowerPellet extends Drawable implements IPellet {
  powerPellet: boolean;
  constructor(x: number, y: number) {
    const pelletTexture =
      Loader.shared.resources.spritesheet.spritesheet?.textures[
        "pellets/power_pellet.png"
      ]!;
    super(x - 3, y - 3, pelletTexture);
    this.powerPellet = true;
  }
}
