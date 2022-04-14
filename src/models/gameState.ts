import IMoveable from "../interfaces/iMoveable";
import Pacman from "../game_objects/pacman";
import IAnimatable from "../interfaces/iAnimatable";
import LifeCounter from "../game_objects/life_counter";
import MazeModel from "./mazeModel";
import { Container } from "pixi.js";

export default class GameState {
  movableObjects: IMoveable[];
  animatableObjects: IAnimatable[];
  lifeCounter: LifeCounter;
  mazeModel: MazeModel;
  container: Container;

  constructor() {
    this.container = new Container();
    const pacman = new Pacman(114, 212);
    this.movableObjects = [pacman];
    this.animatableObjects = [pacman];
    this.lifeCounter = new LifeCounter(3);
    this.mazeModel = new MazeModel();
    this.container.addChild(pacman);
    this.container.addChild(this.lifeCounter.container);
  }

  update(elapsedTime: number) {
    for (const object of this.movableObjects) {
      object.inputMove(this);
    }
    for (const object of this.animatableObjects) {
      object.update(elapsedTime);
    }
  }
}
