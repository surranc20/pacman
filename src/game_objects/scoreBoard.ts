import { Container } from "pixi.js";
import Label from "./label";
import ScoreDisplayer from "./scoreDisplayer";

export default class ScoreBoard {
  container: Container;
  score: number;
  oneUpContainer: Container;
  scoreDisplayer: ScoreDisplayer;
  fps: number;
  private _blinkTimer: number;
  blinking: boolean;
  canOneUp = true;
  oneUpCallback: () => void;

  constructor(oneUpCallback: () => void) {
    this.oneUpCallback = oneUpCallback;
    this.container = new Container();
    this.scoreDisplayer = new ScoreDisplayer();
    this.oneUpContainer = new Label("1UP").container;
    this.container.addChild(this.oneUpContainer);
    this.container.addChild(this.scoreDisplayer.container);
    this.container.position.set(0, 0);
    this.scoreDisplayer.container.position.set(0, 8);
    this.oneUpContainer.position.set(24, 0);

    this.blinking = true;
    this._blinkTimer = 0;
    this.fps = 6;

    this.score = 0;
    this.updateScoreBoard(0);
  }

  update(elapsedTime: number) {
    if (!this.blinking) return;

    this._blinkTimer += elapsedTime;
    if (this._blinkTimer > 1 / this.fps) {
      this._blinkTimer %= 1 / this.fps;
      this._blinkTimer -= 1 / this.fps;
      this.oneUpContainer.visible = !this.oneUpContainer.visible;
    }
  }

  updateScoreBoard(points: number) {
    this.score += points;
    this.scoreDisplayer.displayScore(this.score);
    if (this.canOneUp && this.score >= 10000) {
      this.canOneUp = false;
      this.oneUpCallback();
    }
  }
}
