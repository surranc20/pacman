import { sound } from "@pixi/sound";
import { Container, Loader } from "pixi.js";
import Stage from "../game_objects/stage";
import IScene from "../interfaces/iScene";
import GameState from "../models/gameState";
import GlobalGameStats from "../models/globalGameStats";
import GameOver from "./gameOver";

export default class Playing implements IScene {
  stage = new Container();
  gameStage!: Stage;
  gameState!: GameState;
  introPlaying = true;
  intermissionPlaying = false;
  done = false;
  globalData: GlobalGameStats | null;

  constructor() {
    this.globalData = null;
  }

  update(elapsedTime: number) {
    if (!this.introPlaying && !this.intermissionPlaying) {
      this.gameState.update(elapsedTime);

      if (this.gameState.level_won) {
        this.intermissionPlaying = true;
        this.gameStage.flashStage(() => {
          this.intermissionPlaying = false;
          this.gameState.loadNextLevel();
        });
        this.gameState.level_won = false;
      }
    }
    this.gameStage.update(elapsedTime);
  }

  addAssetsToLoader(loader: Loader) {
    loader.add("spritesheet", "/assets/spritesheet.json");
    loader.add("stage", "/assets/img/stage.png");
    sound.add("game_start", "/assets/sounds/game_start.mp3");
  }

  onDoneLoading(resources: any) {
    // Create Stage
    this.gameStage = new Stage([resources.stage.texture], 0, 24);
    this.stage.addChild(this.gameStage);

    const highScore = this.globalData ? this.globalData.highScore : 0;
    this.gameState = new GameState(this.outOfLivesCallback, highScore);
    this.stage.addChild(this.gameState.container);
    sound.play("game_start", () => {
      this.introPlaying = false;
      this.gameState.readyLabel.container.visible = false;
      this.gameState.loadNextLevel();
    });
    this.gameStage.loadWhiteStage();
  }

  outOfLivesCallback = () => {
    this.done = true;
  };

  endScene = () => {
    return new GameOver(
      this.gameState.scoreBoard.score,
      this.gameState.highScore.highScore
    );
  };

  globalDataLoaded = (globalData: GlobalGameStats) => {
    this.globalData = globalData;
    if (
      this.gameState &&
      this.globalData.highScore > this.gameState.highScore.highScore
    ) {
      this.gameState.highScore.highScore = this.globalData.highScore;
      this.gameState.highScore.scoreDisplayer.displayScore(
        this.gameState.highScore.highScore
      );
    }
  };
}
