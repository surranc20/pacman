import { Container, Loader } from "pixi.js";
import IScene from "../interfaces/iScene";
import Keyboard from "pixi.js-keyboard";
import Playing from "./playing";

export default class GameOver implements IScene {
  stage = new Container();
  done = false;
  keyboard = Keyboard;

  update(_elapsedTime: number) {
    console.log("game over");
    if (this.keyboard.isKeyDown("KeyN")) this.done = true;
  }
  addAssetsToLoader(_loader: Loader) {}
  onDoneLoading(_resources: any) {}
  endScene = () => {
    const scene = new Playing();
    scene.onDoneLoading(Loader.shared.resources);
    return scene;
  };
}
