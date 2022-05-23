import { sound } from "@pixi/sound";
import { Container, Loader } from "pixi.js";
import Stage from "../game_objects/stage";
import IScene from "../interfaces/iScene";
import GameState from "../models/gameState";

export default class Playing implements IScene {
  stage = new Container();
  gameState!: GameState;
  intro_playing = true;

  update(elapsedTime: number) {
    if (!this.intro_playing) {
      this.gameState.update(elapsedTime);
    }
  }

  addAssetsToLoader(loader: Loader) {
    loader.add("spritesheet", "/assets/spritesheet.json");
    loader.add("stage", "/assets/img/stage.png");
    sound.add("game_start", "/assets/sounds/game_start.mp3");
  }

  onDoneLoading(resources: any) {
    // Create Stage
    const stage = new Stage(0, 24, resources.stage.texture);
    this.stage.addChild(stage);
    this.gameState = new GameState();
    this.stage.addChild(this.gameState.container);
    sound.play("game_start", () => {
      this.intro_playing = false;
      this.gameState.restartSirenCallback();
      this.gameState.readyLabel.container.visible = false;
    });
  }
}
