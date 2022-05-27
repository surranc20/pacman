import { Container, Loader } from "pixi.js";
import IScene from "../interfaces/iScene";
import Keyboard from "pixi.js-keyboard";
import Playing from "./playing";
import Label from "../game_objects/label";
import GlobalGameStats from "../models/globalGameStats";
import { updateGlobalData } from "../utils/firestore";

export default class GameOver implements IScene {
  stage = new Container();
  done = false;
  keyboard = Keyboard;
  gameOverLabel: Label;
  score: number;
  scoreLabel: Label;
  highScore: number;
  highScoreLabel: Label;
  restartLabel: Label;
  globalData = null;

  constructor(score: number, highScore: number) {
    this.score = score;
    this.highScore = highScore;
    this.gameOverLabel = new Label("Game Over!");
    this.scoreLabel = new Label(`Score        ${this.score}`);
    this.scoreLabel.container.y += 16;
    this.highScoreLabel = new Label(`High Score   ${this.highScore}`);
    this.highScoreLabel.container.y += 32;
    this.restartLabel = new Label("Press N to start new game!");
    this.restartLabel.container.y += 48;
    this.stage.addChild(
      this.gameOverLabel.container,
      this.scoreLabel.container,
      this.highScoreLabel.container,
      this.restartLabel.container
    );
    updateGlobalData(30, this.highScore, this.score);
  }

  update(_elapsedTime: number) {
    if (this.keyboard.isKeyDown("KeyN")) this.done = true;
  }
  addAssetsToLoader(_loader: Loader) {
    alert("bang");
  }
  onDoneLoading(_resources: any) {
    alert("bang");
  }

  endScene = () => {
    const scene = new Playing();
    scene.onDoneLoading(Loader.shared.resources);
    return scene;
  };

  globalDataLoaded = (_globalData: GlobalGameStats) => {};
}
