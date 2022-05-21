import { sound } from "@pixi/sound";
import Pacman from "../game_objects/pacman";
import LifeCounter from "../game_objects/life_counter";
import MazeModel from "./mazeModel";
import { Container } from "pixi.js";
import ScoreBoard from "../game_objects/scoreBoard";
import HighScore from "../game_objects/highScore";
import { Color } from "../enums/color";
import GhostFactory from "../utils/ghostFactory";
import { Cardinal } from "../enums/cardinal";
import Label from "../game_objects/label";
import { LabelColors } from "../enums/label_colors";

export default class GameState {
  lifeCounter: LifeCounter;
  mazeModel: MazeModel;
  container: Container;
  pelletContainer: Container;
  scoreBoard: ScoreBoard;
  highScore: HighScore;
  ghostContainer: Container;
  redGhost: any;
  sirenThresholds: Map<number, string>;
  pelletsEaten: number;
  resetingLevel: boolean;
  currentSirenNo: string;
  readyLabel: Label;

  constructor() {
    this.container = new Container();
    this.pelletContainer = new Container();
    this.ghostContainer = new Container();

    const pacman = new Pacman(114, 212);
    this.lifeCounter = new LifeCounter(3);
    this.scoreBoard = new ScoreBoard();
    this.highScore = new HighScore();
    this.mazeModel = new MazeModel(pacman, this.pelletContainer);
    this.pelletsEaten = 0;

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

    this._addGhostsToJail();

    this.container.addChild(pacman);
    this.container.addChild(this.pelletContainer);
    this.container.addChild(this.ghostContainer);
    this.container.addChild(this.lifeCounter.container);
    this.container.addChild(this.scoreBoard.container);
    this.container.addChild(this.highScore.container);
    this.readyLabel = new Label("Ready!", LabelColors.ORANGE);
    this.readyLabel.container.x = 90;
    this.readyLabel.container.y = 160;
    this.container.addChild(this.readyLabel.container);

    pacman.pelletEatenCallback = () => {
      this.scoreBoard.updateScoreBoard(10);
      this.highScore.updateScoreBoard(10);
      this.mazeModel.ghostJail.dotEaten();
      this.pelletsEaten += 1;
      this.adjustSiren();
    };

    this.resetingLevel = false;
    pacman.startDeathCallback = this.pacmanStartDeathCallback;
    pacman.endDeathCallback = this.pacmanEndDeathCallback;
    sound.add("pacman_dies", "/assets/sounds/pacman_dies.mp3");

    this.currentSirenNo = "1";
    this.sirenThresholds = new Map([
      [48, "2"],
      [96, "3"],
      [144, "4"],
      [196, "5"],
    ]);

    for (let x = 1; x < 6; x++) {
      sound.add(`siren_${x}`, `/assets/sounds/siren_${x}.mp3`);
    }
    sound.play("siren_1", { loop: true });
  }

  update(elapsedTime: number) {
    if (this.resetingLevel) return;
    this.mazeModel.update(elapsedTime);
    this.scoreBoard.update(elapsedTime);
  }

  adjustSiren() {
    if (this.sirenThresholds.has(this.pelletsEaten)) {
      sound.stop(`siren_${this.currentSirenNo}`);
      this.currentSirenNo = this.sirenThresholds.get(this.pelletsEaten)!;
      sound.play(`siren_${this.currentSirenNo}`, { loop: true });
    }
  }

  pacmanStartDeathCallback = () => {
    this.ghostContainer.visible = false;
    sound.stop(`siren_${this.currentSirenNo}`);
    sound.play("pacman_dies");
  };

  pacmanEndDeathCallback = () => {
    this.lifeCounter.setLives(this.lifeCounter.lives - 1);
    this.mazeModel.pacman.animating = false;
    this.resetingLevel = true;
    setTimeout(() => {
      this.resetLevel();
    }, 1000);
  };

  resetLevel = () => {
    this._addGhostsToJail();
    this.mazeModel.ghostJail.globalCounterActivated = true;
    this.ghostContainer.visible = true;
    this.resetingLevel = false;

    const redGhost = this.mazeModel.red;
    redGhost.x = 13 * 8 + 4;
    redGhost.y = 11 * 8 + 24 + 4;
    redGhost.mazeNode = this.mazeModel.getNode(13, 11);
    redGhost.queuedMove = Cardinal.EAST;

    const pacman = this.mazeModel.pacman;
    pacman.x = 114;
    pacman.y = 212;
    pacman.currentFrame = 0;
    pacman.getTexture();
    pacman.frames = pacman.eatFrames;
    pacman.mazeNode = this.mazeModel.getNode(14, 23);
    pacman.dying = false;

    this.mazeModel.red.agent.targetAI =
      this.mazeModel.red.agent.defaultTargetAI;
    this.mazeModel.orange.agent.targetAI =
      this.mazeModel.orange.agent.defaultTargetAI;
    this.mazeModel.blue.agent.targetAI =
      this.mazeModel.blue.agent.defaultTargetAI;
    this.mazeModel.pink.agent.targetAI =
      this.mazeModel.pink.agent.defaultTargetAI;

    this.readyLabel.container.visible = false;
  };

  _addGhostsToJail() {
    this.mazeModel.ghostJail.clearJail();
    this.mazeModel.ghostJail.addGhost(this.mazeModel.blue);
    this.mazeModel.ghostJail.addGhost(this.mazeModel.pink);
    this.mazeModel.ghostJail.addGhost(this.mazeModel.orange);
  }
}
