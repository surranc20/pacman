import { Loader, Texture } from "pixi.js";
import Animatable from "../abstract/animatable";
import IPellet from "../interfaces/iPellet";

export default class PowerPellet extends Animatable implements IPellet {
  powerPellet: boolean;
  constructor(x: number, y: number) {
    const pelletTexture =
      Loader.shared.resources.spritesheet.spritesheet?.textures[
        "pellets/power_pellet.png"
      ]!;
    super([pelletTexture, Texture.EMPTY], x - 3, y - 3);
    this.powerPellet = true;
    this.fps = 4;
  }
}
