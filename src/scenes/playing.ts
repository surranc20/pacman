import { Container } from "pixi.js";
import IDrawable from "../interfaces/iDrawable";
import IScene from "../interfaces/iScene";

export default class Playing implements IScene {
  stage = new Container();

  update(elapsedTime: number) {
    for (let child of this.stage.children) {
      let gameObject = child as IDrawable;
      gameObject.update(elapsedTime);
    }
  }
}
