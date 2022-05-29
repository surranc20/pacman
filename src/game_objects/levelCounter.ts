import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";
import { Constants } from "../enums/constants";
import { Fruits } from "../enums/fruits";

export default class LevelCounter {
  container: Container;
  fruits: Fruits[];

  constructor() {
    this.container = new Container();
    this.fruits = [];
  }

  setCounter(fruit: Fruits) {
    this.container.removeChildren();
    this.fruits.push(fruit);
    if (this.fruits.length > Constants.MAX_FRUITS_TO_SHOW) {
      this.fruits = this.fruits.slice(1);
    }

    const fruitPicOffset = 3;
    let x = 12 * Constants.TILE_SIZE + fruitPicOffset;
    for (const fruit of this.fruits) {
      const fruitTexture =
        Loader.shared.resources.spritesheet.spritesheet?.textures[
          `Fruit/${fruit}.png`
        ]!;

      this.container.addChild(new FruitDrawable(x, 0, fruitTexture));
      x -= Constants.TILE_SIZE * 2;
    }

    this.container.position.set(
      12 * Constants.TILE_SIZE,
      34 * Constants.TILE_SIZE + fruitPicOffset
    );
  }
}

class FruitDrawable extends Drawable {}
