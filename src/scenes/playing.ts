import { Container, Loader } from "pixi.js";
import Stage from "../game_objects/stage";
import IScene from "../interfaces/iScene";
import GameState from "../models/gameState";

export default class Playing implements IScene {
  stage = new Container();
  gameState!: GameState;

  update(elapsedTime: number) {
    this.gameState.update(elapsedTime);
  }

  addAssetsToLoader(loader: Loader) {
    loader.add("spritesheet", "/assets/spritesheet.json");
    loader.add("stage", "/assets/img/stage.png");
  }

  onDoneLoading(resources: any) {
    // Create Stage
    const stage = new Stage(0, 24, resources.stage.texture);
    this.stage.addChild(stage);
    this.gameState = new GameState();
    this.stage.addChild(this.gameState.container);
  }
}
