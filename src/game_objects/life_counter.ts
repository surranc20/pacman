import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";

export default class LifeCounter {
  container: Container;
  lives: number;

  constructor(lives: number) {
    this.container = new Container();
    this.lives = lives;
    this.setLives(lives);
  }

  setLives(lives: number) {
    this.lives = lives;
    const lifeTexture =
      Loader.shared.resources.spritesheet.spritesheet?.textures[
        "pacman_life.png"
      ];
    this.container.removeChildren();
    if (lifeTexture) {
      for (let x = 0; x < this.lives - 1; x++) {
        this.container.addChild(new PacmanLifeDrawable(x * 16, 0, lifeTexture));
      }
    }
    this.container.position.set(19, 275);
  }
}

class PacmanLifeDrawable extends Drawable {}
