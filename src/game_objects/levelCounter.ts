import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";
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
    if (this.fruits.length > 7) {
      this.fruits = this.fruits.slice(1);
    }

    let x = 12 * 8 + 3;
    for (const fruit of this.fruits) {
      const fruitTexture =
        Loader.shared.resources.spritesheet.spritesheet?.textures[
          `Fruit/${fruit}.png`
        ]!;

      console.log(fruitTexture);
      this.container.addChild(new FruitDrawable(x, 0, fruitTexture));
      x -= 16;
    }

    this.container.position.set(12 * 8, 275);
  }
}

class FruitDrawable extends Drawable {}
