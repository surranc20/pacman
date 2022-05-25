import { Container } from "pixi.js";
import Label from "../game_objects/label";

export default class GameTicker {
  stop = false;
  frameCount = 0;
  fps: number;
  fpsInterval: number;
  then!: number;
  startTime!: number;
  renderCallback: Function;
  sceneContainer: Container;
  fpsContainer: Container;

  constructor(
    fps: number,
    renderCallback: Function,
    sceneContainer: Container
  ) {
    this.fps = fps;
    this.fpsInterval = 1000 / this.fps;
    this.renderCallback = renderCallback;
    this.sceneContainer = sceneContainer;
    this.fpsContainer = new Container();
    this.sceneContainer.addChild(this.fpsContainer);
  }

  startTicking() {
    this.then = Date.now();
    this.startTime = this.then;
    this.tick();
  }

  tick = () => {
    requestAnimationFrame(this.tick);
    const now = Date.now();
    const elapsedTime = now - this.then;

    if (elapsedTime > this.fpsInterval) {
      this.then = now - (elapsedTime % this.fpsInterval);
      this.renderCallback(elapsedTime / 1000);

      const sinceStart = now - this.startTime;
      const currentFps =
        Math.round((1000 / (sinceStart / ++this.frameCount)) * 100) / 100;
      this.fpsContainer.removeChildren();
      const fpsLabel = new Label(Math.ceil(currentFps).toString());
      fpsLabel.container.x = 200;
      this.fpsContainer.addChild(fpsLabel.container);
    }
  };
}
