import { sound } from "@pixi/sound";
import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";
import { Color } from "../enums/color";
import Ghost from "../game_objects/ghost";
import { getTargetFreightened } from "../utils/ghostTargetingAlgorithms";
import MazeModel from "./mazeModel";

export default class FreightendState {
  ghostsEaten: number;
  mazeModel: MazeModel;
  gameContainer: Container;
  updateScoreCallback: (points: number) => void;
  pointOptions: number[];
  active: boolean;
  restartSirenCallback: () => void;
  timeoutID: NodeJS.Timeout | null;

  constructor(
    mazeModel: MazeModel,
    gameContainer: Container,
    updateScoreCallback: (points: number) => void,
    restartSirenCallback: () => void
  ) {
    this.ghostsEaten = 0;
    this.mazeModel = mazeModel;
    this.gameContainer = gameContainer;
    this.updateScoreCallback = updateScoreCallback;
    this.restartSirenCallback = restartSirenCallback;
    this.pointOptions = [200, 400, 800, 1600];
    this.active = false;
    this.timeoutID = null;
  }

  enterFreightendMode() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      sound.stop("power_siren");
    }
    this.active = true;
    this.ghostsEaten = 0;
    for (const color of Object.values(Color)) {
      if (isNaN(Number(color))) {
        const ghost = this.mazeModel[color];
        if (!ghost.jailed) {
          ghost.agent.targetAI = getTargetFreightened;
          ghost.speedModifier = 0.5;
          ghost.setFreightendTexture();
        }
      }
    }
    sound.play("power_siren", { loop: true });
    this.timeoutID = setTimeout(() => {
      this._freightenedAlmostDone();
    }, 5000);
  }

  _freightenedAlmostDone() {
    for (const color of Object.values(Color)) {
      if (isNaN(Number(color))) {
        const ghost = this.mazeModel[color];
        if (!ghost.jailed && ghost.agent.targetAI === getTargetFreightened) {
          ghost.setBlinkFreightendTexture();
        }
      }
    }
    this.timeoutID = setTimeout(() => {
      this._endFreightened();
    }, 1500);
  }

  _endFreightened() {
    for (const color of Object.values(Color)) {
      if (isNaN(Number(color))) {
        const ghost = this.mazeModel[color];
        if (!ghost.jailed) {
          ghost.setDefaultTexture();

          if (ghost.agent.targetAI === getTargetFreightened) {
            ghost.speedModifier = ghost.defaultSpeedModifier;
            ghost.agent.targetAI = ghost.agent.defaultTargetAI;
          }
        }
      }
    }
    this.active = false;
    sound.stop("power_siren");
    this.restartSirenCallback();
  }

  ghostEatenCallback = (ghost: Ghost) => {
    const pointsGained = this.pointOptions[this.ghostsEaten];
    const pointsLabel = new GhostPointsLabel(
      ghost.x,
      ghost.y - 10,
      Loader.shared.resources.spritesheet.spritesheet?.textures[
        `Ghost Points/${pointsGained}.png`
      ]!
    );
    sound.stop("power_siren");
    this.gameContainer.addChild(pointsLabel);
    this.updateScoreCallback(pointsGained);
    this.ghostsEaten += 1;
    setTimeout(() => {
      pointsLabel.visible = false;
    }, 1000);
  };

  resumeFrightenedCallback = () => {
    if (this.active) {
      sound.play("power_siren", { loop: true });
    }
  };
}

class GhostPointsLabel extends Drawable {}
