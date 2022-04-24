import Pacman from "../game_objects/pacman";
import LifeCounter from "../game_objects/life_counter";
import MazeModel from "./mazeModel";
import { Container } from "pixi.js";
import ScoreBoard from "../game_objects/scoreBoard";
import HighScore from "../game_objects/highScore";

export default class GameState {
  lifeCounter: LifeCounter;
  mazeModel: MazeModel;
  container: Container;
  scoreBoard: ScoreBoard;
  highScore: HighScore;

  constructor() {
    this.container = new Container();
    const pacman = new Pacman(114, 212);
    this.lifeCounter = new LifeCounter(3);
    this.scoreBoard = new ScoreBoard();
    this.highScore = new HighScore();
    this.mazeModel = new MazeModel(pacman);
    this.container.addChild(pacman);
    this.container.addChild(this.lifeCounter.container);
    this.container.addChild(this.scoreBoard.container);
    this.container.addChild(this.highScore.container);
  }

  update(elapsedTime: number) {
    this.mazeModel.update(elapsedTime);
    this.scoreBoard.update(elapsedTime);
    this.scoreBoard.updateScoreBoard(111);
    this.highScore.updateScoreBoard(1);
  }
}
