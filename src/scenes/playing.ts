import { Container, Loader } from "pixi.js";
import Pacman from "../game_objects/pacman";
import Stage from "../game_objects/stage";
import IScene from "../interfaces/iScene";
import GameState from "../models/gameState";
import MazeModel from "../models/mazeModel";

export default class Playing implements IScene {
  stage = new Container();
  mazeModel: MazeModel;
  gameState!: GameState;

  constructor() {
    this.mazeModel = new MazeModel();
  }

  update(elapsedTime: number) {
    this.gameState.update(elapsedTime);
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
    const pacman = new Pacman(sheet?.animations.pacman_eat, 108, 205);
    this.stage.addChild(pacman);

    this.gameState = new GameState(pacman);
  }
}
