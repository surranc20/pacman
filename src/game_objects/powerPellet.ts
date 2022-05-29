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
    const centerPelletOffset = 3;
    super(
      [pelletTexture, Texture.EMPTY],
      x - centerPelletOffset,
      y - centerPelletOffset
    );
    this.powerPellet = true;
    this.fps = 4;
  }
}
