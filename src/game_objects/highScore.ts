import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";

export default class HighScore {
  container: Container;
  score: number;
  titleContainer: Container;
  scoreContainer: Container;

  constructor() {
    this.container = new Container();
    this.scoreContainer = new Container();
    this.titleContainer = new Container();
    this.container.addChild(this.titleContainer);
    this.container.addChild(this.scoreContainer);
    this.container.position.set(80, 0);
    this.scoreContainer.position.set(8, 8);
    this.titleContainer.position.set(0, 0);

    this.score = 0;
    this._createScoreBoardTitle();
    this.updateScoreBoard(0);
  }

  updateScoreBoard(points: number) {
    this.scoreContainer.removeChildren();
    this.score += points;

    let xPos = 0;
    const score = this.score.toString().padStart(2, "0").padStart(7, " ");
    for (const digit of score) {
      if (digit === " ") {
        xPos += 8;
        continue;
      }
      const digitTexture =
        Loader.shared.resources.spritesheet.spritesheet?.textures[
          `White Numbers/white_num${digit}.png`
        ]!;
      this.scoreContainer.addChild(new CharDrawable(xPos, 0, digitTexture));
      xPos += 8;
    }
  }

  _createScoreBoardTitle() {
    let xPos = 0;
    for (const char of "high score") {
      if (char == " ") {
        xPos += 8;
        continue;
      }
      const charTexture =
        Loader.shared.resources.spritesheet.spritesheet?.textures[
          `White Letters/letters_white_${char}.png`
        ]!;
      this.titleContainer.addChild(new CharDrawable(xPos, 0, charTexture));
      xPos += 8;
    }
  }
}

class CharDrawable extends Drawable {}
