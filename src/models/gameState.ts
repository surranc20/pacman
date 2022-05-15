import Pacman from "../game_objects/pacman";
import LifeCounter from "../game_objects/life_counter";
import MazeModel from "./mazeModel";
import { Container } from "pixi.js";
import ScoreBoard from "../game_objects/scoreBoard";
import HighScore from "../game_objects/highScore";
import { Color } from "../enums/color";
import GhostFactory from "../utils/ghostFactory";

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

    const pacman = new Pacman(114, 212);
    this.lifeCounter = new LifeCounter(3);
    this.scoreBoard = new ScoreBoard();
    this.highScore = new HighScore();
    this.mazeModel = new MazeModel(pacman, this.pelletContainer);

    // Create Ghosts
    const ghostFactory = new GhostFactory();
    for (const color of Object.values(Color)) {
      if (isNaN(Number(color))) {
        const ghost = ghostFactory.createGhostFromColor(
          color as Color,
          this.mazeModel
        );
        this.ghostContainer.addChild(ghost);
        this.mazeModel[color] = ghost;
      }
    }
    this.mazeModel.ghostJail.addGhost(this.mazeModel.blue);
    this.mazeModel.ghostJail.addGhost(this.mazeModel.pink);
    this.mazeModel.ghostJail.addGhost(this.mazeModel.orange);

    this.container.addChild(pacman);
    this.container.addChild(this.pelletContainer);
    this.container.addChild(this.ghostContainer);
    this.container.addChild(this.lifeCounter.container);
    this.container.addChild(this.scoreBoard.container);
    this.container.addChild(this.highScore.container);

    pacman.pelletEatenCallback = () => {
      this.scoreBoard.updateScoreBoard(10);
      this.highScore.updateScoreBoard(10);
      this.mazeModel.ghostJail.dotEaten();
    };
  }

  update(elapsedTime: number) {
    this.mazeModel.update(elapsedTime);
    this.scoreBoard.update(elapsedTime);
  }
}
