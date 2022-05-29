import { Container } from "pixi.js";
import { Constants } from "../enums/constants";
import Label from "./label";
import ScoreDisplayer from "./scoreDisplayer";

export default class HighScore {
  container: Container;
  titleContainer: Container;
  scoreDisplayer: ScoreDisplayer;
  currentScore: number;
  highScore: number;

  constructor(score = 0) {
    this.scoreDisplayer = new ScoreDisplayer();

    this.container = new Container();
    this.titleContainer = new Label("High Score").container;
    this.container.addChild(this.titleContainer);
    this.container.addChild(this.scoreDisplayer.container);
    this.container.position.set(Constants.TILE_SIZE * 10, 0);
    this.scoreDisplayer.container.position.set(
      Constants.TILE_SIZE,
      Constants.TILE_SIZE
    );
    this.titleContainer.position.set(0, 0);

    this.currentScore = 0;
    this.highScore = score;
    this.scoreDisplayer.displayScore(this.highScore);
  }

  updateScoreBoard(points: number) {
    this.currentScore += points;
    this.highScore = Math.max(this.currentScore, this.highScore);
    this.scoreDisplayer.displayScore(this.highScore);
  }
}
