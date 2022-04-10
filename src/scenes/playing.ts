import { Container } from "pixi.js";
import IDrawable from "../interfaces/iDrawable";
import IScene from "../interfaces/iScene";
import MazeModel from "../models/mazeModel";

export default class Playing implements IScene {
  stage = new Container();
  mazeModel: MazeModel;

  constructor() {
    this.mazeModel = new MazeModel();
  }

  update(elapsedTime: number) {
    for (let child of this.stage.children) {
      let gameObject = child as IDrawable;
      gameObject.update(elapsedTime);
    }
  }
}
