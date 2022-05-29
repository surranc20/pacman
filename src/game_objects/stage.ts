import { Loader } from "pixi.js";
import Animatable from "../abstract/animatable";

export default class Stage extends Animatable {
  flashing = false;
  doneFlashingCallback: any;
  flashes = 0;
  fps = 4;
  maxFlashes = 3;

  update(elapsedTime: number) {
    if (!this.flashing) return;

    const beforeFrame = this.currentFrame;
    super.update(elapsedTime);
    const afterFrame = this.currentFrame;

    if (beforeFrame !== afterFrame && this.currentFrame === 0) {
      this.flashes += 1;
      if (this.flashes === this.maxFlashes) {
        this.flashing = false;
        this.doneFlashingCallback();
        this.flashes = 0;
      }
    }
  }

  flashStage(callback: () => void) {
    this.flashing = true;
    this.doneFlashingCallback = callback;
  }

  loadWhiteStage() {
    if (Loader.shared.resources.stage_white) {
      this.frames.push(Loader.shared.resources.stage_white.texture!);
      return;
    }
    Loader.shared.add("stage_white", "/assets/img/stage_white.png", () => {
      this.frames.push(Loader.shared.resources.stage_white.texture!);
    });
  }
}
