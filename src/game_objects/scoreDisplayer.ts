import { Container } from "pixi.js";
import Label from "./label";

export default class ScoreDisplayer {
  container: Container;
  constructor() {
    this.container = new Container();
    this.container.position.set(0, 0);
  }

  displayScore(score: number) {
    this.container.removeChildren();
    const scoreString = score.toString().padStart(2, "0").padStart(7, " ");
    this.container.addChild(new Label(scoreString).container);
  }
}
