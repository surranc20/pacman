import { AbstractRenderer, Loader } from "pixi.js";
import Keyboard from "pixi.js-keyboard";
import GameTicker from "./gameTicker";
import Playing from "../scenes/playing";
import IScene from "../interfaces/iScene";

export default class GameManager {
  scene: IScene;
  gameTicker: GameTicker;
  keyboard: any;

  constructor(renderer: AbstractRenderer) {
    this.scene = new Playing();
    this.gameTicker = new GameTicker(
      60,
      (elapsedTime: number) => {
        renderer.render(this.scene.stage);
        this.update(elapsedTime);
      },
      this.scene.stage
    );
    this.keyboard = Keyboard;
  }

  update = (elapsedTime: number) => {
    this.scene.update(elapsedTime);
    this.keyboard.update();

    if (this.scene.done) {
      this.scene = this.scene.endScene();
    }
  };

  loadGame() {
    const loader = Loader.shared;
    this.scene.addAssetsToLoader(loader);

    loader.load((_, resources) => {
      this.scene.onDoneLoading(resources);
      this.gameTicker.startTicking();
    });
  }
}
