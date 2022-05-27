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
import FreightendState from "./freightenedState";
import { GoingToJailState } from "../enums/goingToJail";
import { ReleasingFromJailState } from "../enums/releasingFromJail";
import settingsJson from "../settings/level_info.json";
import LevelCounter from "../game_objects/levelCounter";
import { Fruits } from "../enums/fruits";

export default class GameState {
  lifeCounter: LifeCounter;
  levelCounter: LevelCounter;
  mazeModel: MazeModel;
  container: Container;
  pelletContainer: Container;
  scoreBoard: ScoreBoard;
  highScore: HighScore;
  ghostContainer: Container;
  redGhost: any;
  sirenThresholds: Map<number, string>;
  pelletsEaten: number;
  callbackTimerActive: boolean;
  currentSirenNo: string;
  readyLabel: Label;
  freightendState: FreightendState;
  level: number;
  level_won: boolean;
  outOfLivesCallback: () => void;

  constructor(outOfLivesCallback: () => void) {
    this.outOfLivesCallback = outOfLivesCallback;

    this.container = new Container();
    this.pelletContainer = new Container();
    this.ghostContainer = new Container();
    this.level = -1;
    this.level_won = false;

    const pacman = new Pacman(114, 212);
    this.lifeCounter = new LifeCounter(3);
    this.levelCounter = new LevelCounter();
    this.scoreBoard = new ScoreBoard(this.oneUpCallback);
    this.highScore = new HighScore();
    this.mazeModel = new MazeModel(pacman, this.pelletContainer);
    this.pelletsEaten = 0;

    this.freightendState = new FreightendState(
      this.mazeModel,
      this.container,
      this.addPointsCallback,
      this.restartSirenCallback
    );
    this.mazeModel.ghostJail.resumeFrightenedSirenCallback =
      this.freightendState.resumeFrightenedCallback;

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
        ghost.ghostEatenCallback = this.freightendState.ghostEatenCallback;
      }
    }
    this.container.addChild(pacman);
    this.container.addChild(this.pelletContainer);
    this.container.addChild(this.ghostContainer);
    this.container.addChild(this.lifeCounter.container);
    this.container.addChild(this.levelCounter.container);
    this.container.addChild(this.scoreBoard.container);
    this.container.addChild(this.highScore.container);
    this.readyLabel = new Label("Ready!", LabelColors.ORANGE);
    this.readyLabel.container.x = 90;
    this.readyLabel.container.y = 160;
    this.container.addChild(this.readyLabel.container);

    pacman.pelletEatenCallback = this.pelletEatenCallback;
    pacman.powerPelletEatenCallback = this.powerPelletEatenCallback;

    this.callbackTimerActive = false;
    pacman.startDeathCallback = this.pacmanStartDeathCallback;
    pacman.endDeathCallback = this.pacmanEndDeathCallback;
    sound.add("pacman_dies", "/assets/sounds/pacman_dies.mp3");
    sound.add("1up", "/assets/sounds/1up.mp3");
    this.currentSirenNo = "1";
    this.sirenThresholds = new Map([
      [48, "2"],
      [96, "3"],
      [144, "4"],
      [196, "5"],
    ]);

    sound.add("power_siren", "/assets/sounds/power_siren.mp3");
    for (let x = 1; x < 6; x++) {
      sound.add(`siren_${x}`, `/assets/sounds/siren_${x}.mp3`);
    }
    this.resetLevel(false);
  }

  update(elapsedTime: number) {
    if (this.callbackTimerActive) return;
    this.mazeModel.update(elapsedTime);
    this.scoreBoard.update(elapsedTime);
    if (this.pelletsEaten === 244) {
      this.level_won = true;
      sound.stopAll();
    }
  }

  adjustSiren() {
    if (this.sirenThresholds.has(this.pelletsEaten)) {
      sound.stop(`siren_${this.currentSirenNo}`);
      this.currentSirenNo = this.sirenThresholds.get(this.pelletsEaten)!;
      sound.play(`siren_${this.currentSirenNo}`, { loop: true });
    }
  }

  pacmanStartDeathCallback = () => {
    this.freightendState.interruptedCleanup();
    this.ghostContainer.visible = false;
    sound.stop(`siren_${this.currentSirenNo}`);
    sound.play("pacman_dies");
  };

  pacmanEndDeathCallback = () => {
    this.lifeCounter.setLives(this.lifeCounter.lives - 1);
    this.mazeModel.pacman.animating = false;
    this.callbackTimerActive = true;
    setTimeout(() => {
      if (this.lifeCounter.lives > 0) {
        this.resetLevel();
      } else {
        this.outOfLivesCallback();
      }
    }, 1000);
  };

  pelletEatenCallback = () => {
    this.mazeModel.ghostJail.dotEaten();
    this.addPointsCallback(10);
    this.pelletsEaten += 1;
    if (!this.freightendState.active) {
      this.adjustSiren();
    }
  };

  powerPelletEatenCallback = () => {
    this.addPointsCallback(30);
    this.mazeModel.ghostJail.dotEaten();
    this.pelletsEaten += 1;
    sound.stop(`siren_${this.currentSirenNo}`);
    this.freightendState.enterFreightendMode();
  };

  loadNextLevel = (siren = true) => {
    this.level += 1;
    this.currentSirenNo = "1";
    this.setLevelConfig();
    this.resetLevel(siren);
    this.pelletsEaten = 0;
    this.mazeModel.resetPellets();
    this.mazeModel.ghostJail.resetJailThresholds();
  };

  setLevelConfig() {
    const levelConfig = settingsJson["level_info"][Math.min(this.level, 20)];
    const baseSpeed = settingsJson["base_speed"] as number;

    // Set pacman speed
    const pacman = this.mazeModel.pacman;
    const pacSpeed = levelConfig[3] as number;
    pacman.defaultSpeedModifier = pacSpeed * baseSpeed;
    pacman.speedModifier = pacSpeed * baseSpeed;

    // Set pacman fright speed
    const pacFrightSpeed = levelConfig[6] as number;
    pacman.frightSpeed = pacFrightSpeed;

    // Set ghost speed and fright speed
    const ghostSpeed = levelConfig[4] as number;
    const ghostFrightSpeed = levelConfig[7] as number;

    for (const ghost of this.mazeModel.getGhosts()) {
      ghost.speedModifier = ghostSpeed * baseSpeed;
      ghost.defaultSpeedModifier = ghostSpeed * baseSpeed;
      ghost.frightSpeed = ghostFrightSpeed * baseSpeed;
    }

    // Set fright time
    const frightTime = levelConfig[8] as number;
    this.freightendState.frightTime = frightTime;

    // Set fright blink time
    const frightBlinkTime = levelConfig[9] as number;
    this.freightendState.frightBlinkTime = frightBlinkTime;

    // Set level fruit
    const fruitString = levelConfig[1] as string;
    const levelFruit = Fruits[fruitString.toUpperCase() as keyof typeof Fruits];
    this.levelCounter.setCounter(levelFruit);
  }

  resetLevel = (siren = true) => {
    this.mazeModel.ghostJail.addStartingGhosts();
    this.mazeModel.ghostJail.globalCounterActivated = true;
    this.ghostContainer.visible = true;
    this.callbackTimerActive = false;

    const redGhost = this.mazeModel.red;
    redGhost.x = 13 * 8 + 4;
    redGhost.y = 11 * 8 + 24 + 4;
    redGhost.mazeNode = this.mazeModel.getNode(13, 11);
    redGhost.queuedMove = Cardinal.EAST;

    const pacman = this.mazeModel.pacman;
    pacman.x = 114;
    pacman.y = 212;
    pacman.facing = Cardinal.EAST;
    pacman.queuedMove = Cardinal.EAST;
    pacman.currentFrame = 0;
    pacman.getTexture();
    pacman.frames = pacman.eatFrames;
    pacman.mazeNode = this.mazeModel.getNode(14, 23);

    pacman.dying = false;

    const ghosts = this.mazeModel.getGhosts();
    for (const ghost of ghosts) {
      ghost.agent.targetAI = ghost.agent.defaultTargetAI;
      ghost.goingToJailState = GoingToJailState.NOT_ACTIVE;
      ghost.releasingFromJailState = ReleasingFromJailState.NOT_ACTIVE;
    }
    if (siren) {
      this.restartSirenCallback();
    }
  };

  addPointsCallback = (points: number) => {
    this.scoreBoard.updateScoreBoard(points);
    this.highScore.updateScoreBoard(points);
  };

  restartSirenCallback = () => {
    sound.play(`siren_${this.currentSirenNo}`, { loop: true });
  };

  stopSoundsCallback = () => {
    sound.stopAll();
  };

  oneUpCallback = () => {
    this.lifeCounter.setLives(this.lifeCounter.lives + 1);
    sound.play("1up");
  };

  _addGhostsToJail() {
    this.mazeModel.ghostJail.clearJail();
    this.mazeModel.ghostJail.addGhost(this.mazeModel.blue);
    this.mazeModel.ghostJail.addGhost(this.mazeModel.pink);
    this.mazeModel.ghostJail.addGhost(this.mazeModel.orange);
  }
}
