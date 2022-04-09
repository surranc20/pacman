import * as PIXI from "pixi.js";
import { AbstractRenderer } from "pixi.js";
import GameTicker from "./gameTicker";
import Pacman from "../game_objects/pacman";
import Playing from "../scenes/playing";
import IScene from "../interfaces/iScene";

export default class GameManager {
  scene: IScene;
  pacman!: Pacman;
  gameTicker: GameTicker;

  constructor(renderer: AbstractRenderer) {
    this.scene = new Playing();
    this.gameTicker = new GameTicker(60, (elapsedTime: number) => {
      renderer.render(this.scene.stage);
      this.update(elapsedTime);
    });
  }

  update = (elapsedTime: number) => {
    console.log(elapsedTime);
    this.scene.update(elapsedTime);
  };

  loadGame() {
    const loader = PIXI.Loader.shared;
    loader.add("pacman_eat", "/assets/img/pacman_right.json");

    loader.load((_, resources) => {
      const sheet = resources.pacman_eat?.spritesheet;
      this.pacman = new Pacman(sheet?.animations.pacman_right, 50, 50);
      this.scene.stage.addChild(this.pacman);

      this.gameTicker.startTicking();
    });
  }
}
