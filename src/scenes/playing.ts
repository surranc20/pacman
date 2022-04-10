import { Container, Loader } from "pixi.js";
import Pacman from "../game_objects/pacman";
import Stage from "../game_objects/stage";
import IDrawable from "../interfaces/iDrawable";
import IScene from "../interfaces/iScene";
import MazeModel from "../models/mazeModel";

export default class Playing implements IScene {
  stage = new Container();
  mazeModel: MazeModel;
  pacman: any;

  constructor() {
    this.mazeModel = new MazeModel();
  }

  update(elapsedTime: number) {
    for (let child of this.stage.children) {
      let gameObject = child as IDrawable;
      gameObject.update(elapsedTime);
    }
  }

  addAssetsToLoader(loader: Loader) {
    loader.add("pacman_eat", "/assets/img/pacman/pacman_eat.json");
    loader.add("stage", "/assets/img/stage.png");
  }

  onDoneLoading(resources: any) {
    // Create Stage
    const stage = new Stage(0, 24, resources.stage.texture);
    this.stage.addChild(stage);

    // Create Pacman
    const sheet = resources.pacman_eat?.spritesheet;
    this.pacman = new Pacman(sheet?.animations.pacman_eat, 108, 205);

    this.stage.addChild(this.pacman);
  }
}
