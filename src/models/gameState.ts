import Pacman from "../game_objects/pacman";
import LifeCounter from "../game_objects/life_counter";
import MazeModel from "./mazeModel";
import { Container } from "pixi.js";
import ScoreBoard from "../game_objects/scoreBoard";
import HighScore from "../game_objects/highScore";
import Ghost from "../game_objects/ghost";

export default class GameState {
  lifeCounter: LifeCounter;
  mazeModel: MazeModel;
  container: Container;
  pelletContainer: Container;
  scoreBoard: ScoreBoard;
  highScore: HighScore;
  ghostContainer: Container;
  redGhost: any;

  constructor() {
    this.container = new Container();
    this.pelletContainer = new Container();
    this.ghostContainer = new Container();
    this.redGhost = new Ghost(13 * 8 + 2, 11 * 8 + 24 + 4);
    this.ghostContainer.addChild(this.redGhost);

    const pacman = new Pacman(114, 212);
    this.lifeCounter = new LifeCounter(3);
    this.scoreBoard = new ScoreBoard();
    this.highScore = new HighScore();
    this.mazeModel = new MazeModel(pacman, this.pelletContainer);
    this.container.addChild(pacman);
    this.container.addChild(this.pelletContainer);
    this.container.addChild(this.ghostContainer);
    this.container.addChild(this.lifeCounter.container);
    this.container.addChild(this.scoreBoard.container);
    this.container.addChild(this.highScore.container);

    pacman.addPointsCallback = (points) => {
      this.scoreBoard.updateScoreBoard(points);
      this.highScore.updateScoreBoard(points);
    };
  }

  update(elapsedTime: number) {
    this.mazeModel.update(elapsedTime);
    this.scoreBoard.update(elapsedTime);
    this.scoreBoard.updateScoreBoard(111);
    this.highScore.updateScoreBoard(1);

    this.redGhost.update(elapsedTime);
  }
}
