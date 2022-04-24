import { Container } from "pixi.js";
import Label from "./label";
import ScoreDisplayer from "./scoreDisplayer";

export default class HighScore {
  container: Container;
  score: number;
  titleContainer: Container;
  scoreDisplayer: ScoreDisplayer;

  constructor() {
    this.scoreDisplayer = new ScoreDisplayer();

    this.container = new Container();
    this.titleContainer = new Label("High Score").container;
    this.container.addChild(this.titleContainer);
    this.container.addChild(this.scoreDisplayer.container);
    this.container.position.set(80, 0);
    this.scoreDisplayer.container.position.set(8, 8);
    this.titleContainer.position.set(0, 0);

    this.score = 0;
    this.updateScoreBoard(0);
  }

  updateScoreBoard(points: number) {
    this.score += points;
    this.scoreDisplayer.displayScore(this.score);
  }
}
