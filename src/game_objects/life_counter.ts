import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";
import { Constants } from "../enums/constants";

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
    const lifePicOffset = 3;
    this.container.position.set(
      Constants.TILE_SIZE * 2 + lifePicOffset,
      Constants.TILE_SIZE * 34 + lifePicOffset
    );
  }
}

class PacmanLifeDrawable extends Drawable {}
