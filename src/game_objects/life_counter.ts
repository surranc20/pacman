import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";

export default class LifeCounter {
  container!: Container;

  constructor(lives: number) {
    this.setLives(lives);
  }

  setLives(lives: number) {
    const lifeTexture =
      Loader.shared.resources.spritesheet.spritesheet?.textures[
        "pacman_life.png"
      ];
    this.container = new Container();
    if (lifeTexture) {
      for (let x = 0; x < lives - 1; x++) {
        this.container.addChild(new PacmanLifeDrawable(x * 16, 0, lifeTexture));
      }
    }
    this.container.position.set(19, 275);
  }
}

class PacmanLifeDrawable extends Drawable {}
