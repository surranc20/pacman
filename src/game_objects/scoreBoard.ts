import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";

export default class ScoreBoard {
  container: Container;
  score: number;
  oneUpContainer: Container;
  scoreContainer: Container;
  fps: number;
  private _blinkTimer: number;
  blinking: boolean;

  constructor() {
    this.container = new Container();
    this.scoreContainer = new Container();
    this.oneUpContainer = new Container();
    this.container.addChild(this.oneUpContainer);
    this.container.addChild(this.scoreContainer);
    this.container.position.set(0, 0);
    this.scoreContainer.position.set(0, 8);
    this.oneUpContainer.position.set(24, 0);

    this.blinking = false;
    this._blinkTimer = 0;
    this.fps = 2.5;

    this.score = 0;
    this._createScoreBoardTitle();
    this.updateScoreBoard(0);
  }

  update(elapsedTime: number) {
    if (!this.blinking) return;

    this._blinkTimer += elapsedTime;
    if (this._blinkTimer > 1 / this.fps) {
      this._blinkTimer -= 1 / this.fps;
      this.oneUpContainer.visible = !this.oneUpContainer.visible;
    }
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
    const one =
      Loader.shared.resources.spritesheet.spritesheet?.textures[
        "White Numbers/white_num1.png"
      ]!;
    this.oneUpContainer.addChild(new CharDrawable(xPos, 0, one));
    xPos += 8;

    for (const char of "up") {
      const charTexture =
        Loader.shared.resources.spritesheet.spritesheet?.textures[
          `White Letters/letters_white_${char}.png`
        ]!;
      this.oneUpContainer.addChild(new CharDrawable(xPos, 0, charTexture));
      xPos += 8;
    }
  }
}

class CharDrawable extends Drawable {}
