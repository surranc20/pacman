import { sound } from "@pixi/sound";
import { Container, Loader } from "pixi.js";
import Drawable from "../abstract/drawable";
import { Color } from "../enums/color";
import { GoingToJailState } from "../enums/goingToJail";
import { ReleasingFromJailState } from "../enums/releasingFromJail";
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
  frightTime: number;
  frightBlinkTime: number;
  ghostsFrightened: number;

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
    this.frightTime = 5;
    this.frightBlinkTime = 1.5;
    this.ghostsFrightened = 0;
  }

  enterFreightendMode() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      sound.stop("power_siren");
      this.timeoutID = null;
    }
    this.active = true;
    this.ghostsEaten = 0;
    this.ghostsFrightened = 0;
    for (const color of Object.values(Color)) {
      if (isNaN(Number(color))) {
        const ghost = this.mazeModel[color];
        if (
          !ghost.jailed &&
          ghost.releasingFromJailState === ReleasingFromJailState.NOT_ACTIVE &&
          ghost.goingToJailState === GoingToJailState.NOT_ACTIVE
        ) {
          ghost.agent.targetAI = getTargetFreightened;
          ghost.speedModifier = ghost.frightSpeed;
          ghost.setFreightendTexture();
          this.ghostsFrightened += 1;
        }
      }
    }
    sound.play("power_siren", { loop: true });
    this.timeoutID = setTimeout(() => {
      this._freightenedAlmostDone();
    }, this.frightTime * 1000);
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
    }, this.frightBlinkTime * 1000);
  }

  _endFreightened(restartSirenCallback = true) {
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
    if (restartSirenCallback) {
      this.restartSirenCallback();
    }
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
    this.ghostsFrightened -= 1;

    if (this.ghostsFrightened === 0) {
      if (this.timeoutID) {
        clearTimeout(this.timeoutID);
      }
      this.timeoutID = null;
      this._endFreightened(false);
    }
    setTimeout(() => {
      pointsLabel.visible = false;
    }, 1000);
  };

  resumeFrightenedCallback = () => {
    if (this.active) {
      sound.play("power_siren", { loop: true });
    } else if (this.ghostsFrightened === 0) {
      this.restartSirenCallback();
    }
  };

  interruptedCleanup() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = null;
    }
    this.active = false;
    sound.stop("power_siren");
    for (const color of Object.values(Color)) {
      if (isNaN(Number(color))) {
        const ghost = this.mazeModel[color];
        ghost.setDefaultTexture();
        ghost.speedModifier = ghost.defaultSpeedModifier;
        ghost.agent.targetAI = ghost.agent.defaultTargetAI;
      }
    }
  }
}

class GhostPointsLabel extends Drawable {}
